import { createAnonClient, createServiceClient } from './supabase/server'
import { isSupabaseConfigured } from './events'

export interface RaceResult {
  id: string
  raceEventId: string
  bib: string | null
  runnerName: string
  finishTime: string
  category: string | null
  rank: number | null
  createdAt: string
}

interface ResultRow {
  id: string
  race_event_id: string
  bib: string | null
  runner_name: string
  finish_time: string
  category: string | null
  rank: number | null
  created_at: string
}

function fromRow(r: ResultRow): RaceResult {
  return {
    id: r.id,
    raceEventId: r.race_event_id,
    bib: r.bib,
    runnerName: r.runner_name,
    finishTime: r.finish_time,
    category: r.category,
    rank: r.rank,
    createdAt: r.created_at,
  }
}

export async function getResultsByRace(raceEventId: string): Promise<RaceResult[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await createAnonClient()
    .from('race_results')
    .select('*')
    .eq('race_event_id', raceEventId)
    .order('rank', { ascending: true, nullsFirst: false })
  if (error) return []
  return (data as ResultRow[]).map(fromRow)
}

export async function searchResults(raceEventId: string, query: string): Promise<RaceResult[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await createAnonClient()
    .from('race_results')
    .select('*')
    .eq('race_event_id', raceEventId)
    .ilike('runner_name', `%${query}%`)
    .order('rank', { ascending: true, nullsFirst: false })
    .limit(20)
  if (error) return []
  return (data as ResultRow[]).map(fromRow)
}

export async function createResult(payload: Omit<RaceResult, 'id' | 'createdAt'>): Promise<RaceResult> {
  if (!isSupabaseConfigured()) {
    return { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  }
  const { data, error } = await createServiceClient()
    .from('race_results')
    .insert({
      race_event_id: payload.raceEventId,
      bib: payload.bib,
      runner_name: payload.runnerName,
      finish_time: payload.finishTime,
      category: payload.category,
      rank: payload.rank,
    })
    .select()
    .single()
  if (error) throw error
  return fromRow(data as ResultRow)
}

export async function deleteResult(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  const { error } = await createServiceClient()
    .from('race_results')
    .delete()
    .eq('id', id)
  if (error) throw error
}
