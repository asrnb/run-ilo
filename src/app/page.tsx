import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedEvents, getJoinCount } from '@/lib/events'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import EventFilters from '@/components/EventFilters'

interface HomePageProps {
  searchParams: { distance?: string }
}

const DISTANCE_COLORS: Record<number, string> = {
  5:  'border-festival/60 text-festival',
  10: 'border-royal/60 text-royal',
  21: 'border-sunrise/60 text-sunrise',
  42: 'border-mango/60 text-mango',
}

function cardBorderClass(distances: number[]) {
  if (distances.includes(42)) return 'border-l-mango'
  if (distances.includes(21)) return 'border-l-sunrise'
  if (distances.includes(10)) return 'border-l-royal'
  return 'border-l-festival'
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const all = await getPublishedEvents()
  const distFilter = searchParams.distance ? parseInt(searchParams.distance) : null
  const events = distFilter ? all.filter((e) => e.distances.includes(distFilter)) : all
  const joinCounts = Object.fromEntries(
    await Promise.all(all.map(async (e) => [e.id, await getJoinCount(e.id).catch(() => 0)]))
  )

  return (
    <div>
      {/* ── Hero ── */}
      <section className="px-4 pt-8 pb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-love/10 border border-love/25 rounded-full px-3 py-1 mb-5">
          <span className="text-love text-sm leading-none">♥</span>
          <span className="data-label text-love">The City of Love, Iloilo</span>
        </div>

        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-predawn-400 text-sm leading-relaxed max-w-xs">
              Fun runs and marathons in Iloilo City.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono text-4xl font-bold text-white leading-none">{all.length}</p>
            <p className="data-label mt-1 leading-tight">upcoming<br />races</p>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="px-4 pb-4 max-w-2xl mx-auto">
        <p className="data-label mb-3">Filter by distance</p>
        <Suspense fallback={null}>
          <EventFilters />
        </Suspense>
      </section>

      {/* ── Race list ── */}
      <section className="px-4 pb-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-predawn-800">
          <h2 className="data-label">
            {distFilter ? `${formatDistance(distFilter)} Races` : 'All Races'}
          </h2>
          <span className="data-label text-predawn-600">{events.length} found</span>
        </div>

        {events.length === 0 ? (
          <p className="text-predawn-500 py-10 text-center">No races match that filter.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.slug}`}
                  className={[
                    'group flex items-start gap-4 rounded-2xl px-4 py-5',
                    'bg-predawn-800 border border-predawn-700 border-l-4',
                    cardBorderClass(event.distances),
                    'hover:bg-predawn-700 transition-all',
                  ].join(' ')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="data-label mb-1.5">{formatDate(event.date)}</p>
                    <h2 className="font-display text-lg font-bold text-white mb-1 group-hover:text-sunrise transition-colors leading-snug">
                      {event.name}
                    </h2>
                    <p className="text-predawn-400 text-sm mb-3">{event.location}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {joinCounts[event.id] > 0 && (
                        <span className="data-label text-festival bg-festival/10 border border-festival/20 px-2 py-0.5 rounded-full">
                          👟 {joinCounts[event.id]} joining
                        </span>
                      )}
                      {event.distances.map((d) => (
                        <span key={d} className={`data-label px-2 py-0.5 rounded border ${DISTANCE_COLORS[d] ?? 'border-predawn-600 text-predawn-400'}`}>
                          {formatDistance(d)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pt-6">
                    <p className="font-mono text-xl font-bold text-sunrise leading-none">
                      {formatGunStart(event.gunStart)}
                    </p>
                    <p className="data-label text-predawn-600 mt-1">gun start</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 py-6 border-t border-predawn-800 max-w-2xl mx-auto flex justify-between items-center">
        <p className="text-xs text-predawn-600">
          Made with <span className="text-love">♥</span> in Iloilo City
        </p>
        <Link href="/admin" className="text-xs text-predawn-700 hover:text-predawn-400 transition-colors">
          Admin
        </Link>
      </footer>
    </div>
  )
}
