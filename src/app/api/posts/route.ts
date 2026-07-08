import { NextRequest, NextResponse } from 'next/server'
import { createPost, getFeedPosts } from '@/lib/posts'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit') ?? '30')
  try {
    const posts = await getFeedPosts(limit)
    return NextResponse.json({ ok: true, posts })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.authorName?.trim() || !body.content?.trim()) {
      return NextResponse.json({ ok: false, error: 'Name and content are required' }, { status: 400 })
    }
    const post = await createPost({
      raceEventId: body.raceEventId || undefined,
      authorName: body.authorName.trim(),
      content: body.content.trim(),
      kind: body.kind || 'general',
    })
    return NextResponse.json({ ok: true, post })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
