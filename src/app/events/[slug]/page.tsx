import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getEventBySlug, getJoinCount } from '@/lib/events'
import { getPostsByRace } from '@/lib/posts'
import { getResultsByRace } from '@/lib/results'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import EventMapLoader from '@/components/event-map-loader'
import RaceFeed from '@/components/RaceFeed'
import RaceResults from '@/components/RaceResults'
import JoinButton from '@/components/JoinButton'
import type { Metadata } from 'next'

function googleCalendarUrl(event: { name: string; date: string; gunStart: string; location: string; description?: string }) {
  const [y, m, d] = event.date.split('-').map(Number)
  const [h, min] = event.gunStart.split(':').map(Number)
  // convert Philippine time (UTC+8) to UTC
  const start = new Date(Date.UTC(y, m - 1, d, h - 8, min))
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000) // +4 hours
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, '').replace('.000', '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${event.location}, Iloilo City`,
    details: event.description ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

interface EventPageProps {
  params: { slug: string }
}

const DISTANCE_COLORS: Record<number, string> = {
  5:  'border-festival/60 text-festival bg-festival/10',
  10: 'border-royal/60 text-royal bg-royal/10',
  21: 'border-sunrise/60 text-sunrise bg-sunrise/10',
  42: 'border-mango/60 text-mango bg-mango/10',
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return {}
  const title = `${event.name} — run.ilo`
  const description = `${formatDate(event.date)} · ${event.location} · Gun start ${formatGunStart(event.gunStart)}`
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug)
  if (!event) notFound()
  const [racePosts, joinCount, results] = await Promise.all([
    getPostsByRace(event.id).catch(() => []),
    getJoinCount(event.id).catch(() => 0),
    getResultsByRace(event.id).catch(() => []),
  ])

  return (
    <div className="max-w-2xl mx-auto">
      {event.bannerUrl && (
        <div className="relative w-full h-48 sm:h-64 mb-0">
          <Image src={event.bannerUrl} alt={event.name} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-predawn-900" />
        </div>
      )}

      <div className="px-4 py-8">
      <Link href="/" className="data-label text-predawn-500 hover:text-predawn-200 mb-8 inline-block transition-colors">
        ← All races
      </Link>

      <div className="border-l-4 border-sunrise pl-4 mb-8">
        <p className="data-label text-sunrise mb-2">{formatDate(event.date)}</p>
        <h1 className="font-display text-3xl font-bold text-white leading-tight">
          {event.name}
        </h1>
      </div>

      <div className="space-y-6 mb-10 divide-y divide-predawn-800">
        <div>
          <p className="data-label mb-1.5">Location</p>
          <p className="text-predawn-100">{event.location}</p>
        </div>

        <div className="pt-6">
          <p className="data-label mb-1.5">Gun Start</p>
          <p className="font-mono text-3xl font-bold text-sunrise">
            {formatGunStart(event.gunStart)}
          </p>
        </div>

        <div className="pt-6">
          <p className="data-label mb-2">Distances</p>
          <div className="flex gap-2 flex-wrap">
            {event.distances.map((d) => (
              <span key={d} className={`data-label px-3 py-1 rounded-lg border ${DISTANCE_COLORS[d] ?? 'border-predawn-700 text-predawn-400'}`}>
                {formatDistance(d)}
              </span>
            ))}
          </div>
        </div>

        {event.description && (
          <div className="pt-6">
            <p className="data-label mb-1.5">About</p>
            <p className="text-predawn-300 leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-10">
        <JoinButton raceId={event.id} initialCount={joinCount} />
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-predawn-700 text-predawn-300 hover:border-royal hover:text-royal transition-colors"
        >
          <span>📅</span>
          <span>Add to Calendar</span>
        </a>
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sunrise text-white font-display font-semibold px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors"
          >
            Register Now →
          </a>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-predawn-800">
        <EventMapLoader lat={event.lat} lng={event.lng} name={event.name} route={event.route} />
      </div>

      <RaceResults raceEventId={event.id} initialResults={results} />

      <div className="mt-10">
        <RaceFeed raceEventId={event.id} initialPosts={racePosts} />
      </div>
      </div>
    </div>
  )
}
