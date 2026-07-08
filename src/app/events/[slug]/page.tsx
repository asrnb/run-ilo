import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventBySlug, getJoinCount } from '@/lib/events'
import { getPostsByRace } from '@/lib/posts'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import EventMapLoader from '@/components/event-map-loader'
import RaceFeed from '@/components/RaceFeed'
import JoinButton from '@/components/JoinButton'
import type { Metadata } from 'next'

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
  const [racePosts, joinCount] = await Promise.all([
    getPostsByRace(event.id).catch(() => []),
    getJoinCount(event.id).catch(() => 0),
  ])

  return (
    <main className="min-h-screen bg-white px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="data-label text-gray-400 hover:text-gray-900 mb-10 inline-block transition-colors">
        ← All races
      </Link>

      <div className="border-l-4 border-sunrise pl-4 mb-8">
        <p className="data-label text-sunrise mb-2">{formatDate(event.date)}</p>
        <h1 className="font-display text-3xl font-bold text-gray-900 leading-tight">
          {event.name}
        </h1>
      </div>

      <div className="space-y-6 mb-10 divide-y divide-gray-100">
        <div>
          <p className="data-label mb-1.5">Location</p>
          <p className="text-gray-900">{event.location}</p>
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
              <span key={d} className={`data-label px-3 py-1 rounded-lg border ${DISTANCE_COLORS[d] ?? 'border-gray-200 text-gray-600'}`}>
                {formatDistance(d)}
              </span>
            ))}
          </div>
        </div>

        {event.description && (
          <div className="pt-6">
            <p className="data-label mb-1.5">About</p>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-10">
        <JoinButton raceId={event.id} initialCount={joinCount} />
        <a
          href={`/api/events/${event.id}/ics`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:border-royal hover:text-royal transition-colors bg-white"
        >
          <span>📅</span>
          <span>Add to Calendar</span>
        </a>
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sunrise text-white font-display font-semibold px-6 py-3 rounded-xl hover:bg-sunrise/90 transition-colors"
          >
            Register Now →
          </a>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-100">
        <EventMapLoader lat={event.lat} lng={event.lng} name={event.name} route={event.route} />
      </div>

      <div className="mt-10">
        <RaceFeed raceEventId={event.id} initialPosts={racePosts} />
      </div>

      <footer className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
        <Link href="/" className="data-label text-gray-400 hover:text-gray-900 transition-colors">← run.ilo</Link>
        <span className="text-xs text-gray-300">Made with <span className="text-love">♥</span> in Iloilo City</span>
      </footer>
    </main>
  )
}
