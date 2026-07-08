import { NextRequest, NextResponse } from 'next/server'
import { getEventById } from '@/lib/events'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function icsDate(date: string, time: string) {
  // date: YYYY-MM-DD, time: HH:MM, Philippine time (UTC+8)
  const [y, m, d] = date.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  // convert to UTC: subtract 8 hours
  const utc = new Date(Date.UTC(y, m - 1, d, h - 8, min, 0))
  return [
    utc.getUTCFullYear(),
    pad(utc.getUTCMonth() + 1),
    pad(utc.getUTCDate()),
    'T',
    pad(utc.getUTCHours()),
    pad(utc.getUTCMinutes()),
    '00Z',
  ].join('')
}

function icsNow() {
  const n = new Date()
  return [
    n.getUTCFullYear(),
    pad(n.getUTCMonth() + 1),
    pad(n.getUTCDate()),
    'T',
    pad(n.getUTCHours()),
    pad(n.getUTCMinutes()),
    pad(n.getUTCSeconds()),
    'Z',
  ].join('')
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const event = await getEventById(params.id)
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const start = icsDate(event.date, event.gunStart)
  // estimate end: gun start + 4 hours (covers any distance)
  const [h, min] = event.gunStart.split(':').map(Number)
  const endH = String(h + 4).padStart(2, '0')
  const end = icsDate(event.date, `${endH}:${pad(min)}`)

  const description = [
    event.description ?? '',
    `Distances: ${event.distances.join('km, ')}km`,
    event.registrationUrl ? `Register: ${event.registrationUrl}` : '',
  ].filter(Boolean).join('\\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//run.ilo//run.ilo//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@run.ilo`,
    `DTSTAMP:${icsNow()}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.name}`,
    `LOCATION:${event.location}\\, Iloilo City`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
    },
  })
}
