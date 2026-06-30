import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/events'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import EventMapLoader from '@/components/event-map-loader'
import type { Metadata } from 'next'

interface EventPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return {}
  return { title: `${event.name} — run.ilo` }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug)
  if (!event) notFound()

  return (
    <main className="min-h-screen bg-predawn-900 px-6 py-12 max-w-2xl mx-auto">
      <Link
        href="/"
        className="data-label text-predawn-400 hover:text-white mb-10 inline-block transition-colors"
      >
        ← All races
      </Link>

      <div className="startline mb-8">
        <p className="data-label text-sunrise mb-2">{formatDate(event.date)}</p>
        <h1 className="font-display text-3xl font-bold text-white leading-tight">
          {event.name}
        </h1>
      </div>

      <div className="space-y-6 mb-10">
        <div>
          <p className="data-label mb-1.5">Location</p>
          <p className="text-white">{event.location}</p>
        </div>

        <div>
          <p className="data-label mb-1.5">Gun Start</p>
          <p className="font-mono text-2xl text-white">
            {formatGunStart(event.gunStart)}
          </p>
        </div>

        <div>
          <p className="data-label mb-2">Distances</p>
          <div className="flex gap-2 flex-wrap">
            {event.distances.map((d) => (
              <span
                key={d}
                className={[
                  'data-label px-3 py-1 rounded-lg border',
                  d === 42
                    ? 'border-mango/60 text-mango bg-mango/10'
                    : 'border-predawn-600 text-predawn-300',
                ].join(' ')}
              >
                {formatDistance(d)}
              </span>
            ))}
          </div>
        </div>

        {event.description && (
          <div>
            <p className="data-label mb-1.5">About</p>
            <p className="text-predawn-300 leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sunrise text-predawn-900 font-display font-semibold px-6 py-3 rounded-xl hover:bg-sunrise/90 transition-colors"
          >
            Register Now →
          </a>
        )}
      </div>

      <div className="rounded-xl overflow-hidden">
        <EventMapLoader lat={event.lat} lng={event.lng} name={event.name} />
      </div>
    </main>
  )
}
