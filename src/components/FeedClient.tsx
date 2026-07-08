'use client'

import { useState } from 'react'
import PostCard from './PostCard'
import PostCompose from './PostCompose'
import { Post } from '@/lib/posts'

export default function FeedClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)

  function handleNewPost(post: Post) {
    setPosts(prev => [post, ...prev])
  }

  return (
    <div className="space-y-4">
      <PostCompose onPost={handleNewPost} placeholder="Share a run, tip, or race update…" />
      {posts.length === 0 ? (
        <p className="text-center text-predawn-500 text-sm py-12">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
