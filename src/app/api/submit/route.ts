import { NextRequest, NextResponse } from 'next/server'
import { createEvent } from '@/lib/events'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event = await createEvent({
      slug: body.slug,
      name: body.name,
      date: body.date,
      gunStart: body.gunStart,
      distances: body.distances,
      location: body.location,
      lat: Number(body.lat),
      lng: Number(body.lng),
      registrationUrl: body.registrationUrl || undefined,
      description: body.description || undefined,
      status: 'pending',
      source: 'submission',
    })
    return NextResponse.json({ ok: true, event })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    )
  }
}
