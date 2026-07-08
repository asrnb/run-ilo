import { getFeedPosts } from '@/lib/posts'
import FeedClient from '@/components/FeedClient'

export const metadata = {
  title: 'Community Feed — run.ilo',
  description: 'Race updates, run recaps, and community posts from Iloilo runners.',
}

export default async function FeedPage() {
  const posts = await getFeedPosts(50).catch(() => [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <FeedClient initialPosts={posts} />
    </div>
  )
}
