'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RaceEvent, RaceStatus } from '@/lib/types'
import { formatDate } from '@/lib/format'

export default function AdminEventList({ events }: { events: RaceEvent[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function setStatus(id: string, status: RaceStatus) {
    setLoading(id)
    await fetch('/api/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLoading(null)
    router.refresh()
  }

  const pending = events.filter((e) => e.status === 'pending')
  const rest = events.filter((e) => e.status !== 'pending')

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Pending Review{' '}
          <span className="text-predawn-400 font-mono text-sm">
            ({pending.length})
          </span>
        </h2>
        {pending.length === 0 ? (
          <p className="text-predawn-400">No pending submissions.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((event) => (
              <li
                key={event.id}
                className="bg-predawn-800 rounded-xl p-5"
              >
                <p className="data-label mb-1">{formatDate(event.date)}</p>
                <h3 className="font-display font-semibold text-white mb-1">
                  {event.name}
                </h3>
                <p className="text-predawn-300 text-sm mb-4">
                  {event.location}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus(event.id, 'published')}
                    disabled={loading === event.id}
                    className="bg-sunrise text-predawn-900 font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-sunrise/90 disabled:opacity-50 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStatus(event.id, 'rejected')}
                    disabled={loading === event.id}
                    className="border border-predawn-600 text-predawn-400 text-sm px-4 py-1.5 rounded-lg hover:border-predawn-400 disabled:opacity-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          All Events{' '}
          <span className="text-predawn-400 font-mono text-sm">
            ({rest.length})
          </span>
        </h2>
        {rest.length === 0 ? (
          <p className="text-predawn-400">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {rest.map((event) => (
              <li
                key={event.id}
                className="bg-predawn-800/50 rounded-xl px-5 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="data-label mb-0.5">{formatDate(event.date)}</p>
                  <p className="text-white font-display text-sm">{event.name}</p>
                </div>
                <span
                  className={[
                    'data-label px-2 py-0.5 rounded border',
                    event.status === 'published'
                      ? 'border-sunrise/50 text-sunrise'
                      : 'border-predawn-600 text-predawn-500',
                  ].join(' ')}
                >
                  {event.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
