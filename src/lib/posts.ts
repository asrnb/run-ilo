import { createAnonClient, createServiceClient } from './supabase/server'
import { isSupabaseConfigured } from './events'

export type PostKind = 'general' | 'update' | 'result' | 'recap'

export interface Post {
  id: string
  raceEventId: string | null
  authorName: string
  content: string
  kind: PostKind
  createdAt: string
  reactions: { emoji: string; count: number }[]
  raceName?: string // joined from race_events
  raceSlug?: string
}

interface PostRow {
  id: string
  race_event_id: string | null
  author_name: string
  content: string
  kind: PostKind
  created_at: string
  race_events: { name: string; slug: string } | null
  post_reactions: { emoji: string }[]
}

function countReactions(raw: { emoji: string }[]): { emoji: string; count: number }[] {
  const map: Record<string, number> = {}
  for (const r of raw) map[r.emoji] = (map[r.emoji] ?? 0) + 1
  return Object.entries(map).map(([emoji, count]) => ({ emoji, count }))
}

function fromRow(row: PostRow): Post {
  return {
    id: row.id,
    raceEventId: row.race_event_id,
    authorName: row.author_name,
    content: row.content,
    kind: row.kind,
    createdAt: row.created_at,
    reactions: countReactions(row.post_reactions ?? []),
    raceName: row.race_events?.name,
    raceSlug: row.race_events?.slug,
  }
}

const SELECT = `
  id, race_event_id, author_name, content, kind, created_at,
  race_events ( name, slug ),
  post_reactions ( emoji )
`

// All posts for the global feed (most recent first)
export async function getFeedPosts(limit = 30): Promise<Post[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await createAnonClient()
    .from('posts')
    .select(SELECT)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as PostRow[]).map(fromRow)
}

// Posts tied to a specific race
export async function getPostsByRace(raceEventId: string): Promise<Post[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await createAnonClient()
    .from('posts')
    .select(SELECT)
    .eq('race_event_id', raceEventId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as PostRow[]).map(fromRow)
}

export async function createPost(payload: {
  raceEventId?: string
  authorName: string
  content: string
  kind?: PostKind
}): Promise<Post> {
  if (!isSupabaseConfigured()) {
    return {
      id: crypto.randomUUID(),
      raceEventId: payload.raceEventId ?? null,
      authorName: payload.authorName,
      content: payload.content,
      kind: payload.kind ?? 'general',
      createdAt: new Date().toISOString(),
      reactions: [],
    }
  }
  const { data, error } = await createServiceClient()
    .from('posts')
    .insert({
      race_event_id: payload.raceEventId ?? null,
      author_name: payload.authorName,
      content: payload.content,
      kind: payload.kind ?? 'general',
    })
    .select(SELECT)
    .single()
  if (error) throw error
  return fromRow(data as unknown as PostRow)
}

export async function addReaction(postId: string, emoji: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  const { error } = await createServiceClient()
    .from('post_reactions')
    .insert({ post_id: postId, emoji })
  if (error) throw error
}

export interface Comment {
  id: string
  postId: string
  authorName: string
  content: string
  createdAt: string
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await createAnonClient()
    .from('post_comments')
    .select('id, post_id, author_name, content, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) return []
  return (data as { id: string; post_id: string; author_name: string; content: string; created_at: string }[]).map(r => ({
    id: r.id,
    postId: r.post_id,
    authorName: r.author_name,
    content: r.content,
    createdAt: r.created_at,
  }))
}

export async function addComment(postId: string, authorName: string, content: string): Promise<Comment> {
  if (!isSupabaseConfigured()) {
    return { id: crypto.randomUUID(), postId, authorName, content, createdAt: new Date().toISOString() }
  }
  const { data, error } = await createServiceClient()
    .from('post_comments')
    .insert({ post_id: postId, author_name: authorName, content })
    .select()
    .single()
  if (error) throw error
  const r = data as { id: string; post_id: string; author_name: string; content: string; created_at: string }
  return { id: r.id, postId: r.post_id, authorName: r.author_name, content: r.content, createdAt: r.created_at }
}
