'use client'

import { useState } from 'react'
import { Comment } from '@/lib/posts'

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function CommentSection({ postId, initialComments }: { postId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, content: text }),
      })
      const json = await res.json()
      if (json.ok) {
        setComments(prev => [...prev, json.comment])
        setText('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border-t border-predawn-700 pt-3 mt-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-xs text-predawn-500 hover:text-predawn-300 transition-colors font-mono tracking-wider uppercase"
      >
        {open ? '↑ Hide' : `↓ ${comments.length > 0 ? `${comments.length} ` : ''}Reply`}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-1 shrink-0 rounded-full bg-predawn-700" />
              <div>
                <span className="text-xs font-semibold text-predawn-300">{c.authorName}</span>
                <span className="text-xs text-predawn-600 font-mono ml-2">{formatRelative(c.createdAt)}</span>
                <p className="text-xs text-predawn-400 mt-0.5 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}

          <form onSubmit={submit} className="flex gap-2 pt-1">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              maxLength={40}
              required
              className="w-24 shrink-0 bg-predawn-700 border border-predawn-600 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-predawn-600 focus:outline-none focus:border-sunrise/50"
            />
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a reply…"
              maxLength={300}
              required
              className="flex-1 bg-predawn-700 border border-predawn-600 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-predawn-600 focus:outline-none focus:border-sunrise/50"
            />
            <button
              type="submit"
              disabled={submitting || !name.trim() || !text.trim()}
              className="px-3 py-1.5 text-xs font-semibold bg-sunrise text-white rounded-lg hover:bg-orange-500 disabled:opacity-40 transition-colors shrink-0"
            >
              {submitting ? '…' : 'Reply'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
