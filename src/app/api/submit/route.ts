import { NextRequest, NextResponse } from 'next/server'
import { createEvent } from '@/lib/events'
import { sendSubmissionConfirmation, sendAdminNotification } from '@/lib/email'

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
      lat: body.lat ? Number(body.lat) : 10.6966,
      lng: body.lng ? Number(body.lng) : 122.5695,
      registrationUrl: body.registrationUrl || undefined,
      description: body.description || undefined,
      route: body.route || undefined,
      organizerEmail: body.organizerEmail || undefined,
      status: 'pending',
      source: 'submission',
    })

    if (body.organizerEmail) {
      await Promise.all([
        sendSubmissionConfirmation(body.organizerEmail, body.name),
        sendAdminNotification(body.name, body.organizerEmail),
      ])
    }

    return NextResponse.json({ ok: true, event })
  } catch (err: unknown) {
    const message = err instanceof Error
      ? err.message
      : (err as { message?: string })?.message ?? JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
