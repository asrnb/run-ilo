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
  const distFilter = searchParams.distance
    ? parseInt(searchParams.distance)
    : null
  const events = distFilter
    ? all.filter((e) => e.distances.includes(distFilter))
    : all
  const joinCounts = Object.fromEntries(
    await Promise.all(all.map(async (e) => [e.id, await getJoinCount(e.id).catch(() => 0)]))
  )

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="px-6 pt-14 pb-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-love/10 border border-love/25 rounded-full px-3 py-1 mb-6">
          <span className="text-love text-sm leading-none">♥</span>
          <span className="data-label text-love">The City of Love, Iloilo</span>
        </div>

        <h1 className="font-display font-bold tracking-tight leading-none mb-4">
          <span className="text-[clamp(4rem,12vw,7rem)] block">
            <span className="text-gray-900">run</span>
            <span className="text-sunrise">.</span>
            <span className="bg-gradient-to-r from-festival via-royal to-mango bg-clip-text text-transparent">ilo</span>
          </span>
        </h1>

        <div className="h-px w-40 bg-gradient-to-r from-festival via-sunrise to-mango mb-6" />

        <div className="flex items-start justify-between gap-6">
          <p className="text-gray-500 text-base leading-relaxed max-w-xs">
            Your guide to fun runs and marathons in Iloilo City.{' '}
            <span className="text-gray-400">Lace up and run the City of Love.</span>
            {' '}
            <Link href="/feed" className="text-sunrise hover:underline">Community feed →</Link>
          </p>
          <div className="text-right shrink-0">
            <p className="font-mono text-5xl font-bold text-gray-900 leading-none">{all.length}</p>
            <p className="data-label mt-1.5 leading-tight">upcoming<br />races</p>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="px-6 pb-6 max-w-4xl mx-auto">
        <p className="data-label mb-3">Filter by distance</p>
        <Suspense fallback={null}>
          <EventFilters />
        </Suspense>
      </section>

      {/* ── Race list ── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <h2 className="data-label text-gray-400">
            {distFilter ? `${formatDistance(distFilter)} Races` : 'All Races'}
          </h2>
          <span className="data-label text-gray-300">{events.length} found</span>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-400 py-10 text-center">No races match that filter.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.slug}`}
                  className={[
                    'group flex items-start gap-6 rounded-2xl px-6 py-6',
                    'bg-gray-50 border border-gray-100 border-l-4',
                    cardBorderClass(event.distances),
                    'hover:bg-gray-100 hover:border-gray-200 transition-all',
                  ].join(' ')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="data-label mb-2">{formatDate(event.date)}</p>
                    <h2 className="font-display text-xl font-bold text-gray-900 mb-1.5 group-hover:text-sunrise transition-colors leading-snug">
                      {event.name}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">{event.location}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {joinCounts[event.id] > 0 && (
                        <span className="data-label text-festival bg-festival/10 border border-festival/20 px-2 py-0.5 rounded-full">
                          👟 {joinCounts[event.id]} joining
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {event.distances.map((d) => (
                        <span
                          key={d}
                          className={`data-label px-2 py-0.5 rounded border ${DISTANCE_COLORS[d] ?? 'border-gray-200 text-gray-400'}`}
                        >
                          {formatDistance(d)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0 pt-7">
                    <p className="font-mono text-2xl font-bold text-sunrise leading-none">
                      {formatGunStart(event.gunStart)}
                    </p>
                    <p className="data-label text-gray-300 mt-1">gun start</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 border-t border-gray-100 max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <span className="font-display font-bold text-gray-900 text-sm">
            run<span className="text-sunrise">.</span>ilo
          </span>
          <p className="text-xs text-gray-300 mt-0.5">
            Made with <span className="text-love">♥</span> in Iloilo City
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/feed"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Community
          </Link>
          <Link
            href="/submit"
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:border-sunrise hover:text-sunrise transition-colors"
          >
            Submit a race →
          </Link>
          <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            Admin
          </Link>
        </div>
      </footer>
    </main>
  )
}
