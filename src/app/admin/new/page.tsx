'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toSlug } from '@/lib/format'
import { parseGPX } from '@/lib/gpx'
import RouteTracerLoader from '@/components/route-tracer-loader'
import BannerUpload from '@/components/BannerUpload'

const DISTANCES = [5, 10, 21, 42]
const DISTANCE_LABELS: Record<number, string> = {
  5: '5K', 10: '10K', 21: '21K Half', 42: '42K Full',
}

const INPUT = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors'

const ILOILO: [number, number] = [10.6966, 122.5695]

export default function AdminNewPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', date: '', gunStart: '', distances: [] as number[],
    location: '', lat: '10.6966', lng: '122.5695',
    registrationUrl: '', description: '',
  })
  const [route, setRoute] = useState<[number, number][]>([])
  const [routeMode, setRouteMode] = useState<'none' | 'gpx' | 'trace'>('none')
  const [bannerUrl, setBannerUrl] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

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
      const text = ev.target?.result as string
      const parsed = parseGPX(text)
      if (parsed.length > 0) {
        setRoute(parsed)
        setForm((f) => ({ ...f, lat: String(parsed[0][0]), lng: String(parsed[0][1]) }))
      }
    }
    reader.readAsText(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const slug = toSlug(form.name, form.date)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug,
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
          route: route.length > 1 ? route : undefined,
          bannerUrl: bannerUrl || undefined,
        }),
      })
      const json = await res.json()
      if (json.ok) { router.push('/admin'); router.refresh() }
      else setState('error')
    } catch { setState('error') }
  }

  const mapCenter: [number, number] = form.lat && form.lng
    ? [parseFloat(form.lat), parseFloat(form.lng)]
    : ILOILO

  const slug = form.name && form.date ? toSlug(form.name, form.date) : 'race-banner'

  return (
    <main className="min-h-screen bg-white px-6 py-12 max-w-xl mx-auto">
      <Link href="/admin" className="data-label text-gray-400 hover:text-gray-900 mb-10 inline-block transition-colors">
        ← Admin
      </Link>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">New Race</h1>
      <p className="text-gray-500 mb-8">Published immediately — no moderation step.</p>

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
                className={['data-label px-3 py-1.5 rounded-full border transition-all',
                  form.distances.includes(d)
                    ? 'bg-sunrise border-sunrise text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400'].join(' ')}>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="data-label block mb-1.5">Latitude *</label>
            <input required type="number" step="any" value={form.lat} onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              placeholder="10.6966" className={`${INPUT} font-mono`} />
          </div>
          <div>
            <label className="data-label block mb-1.5">Longitude *</label>
            <input required type="number" step="any" value={form.lng} onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              placeholder="122.5695" className={`${INPUT} font-mono`} />
          </div>
        </div>

        {/* Banner */}
        <div>
          <label className="data-label block mb-2">Banner Image (optional)</label>
          <BannerUpload slug={slug} currentUrl={bannerUrl} onUploaded={setBannerUrl} />
        </div>

        {/* Route */}
        <div>
          <label className="data-label block mb-2">Race Route (optional)</label>
          <div className="flex gap-2 mb-3">
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
              {route.length > 0 && (
                <p className="data-label text-festival mt-1.5">✓ {route.length} points loaded from GPX</p>
              )}
            </div>
          )}

          {routeMode === 'trace' && (
            <RouteTracerLoader center={mapCenter} route={route} onChange={setRoute} />
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
          {state === 'loading' ? 'Publishing…' : 'Publish Race'}
        </button>
      </form>
    </main>
  )
}
