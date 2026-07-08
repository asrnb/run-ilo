import { getFeedPosts } from '@/lib/posts'
import FeedClient from '@/components/FeedClient'
import Link from 'next/link'

export const metadata = {
  title: 'Community Feed — run.ilo',
  description: 'Race updates, run recaps, and community posts from Iloilo runners.',
}

export default async function FeedPage() {
  const posts = await getFeedPosts(50).catch(() => [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Races
          </Link>
          <span className="text-gray-900 font-semibold">Community Feed</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <FeedClient initialPosts={posts} />
      </main>
    </div>
  )
}
