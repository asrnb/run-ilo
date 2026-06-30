import { NextRequest, NextResponse } from 'next/server'
import { createEvent, updateEventStatus } from '@/lib/events'
import { RaceStatus } from '@/lib/types'

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
      status: 'published',
      source: 'admin',
    })
    return NextResponse.json({ ok: true, event })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    await updateEventStatus(id, status as RaceStatus)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    )
  }
}
