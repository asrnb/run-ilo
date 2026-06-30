'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toSlug } from '@/lib/format'

const DISTANCES = [5, 10, 21, 42]
const DISTANCE_LABELS: Record<number, string> = {
  5: '5K',
  10: '10K',
  21: '21K Half',
  42: '42K Full',
}

export default function AdminNewPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    date: '',
    gunStart: '',
    distances: [] as number[],
    location: '',
    lat: '',
    lng: '',
    registrationUrl: '',
    description: '',
  })
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  function toggleDistance(d: number) {
    setForm((f) => ({
      ...f,
      distances: f.distances.includes(d)
        ? f.distances.filter((x) => x !== d)
        : [...f.distances, d].sort((a, b) => a - b),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: toSlug(form.name, form.date),
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        }),
      })
      const json = await res.json()
      if (json.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <main className="min-h-screen bg-predawn-900 px-6 py-12 max-w-xl mx-auto">
      <Link
        href="/admin"
        className="data-label text-predawn-400 hover:text-white mb-10 inline-block transition-colors"
      >
        ← Admin
      </Link>

      <h1 className="font-display text-3xl font-bold text-white mb-2">
        New Race
      </h1>
      <p className="text-predawn-300 mb-8">
        Published immediately — no moderation step.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="data-label block mb-1.5">Race Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Iloilo City Marathon 2026"
            className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white placeholder:text-predawn-600 focus:border-sunrise focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="data-label block mb-1.5">Date *</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((f) => ({ ...f, date: e.target.value }))
              }
              className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white focus:border-sunrise focus:outline-none"
            />
          </div>
          <div>
            <label className="data-label block mb-1.5">Gun Start *</label>
            <input
              required
              type="time"
              value={form.gunStart}
              onChange={(e) =>
                setForm((f) => ({ ...f, gunStart: e.target.value }))
              }
              className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white font-mono focus:border-sunrise focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="data-label block mb-1.5">Distances *</label>
          <div className="flex gap-2 flex-wrap">
            {DISTANCES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDistance(d)}
                className={[
                  'data-label px-3 py-1.5 rounded-full border transition-colors',
                  form.distances.includes(d)
                    ? 'border-sunrise bg-sunrise text-predawn-900'
                    : 'border-predawn-700 text-predawn-400 hover:border-predawn-500',
                ].join(' ')}
              >
                {DISTANCE_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="data-label block mb-1.5">Location *</label>
          <input
            required
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            placeholder="Plaza Libertad, Iloilo City"
            className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white placeholder:text-predawn-600 focus:border-sunrise focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="data-label block mb-1.5">Latitude *</label>
            <input
              required
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              placeholder="10.6966"
              className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white font-mono placeholder:text-predawn-600 focus:border-sunrise focus:outline-none"
            />
          </div>
          <div>
            <label className="data-label block mb-1.5">Longitude *</label>
            <input
              required
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              placeholder="122.5695"
              className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white font-mono placeholder:text-predawn-600 focus:border-sunrise focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="data-label block mb-1.5">Registration URL</label>
          <input
            type="url"
            value={form.registrationUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, registrationUrl: e.target.value }))
            }
            placeholder="https://..."
            className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white placeholder:text-predawn-600 focus:border-sunrise focus:outline-none"
          />
        </div>

        <div>
          <label className="data-label block mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="A short description of the race..."
            className="w-full bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-white placeholder:text-predawn-600 focus:border-sunrise focus:outline-none resize-none"
          />
        </div>

        {state === 'error' && (
          <p className="text-red-400 text-sm">
            Something went wrong. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={state === 'loading' || form.distances.length === 0}
          className="w-full bg-sunrise text-predawn-900 font-display font-semibold py-3 rounded-xl hover:bg-sunrise/90 disabled:opacity-50 transition-colors"
        >
          {state === 'loading' ? 'Publishing…' : 'Publish Race'}
        </button>
      </form>
    </main>
  )
}
