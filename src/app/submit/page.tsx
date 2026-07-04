'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toSlug } from '@/lib/format'
import { parseGPX } from '@/lib/gpx'
import RouteTracerLoader from '@/components/route-tracer-loader'

const DISTANCES = [5, 10, 21, 42]
const DISTANCE_LABELS: Record<number, string> = { 5: '5K', 10: '10K', 21: '21K Half', 42: '42K Full' }

const PILL_ACTIVE: Record<number, string> = {
  5:  'bg-festival border-festival text-white',
  10: 'bg-royal border-royal text-white',
  21: 'bg-sunrise border-sunrise text-white',
  42: 'bg-mango border-mango text-gray-900',
}
const PILL_INACTIVE: Record<number, string> = {
  5:  'border-festival/40 text-festival/70 hover:border-festival',
  10: 'border-royal/40 text-royal/70 hover:border-royal',
  21: 'border-sunrise/40 text-sunrise/70 hover:border-sunrise',
  42: 'border-mango/40 text-mango/70 hover:border-mango',
}

const INPUT = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors'
const ILOILO: [number, number] = [10.6966, 122.5695]

type State = 'idle' | 'loading' | 'success' | 'error'

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '', date: '', gunStart: '', distances: [] as number[],
    location: '', registrationUrl: '', description: '',
  })
  const [route, setRoute] = useState<[number, number][]>([])
  const [routeMode, setRouteMode] = useState<'none' | 'gpx' | 'trace'>('none')
  const [state, setState] = useState<State>('idle')

  function toggleDistance(d: number) {
    setForm((f) => ({
      ...f,
      distances: f.distances.includes(d)
        ? f.distances.filter((x) => x !== d)
        : [...f.distances, d].sort((a, b) => a - b),
    }))
  }

  function handleGPX(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseGPX(ev.target?.result as string)
      if (parsed.length > 0) setRoute(parsed)
    }
    reader.readAsText(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: toSlug(form.name, form.date), route: route.length > 1 ? route : undefined }),
      })
      const json = await res.json()
      setState(json.ok ? 'success' : 'error')
    } catch { setState('error') }
  }

  if (state === 'success') {
    return (
      <main className="min-h-screen bg-white px-6 py-12 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
        <p className="text-5xl mb-6">🏃</p>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Race submitted!</h1>
        <p className="text-gray-500 mb-8">Your race is pending review. We'll publish it once approved.</p>
        <Link href="/" className="text-sunrise hover:underline">Back to races →</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 max-w-xl mx-auto">
      <Link href="/" className="data-label text-gray-400 hover:text-gray-900 mb-10 inline-block transition-colors">
        ← All races
      </Link>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Submit a Race</h1>
      <p className="text-gray-500 mb-8">Submissions are reviewed before publishing.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="data-label block mb-1.5">Race Name *</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Iloilo City Marathon 2026" className={INPUT} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="data-label block mb-1.5">Date *</label>
            <input required type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={INPUT} />
          </div>
          <div>
            <label className="data-label block mb-1.5">Gun Start *</label>
            <input required type="time" value={form.gunStart} onChange={(e) => setForm((f) => ({ ...f, gunStart: e.target.value }))} className={`${INPUT} font-mono`} />
          </div>
        </div>
        <div>
          <label className="data-label block mb-1.5">Distances *</label>
          <div className="flex gap-2 flex-wrap">
            {DISTANCES.map((d) => (
              <button key={d} type="button" onClick={() => toggleDistance(d)}
                className={['data-label px-3 py-1.5 rounded-full border transition-all', form.distances.includes(d) ? PILL_ACTIVE[d] : PILL_INACTIVE[d]].join(' ')}>
                {DISTANCE_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="data-label block mb-1.5">Location (Starting Point) *</label>
          <input required value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="Plaza Libertad, Iloilo City" className={INPUT} />
        </div>

        {/* Route */}
        <div>
          <label className="data-label block mb-2">Race Route (optional)</label>
          <p className="text-xs text-gray-400 mb-3">Have a route? Attach it so runners can preview it on the map.</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button type="button" onClick={() => setRouteMode(routeMode === 'gpx' ? 'none' : 'gpx')}
              className={['data-label px-3 py-1.5 rounded-full border transition-all',
                routeMode === 'gpx' ? 'bg-royal border-royal text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'].join(' ')}>
              Upload GPX
            </button>
            <button type="button" onClick={() => setRouteMode(routeMode === 'trace' ? 'none' : 'trace')}
              className={['data-label px-3 py-1.5 rounded-full border transition-all',
                routeMode === 'trace' ? 'bg-royal border-royal text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'].join(' ')}>
              Trace on Map
            </button>
            {route.length > 0 && (
              <button type="button" onClick={() => setRoute([])}
                className="data-label px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-all">
                Clear Route
              </button>
            )}
          </div>

          {routeMode === 'gpx' && (
            <div>
              <input type="file" accept=".gpx" onChange={handleGPX}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-200 file:text-xs file:text-gray-500 file:bg-white hover:file:border-gray-400 transition-colors" />
              {route.length > 0
                ? <p className="data-label text-festival mt-1.5">✓ {route.length} route points loaded</p>
                : <p className="text-xs text-gray-400 mt-1">Export from Strava or Garmin as a .gpx file</p>
              }
            </div>
          )}

          {routeMode === 'trace' && (
            <RouteTracerLoader center={ILOILO} route={route} onChange={setRoute} />
          )}
        </div>

        <div>
          <label className="data-label block mb-1.5">Registration URL</label>
          <input type="url" value={form.registrationUrl} onChange={(e) => setForm((f) => ({ ...f, registrationUrl: e.target.value }))}
            placeholder="https://..." className={INPUT} />
        </div>
        <div>
          <label className="data-label block mb-1.5">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="A short description of the race..." className={`${INPUT} resize-none`} />
        </div>
        {state === 'error' && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
        <button type="submit" disabled={state === 'loading' || form.distances.length === 0}
          className="w-full bg-sunrise text-white font-display font-semibold py-3 rounded-xl hover:bg-sunrise/90 disabled:opacity-50 transition-colors">
          {state === 'loading' ? 'Submitting…' : 'Submit Race'}
        </button>
      </form>
    </main>
  )
}
