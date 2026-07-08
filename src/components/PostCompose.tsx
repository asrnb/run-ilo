'use client'

import { useState } from 'react'
import { Post, PostKind } from '@/lib/posts'

interface Props {
  raceEventId?: string
  showKind?: boolean
  placeholder?: string
  onPost?: (post: Post) => void
}

export default function PostCompose({ raceEventId, showKind = false, placeholder, onPost }: Props) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [kind, setKind] = useState<PostKind>('general')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, content, kind, raceEventId }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error)
      setContent('')
      onPost?.(json.post)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          required
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise/30 bg-white text-gray-900 placeholder:text-gray-400"
        />
        {showKind && (
          <select
            value={kind}
            onChange={e => setKind(e.target.value as PostKind)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise/30 bg-white text-gray-700"
          >
            <option value="general">Post</option>
            <option value="update">Race Update</option>
            <option value="result">Results</option>
            <option value="recap">Recap</option>
          </select>
        )}
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder ?? "What's happening in the running community?"}
        rows={3}
        maxLength={1000}
        required
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise/30 bg-white text-gray-900 placeholder:text-gray-400 resize-none"
      />
      {error && <p className="text-xs text-love">{error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !content.trim()}
          className="px-4 py-2 text-sm font-semibold bg-sunrise text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-40"
        >
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  )
}
