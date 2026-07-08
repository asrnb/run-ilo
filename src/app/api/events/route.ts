import { NextRequest, NextResponse } from 'next/server'
import { createEvent, updateEventStatus, deleteEvent, getEventById, isSupabaseConfigured } from '@/lib/events'
import { getSessionUser, checkIsAdmin } from '@/lib/auth'
import { sendApprovalEmail } from '@/lib/email'
import { RaceRoute, RaceStatus } from '@/lib/types'

async function requireAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured()) return true // demo mode — no auth
  const user = await getSessionUser()
  if (!user) return false
  return checkIsAdmin(user.id)
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
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
      bannerUrl: body.bannerUrl || undefined,
      status: 'published',
      source: 'admin',
    })
    return NextResponse.json({ ok: true, event })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    await deleteEvent(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, status, route, bannerUrl } = await req.json()
    const event = await getEventById(id)
    await updateEventStatus(id, status as RaceStatus, route as RaceRoute | undefined, bannerUrl as string | undefined)
    if (event?.organizerEmail && (status === 'published' || status === 'rejected')) {
      await sendApprovalEmail(event.organizerEmail, event.name, status as 'published' | 'rejected')
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
