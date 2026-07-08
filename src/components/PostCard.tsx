'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/posts'

const KIND_LABEL: Record<string, string> = {
  general: 'Post',
  update: 'Race Update',
  result: 'Results',
  recap: 'Recap',
}

const KIND_COLOR: Record<string, string> = {
  general: 'text-predawn-500',
  update: 'text-royal',
  result: 'text-festival',
  recap: 'text-sunrise',
}

const EMOJIS = ['🔥', '💪', '👟']

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

export default function PostCard({ post }: { post: Post }) {
  const [reactions, setReactions] = useState(post.reactions)
  const [reacting, setReacting] = useState(false)

  async function react(emoji: string) {
    if (reacting) return
    setReacting(true)
    setReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji)
      if (existing) return prev.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
      return [...prev, { emoji, count: 1 }]
    })
    try {
      await fetch(`/api/posts/${post.id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      })
    } catch {
      // optimistic — ignore error
    } finally {
      setReacting(false)
    }
  }

  return (
    <div className="bg-predawn-800 border border-predawn-700 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-semibold text-white text-sm">{post.authorName}</span>
          {post.raceSlug && post.raceName && (
            <span className="text-predawn-500 text-sm">
              {' · '}
              <Link href={`/events/${post.raceSlug}`} className="hover:text-sunrise transition-colors">
                {post.raceName}
              </Link>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-mono uppercase tracking-wider ${KIND_COLOR[post.kind]}`}>
            {KIND_LABEL[post.kind]}
          </span>
          <span className="text-xs text-predawn-600 font-mono">{formatRelative(post.createdAt)}</span>
        </div>
      </div>

      <p className="text-predawn-200 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center gap-2 pt-1">
        {EMOJIS.map(emoji => {
          const r = reactions.find(x => x.emoji === emoji)
          return (
            <button
              key={emoji}
              onClick={() => react(emoji)}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-predawn-700 hover:bg-predawn-600 transition-colors"
            >
              <span>{emoji}</span>
              {r && <span className="text-xs text-predawn-300 font-mono">{r.count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
