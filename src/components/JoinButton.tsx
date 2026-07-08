'use client'

import { useState, useEffect } from 'react'

interface Props {
  raceId: string
  initialCount: number
}

const STORAGE_KEY = (id: string) => `run-ilo:joined:${id}`

export default function JoinButton({ raceId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount)
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setJoined(localStorage.getItem(STORAGE_KEY(raceId)) === '1')
  }, [raceId])

  async function handleJoin() {
    if (joined || loading) return
    setLoading(true)
    // optimistic
    setCount(c => c + 1)
    setJoined(true)
    localStorage.setItem(STORAGE_KEY(raceId), '1')
    try {
      const res = await fetch(`/api/events/${raceId}/join`, { method: 'POST' })
      const json = await res.json()
      if (json.ok) setCount(json.count)
    } catch {
      // keep optimistic state
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoin}
      disabled={joined || loading}
      className={[
        'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
        joined
          ? 'bg-festival/10 text-festival border border-festival/30 cursor-default'
          : 'bg-white border border-gray-200 text-gray-700 hover:border-festival hover:text-festival',
      ].join(' ')}
    >
      <span>{joined ? '✓' : '👟'}</span>
      <span>{joined ? "You're in!" : "I'm Joining"}</span>
      {count > 0 && (
        <span className={`font-mono text-xs ${joined ? 'text-festival' : 'text-gray-400'}`}>
          {count}
        </span>
      )}
    </button>
  )
}
