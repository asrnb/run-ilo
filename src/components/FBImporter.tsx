'use client'

import { useState } from 'react'

interface Extracted {
  name?: string
  date?: string
  gunStart?: string
  distances?: number[]
  location?: string
  description?: string
  registrationUrl?: string
}

interface Props {
  onImport: (data: Extracted) => void
}

export default function FBImporter({ onImport }: Props) {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [error, setError] = useState('')

  async function handleImport() {
    if (!url.trim()) return
    setState('loading')
    setError('')
    try {
      const res = await fetch('/api/admin/import-fb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error)
      onImport(json.data)
      setState('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setState('error')
    }
  }

  return (
    <div className="bg-royal/10 border border-royal/30 rounded-xl p-4 space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-royal text-sm">🤖</span>
        <p className="text-sm font-semibold text-gray-900">Import from Facebook Event</p>
      </div>
      <p className="text-xs text-gray-500">Paste a public Facebook Event URL and AI will fill in the form.</p>
      <div className="flex gap-2">
        <input
          value={url}
          onChange={e => { setUrl(e.target.value); if (state !== 'idle') setState('idle') }}
          placeholder="https://www.facebook.com/events/..."
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-royal/60"
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={state === 'loading' || !url.trim()}
          className="px-4 py-2 text-sm font-semibold bg-royal text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors shrink-0"
        >
          {state === 'loading' ? 'Reading…' : 'Import'}
        </button>
      </div>
      {state === 'done' && (
        <p className="text-xs text-festival font-mono">✓ Form filled — review and adjust before publishing.</p>
      )}
      {state === 'error' && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
