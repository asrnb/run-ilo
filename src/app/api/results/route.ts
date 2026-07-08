import { NextRequest, NextResponse } from 'next/server'
import { createResult, searchResults, getResultsByRace } from '@/lib/results'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const raceEventId = searchParams.get('raceEventId')
  const query = searchParams.get('q')
  if (!raceEventId) return NextResponse.json({ ok: false, error: 'raceEventId required' }, { status: 400 })
  const results = query
    ? await searchResults(raceEventId, query)
    : await getResultsByRace(raceEventId)
  return NextResponse.json({ ok: true, results })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.raceEventId || !body.runnerName?.trim() || !body.finishTime?.trim()) {
      return NextResponse.json({ ok: false, error: 'raceEventId, runnerName, and finishTime required' }, { status: 400 })
    }
    const result = await createResult({
      raceEventId: body.raceEventId,
      bib: body.bib || null,
      runnerName: body.runnerName.trim(),
      finishTime: body.finishTime.trim(),
      category: body.category || null,
      rank: body.rank ? Number(body.rank) : null,
    })
    return NextResponse.json({ ok: true, result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
