'use client'

import { useState } from 'react'
import PostCard from './PostCard'
import PostCompose from './PostCompose'
import { Post } from '@/lib/posts'

export default function RaceFeed({
  raceEventId,
  initialPosts,
}: {
  raceEventId: string
  initialPosts: Post[]
}) {
  const [posts, setPosts] = useState(initialPosts)

  function handleNewPost(post: Post) {
    setPosts(prev => [post, ...prev])
  }

  return (
    <div className="space-y-4">
      <h2 className="data-label text-predawn-500">Race Updates</h2>
      <PostCompose
        raceEventId={raceEventId}
        showKind
        placeholder="Share a tip, update, or recap for this race…"
        onPost={handleNewPost}
      />
      {posts.length === 0 ? (
        <p className="text-sm text-predawn-500 text-center py-8">
          No updates yet. Share something!
        </p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
