import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedEvents } from '@/lib/events'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import EventFilters from '@/components/EventFilters'

interface HomePageProps {
  searchParams: { distance?: string }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const all = await getPublishedEvents()
  const distFilter = searchParams.distance
    ? parseInt(searchParams.distance)
    : null
  const events = distFilter
    ? all.filter((e) => e.distances.includes(distFilter))
    : all

  return (
    <main className="min-h-screen bg-predawn-900">
      {/* Hero */}
      <section className="px-6 pt-16 pb-10 max-w-4xl mx-auto">
        <p className="data-label text-sunrise mb-3">Iloilo City, Philippines</p>
        <h1 className="font-display text-5xl font-bold text-white mb-3 tracking-tight">
          run<span className="text-sunrise">.</span>ilo
        </h1>
        <p className="text-predawn-300 text-lg max-w-lg">
          Community directory of fun runs and marathons in Iloilo City.
        </p>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8 max-w-4xl mx-auto">
        <Suspense fallback={null}>
          <EventFilters />
        </Suspense>
      </section>

      {/* Race list */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        {events.length === 0 ? (
          <p className="text-predawn-400">No races match that filter.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.slug}`}
                  className="block bg-predawn-800 rounded-2xl p-6 hover:bg-predawn-700 transition-colors group"
                >
                  <p className="data-label mb-1">{formatDate(event.date)}</p>
                  <h2 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-sunrise transition-colors">
                    {event.name}
                  </h2>
                  <p className="text-predawn-400 text-sm mb-4">
                    {event.location}
                  </p>
                  <div className="flex gap-2 flex-wrap items-center">
                    {event.distances.map((d) => (
                      <span
                        key={d}
                        className={[
                          'data-label px-2 py-0.5 rounded border',
                          d === 42
                            ? 'border-mango/60 text-mango'
                            : 'border-predawn-600 text-predawn-400',
                        ].join(' ')}
                      >
                        {formatDistance(d)}
                      </span>
                    ))}
                    <span className="data-label text-predawn-500 ml-auto">
                      Gun {formatGunStart(event.gunStart)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-predawn-800 max-w-4xl mx-auto flex justify-between items-center">
        <span className="data-label text-predawn-600">run.ilo</span>
        <Link
          href="/submit"
          className="text-sm text-sunrise hover:underline"
        >
          Submit your race →
        </Link>
      </footer>
    </main>
  )
}
