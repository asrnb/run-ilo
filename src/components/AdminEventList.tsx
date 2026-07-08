'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { RaceEvent, RaceRoute, RaceStatus } from '@/lib/types'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import { parseGPX } from '@/lib/gpx'
import RouteTracerLoader from './route-tracer-loader'
import BannerUpload from './BannerUpload'

const INPUT_SM = 'bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors'

interface ResultForm { bib: string; runnerName: string; finishTime: string; category: string; rank: string }
const EMPTY_RESULT: ResultForm = { bib: '', runnerName: '', finishTime: '', category: '', rank: '' }

export default function AdminEventList({ events }: { events: RaceEvent[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [routes, setRoutes] = useState<Record<string, RaceRoute>>({})
  const [routeModes, setRouteModes] = useState<Record<string, 'none' | 'gpx' | 'trace'>>({})
  const [banners, setBanners] = useState<Record<string, string>>({})
  const [resultForms, setResultForms] = useState<Record<string, ResultForm>>({})
  const [resultSaving, setResultSaving] = useState<string | null>(null)

  function getRoute(id: string, fallback?: RaceRoute): RaceRoute {
    return routes[id] ?? fallback ?? []
  }
  function setRoute(id: string, r: RaceRoute) {
    setRoutes((prev) => ({ ...prev, [id]: r }))
  }
  function setRouteMode(id: string, mode: 'none' | 'gpx' | 'trace') {
    setRouteModes((prev) => ({ ...prev, [id]: mode }))
  }
  function getResultForm(id: string): ResultForm {
    return resultForms[id] ?? EMPTY_RESULT
  }
  function setResultForm(id: string, f: Partial<ResultForm>) {
    setResultForms(prev => ({ ...prev, [id]: { ...getResultForm(id), ...f } }))
  }

  function handleGPX(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseGPX(ev.target?.result as string)
      if (parsed.length > 0) setRoute(id, parsed)
    }
    reader.readAsText(file)
  }

  async function approve(event: RaceEvent) {
    setLoading(event.id)
    const route = getRoute(event.id, event.route)
    const bannerUrl = banners[event.id]
    await fetch('/api/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: event.id,
        status: 'published',
        route: route.length > 1 ? route : undefined,
        bannerUrl: bannerUrl || undefined,
      }),
    })
    setLoading(null)
    router.refresh()
  }

  async function setStatus(id: string, status: RaceStatus) {
    setLoading(id)
    await fetch('/api/events', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setLoading(null)
    router.refresh()
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(id)
    await fetch('/api/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setLoading(null)
    router.refresh()
  }

  async function saveResult(eventId: string) {
    const f = getResultForm(eventId)
    if (!f.runnerName.trim() || !f.finishTime.trim()) return
    setResultSaving(eventId)
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raceEventId: eventId,
          bib: f.bib || null,
          runnerName: f.runnerName,
          finishTime: f.finishTime,
          category: f.category || null,
          rank: f.rank ? Number(f.rank) : null,
        }),
      })
      setResultForm(eventId, EMPTY_RESULT)
    } finally {
      setResultSaving(null)
    }
  }

  const pending = events.filter((e) => e.status === 'pending')
  const rest = events.filter((e) => e.status !== 'pending')

  return (
    <div className="space-y-10">
      {/* ── Pending ── */}
      <section>
        <h2 className="font-display text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Pending Review <span className="data-label">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <p className="data-label text-gray-300">No pending submissions.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {pending.map((event) => {
              const isOpen = expanded === event.id
              const routeMode = routeModes[event.id] ?? 'none'
              const currentRoute = getRoute(event.id, event.route)
              const mapCenter: [number, number] = [event.lat, event.lng]

              return (
                <li key={event.id} className="bg-white">
                  <button type="button" onClick={() => setExpanded(isOpen ? null : event.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="data-label mb-0.5">{formatDate(event.date)}</p>
                      <p className="font-display font-semibold text-gray-900">{event.name}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{event.location}</p>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-50 space-y-4">
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3">
                        <div>
                          <p className="data-label text-gray-300">Gun Start</p>
                          <p className="font-mono text-sm text-gray-700">{formatGunStart(event.gunStart)}</p>
                        </div>
                        <div>
                          <p className="data-label text-gray-300">Distances</p>
                          <p className="text-sm text-gray-700">{event.distances.map(formatDistance).join(', ')}</p>
                        </div>
                        {event.organizerEmail && (
                          <div>
                            <p className="data-label text-gray-300">Organizer</p>
                            <p className="text-sm text-gray-700">{event.organizerEmail}</p>
                          </div>
                        )}
                        {event.registrationUrl && (
                          <div>
                            <p className="data-label text-gray-300">Registration</p>
                            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
                              className="text-sm text-royal hover:underline truncate max-w-[200px] block">
                              {event.registrationUrl}
                            </a>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
                      )}

                      {/* Banner */}
                      <div>
                        <p className="data-label mb-2">Banner Image</p>
                        <BannerUpload
                          slug={event.slug}
                          currentUrl={banners[event.id] ?? event.bannerUrl}
                          onUploaded={(url) => setBanners(prev => ({ ...prev, [event.id]: url }))}
                        />
                      </div>

                      {/* Route editor */}
                      <div>
                        <p className="data-label mb-2">
                          Race Route
                          {event.route && event.route.length > 1 && (
                            <span className="ml-2 text-festival">✓ submitted with route</span>
                          )}
                        </p>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <button type="button" onClick={() => setRouteMode(event.id, routeMode === 'gpx' ? 'none' : 'gpx')}
                            className={['data-label px-3 py-1.5 rounded-full border transition-all',
                              routeMode === 'gpx' ? 'bg-royal border-royal text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'].join(' ')}>
                            Upload GPX
                          </button>
                          <button type="button" onClick={() => setRouteMode(event.id, routeMode === 'trace' ? 'none' : 'trace')}
                            className={['data-label px-3 py-1.5 rounded-full border transition-all',
                              routeMode === 'trace' ? 'bg-royal border-royal text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'].join(' ')}>
                            Trace on Map
                          </button>
                          {currentRoute.length > 0 && (
                            <button type="button" onClick={() => setRoute(event.id, [])}
                              className="data-label px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-all">
                              Clear Route
                            </button>
                          )}
                        </div>
                        {routeMode === 'gpx' && (
                          <div>
                            <input type="file" accept=".gpx" onChange={(e) => handleGPX(event.id, e)}
                              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-200 file:text-xs file:text-gray-500 file:bg-white hover:file:border-gray-400 transition-colors" />
                            {currentRoute.length > 0 && (
                              <p className="data-label text-festival mt-1.5">✓ {currentRoute.length} points loaded</p>
                            )}
                          </div>
                        )}
                        {routeMode === 'trace' && (
                          <RouteTracerLoader center={mapCenter} route={currentRoute} onChange={(r) => setRoute(event.id, r)} />
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button onClick={() => approve(event)} disabled={loading === event.id}
                          className="bg-sunrise text-white font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-sunrise/90 disabled:opacity-50 transition-colors">
                          Approve
                        </button>
                        <button onClick={() => setStatus(event.id, 'rejected')} disabled={loading === event.id}
                          className="border border-gray-200 text-gray-500 text-sm px-4 py-1.5 rounded-lg hover:border-gray-400 disabled:opacity-50 transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ── All Events ── */}
      <section>
        <h2 className="font-display text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          All Events <span className="data-label">({rest.length})</span>
        </h2>
        {rest.length === 0 ? (
          <p className="data-label text-gray-300">None yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {rest.map((event) => {
              const isOpen = expanded === event.id
              const rf = getResultForm(event.id)
              return (
                <li key={event.id} className="bg-white">
                  <div className="px-5 py-3 flex justify-between items-center">
                    <div>
                      <p className="data-label mb-0.5">{formatDate(event.date)}</p>
                      <p className="font-display text-sm text-gray-900">{event.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={['data-label px-2 py-0.5 rounded border',
                        event.status === 'published' ? 'border-sunrise/40 text-sunrise' : 'border-gray-200 text-gray-400'].join(' ')}>
                        {event.status}
                      </span>
                      <button onClick={() => setExpanded(isOpen ? null : event.id)}
                        className="border border-gray-200 text-gray-400 hover:border-gray-400 transition-colors rounded-lg p-1.5">
                        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <button onClick={() => handleDelete(event.id, event.name)} disabled={loading === event.id}
                        className="border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-50 transition-colors rounded-lg p-1.5">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-50 space-y-4 pt-4">
                      {/* Banner */}
                      <div>
                        <p className="data-label mb-2">Banner Image</p>
                        <BannerUpload
                          slug={event.slug}
                          currentUrl={banners[event.id] ?? event.bannerUrl}
                          onUploaded={(url) => setBanners(prev => ({ ...prev, [event.id]: url }))}
                        />
                      </div>

                      {/* Post a result */}
                      <div>
                        <p className="data-label mb-2">Post a Result</p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input value={rf.runnerName} onChange={e => setResultForm(event.id, { runnerName: e.target.value })}
                            placeholder="Runner name *" className={`${INPUT_SM} col-span-2`} />
                          <input value={rf.finishTime} onChange={e => setResultForm(event.id, { finishTime: e.target.value })}
                            placeholder="Finish time * (e.g. 1:23:45)" className={INPUT_SM} />
                          <input value={rf.bib} onChange={e => setResultForm(event.id, { bib: e.target.value })}
                            placeholder="Bib #" className={INPUT_SM} />
                          <input value={rf.category} onChange={e => setResultForm(event.id, { category: e.target.value })}
                            placeholder="Category (e.g. 5K, Overall)" className={INPUT_SM} />
                          <input type="number" value={rf.rank} onChange={e => setResultForm(event.id, { rank: e.target.value })}
                            placeholder="Rank" className={INPUT_SM} />
                        </div>
                        <button
                          onClick={() => saveResult(event.id)}
                          disabled={resultSaving === event.id || !rf.runnerName.trim() || !rf.finishTime.trim()}
                          className="data-label px-4 py-1.5 rounded-lg bg-festival/10 border border-festival/30 text-festival hover:bg-festival/20 disabled:opacity-40 transition-colors"
                        >
                          {resultSaving === event.id ? 'Saving…' : '+ Add Result'}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
