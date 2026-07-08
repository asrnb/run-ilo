'use client'

import { useState } from 'react'
import { RaceResult } from '@/lib/results'

export default function RaceResults({ raceEventId, initialResults }: { raceEventId: string; initialResults: RaceResult[] }) {
  const [results, setResults] = useState(initialResults)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) { setResults(initialResults); setSearched(false); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/results?raceEventId=${raceEventId}&q=${encodeURIComponent(query)}`)
      const json = await res.json()
      if (json.ok) { setResults(json.results); setSearched(true) }
    } finally {
      setSearching(false)
    }
  }

  function clear() { setQuery(''); setResults(initialResults); setSearched(false) }

  if (initialResults.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="data-label text-predawn-500 mb-4">Race Results</h2>

      <form onSubmit={search} className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by runner name…"
          className="flex-1 bg-predawn-800 border border-predawn-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-predawn-600 focus:outline-none focus:border-sunrise/50 focus:ring-2 focus:ring-sunrise/20 transition-colors"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2 text-sm font-semibold bg-sunrise text-white rounded-xl hover:bg-orange-500 disabled:opacity-40 transition-colors"
        >
          {searching ? '…' : 'Search'}
        </button>
        {searched && (
          <button type="button" onClick={clear} className="px-3 py-2 text-sm text-predawn-400 hover:text-predawn-200 transition-colors">
            Clear
          </button>
        )}
      </form>

      {results.length === 0 ? (
        <p className="text-predawn-500 text-sm text-center py-6">No results found for "{query}"</p>
      ) : (
        <div className="bg-predawn-800 border border-predawn-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-predawn-700">
                <th className="data-label text-left px-4 py-2.5 text-predawn-600">Rank</th>
                <th className="data-label text-left px-4 py-2.5 text-predawn-600">Runner</th>
                <th className="data-label text-left px-4 py-2.5 text-predawn-600 hidden sm:table-cell">Category</th>
                <th className="data-label text-right px-4 py-2.5 text-predawn-600">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-predawn-700">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-predawn-700/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-predawn-500 text-xs">
                    {r.rank ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white">{r.runnerName}</span>
                    {r.bib && <span className="text-xs text-predawn-600 font-mono ml-2">#{r.bib}</span>}
                  </td>
                  <td className="px-4 py-3 text-predawn-400 hidden sm:table-cell">{r.category ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-sunrise">{r.finishTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
