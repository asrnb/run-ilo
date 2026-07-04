import { SAMPLE_EVENTS } from '@/data/sample-events'
import { RaceEvent, RaceEventRow, RaceRoute, RaceStatus } from './types'
import { createAnonClient, createServiceClient } from './supabase/server'

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function fromRow(row: RaceEventRow): RaceEvent {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    gunStart: row.gun_start,
    distances: row.distances,
    location: row.location,
    lat: row.lat,
    lng: row.lng,
    route: row.route ?? undefined,
    registrationUrl: row.registration_url ?? undefined,
    description: row.description ?? undefined,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
  }
}

export async function getPublishedEvents(): Promise<RaceEvent[]> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_EVENTS.filter((e) => e.status === 'published')
  }
  const { data, error } = await createAnonClient()
    .from('race_events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true })
  if (error) throw error
  return (data as RaceEventRow[]).map(fromRow)
}

export async function getEventBySlug(slug: string): Promise<RaceEvent | null> {
  if (!isSupabaseConfigured()) {
    return (
      SAMPLE_EVENTS.find((e) => e.slug === slug && e.status === 'published') ??
      null
    )
  }
  const { data, error } = await createAnonClient()
    .from('race_events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return fromRow(data as RaceEventRow)
}

export async function getAllEvents(): Promise<RaceEvent[]> {
  if (!isSupabaseConfigured()) return SAMPLE_EVENTS
  const { data, error } = await createServiceClient()
    .from('race_events')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as RaceEventRow[]).map(fromRow)
}

export async function createEvent(
  payload: Omit<RaceEvent, 'id' | 'createdAt'>,
): Promise<RaceEvent> {
  if (!isSupabaseConfigured()) {
    return {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
  }
  const { data, error } = await createServiceClient()
    .from('race_events')
    .insert({
      slug: payload.slug,
      name: payload.name,
      date: payload.date,
      gun_start: payload.gunStart,
      distances: payload.distances,
      location: payload.location,
      lat: payload.lat,
      lng: payload.lng,
      registration_url: payload.registrationUrl ?? null,
      description: payload.description ?? null,
      route: payload.route ?? null,
      status: payload.status,
      source: payload.source,
    })
    .select()
    .single()
  if (error) throw error
  return fromRow(data as RaceEventRow)
}

export async function updateEventStatus(
  id: string,
  status: RaceStatus,
  route?: RaceRoute,
): Promise<void> {
  if (!isSupabaseConfigured()) return
  const patch: Record<string, unknown> = { status }
  if (route !== undefined) patch.route = route.length > 1 ? route : null
  const { error } = await createServiceClient()
    .from('race_events')
    .update(patch)
    .eq('id', id)
  if (error) throw error
}

export async function deleteEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  const { error } = await createServiceClient()
    .from('race_events')
    .delete()
    .eq('id', id)
  if (error) throw error
}
