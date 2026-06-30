import Link from 'next/link'
import { getAllEvents } from '@/lib/events'
import AdminEventList from '@/components/AdminEventList'

// Always fetch fresh — do not cache admin data
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const events = await getAllEvents()

  return (
    <main className="min-h-screen bg-predawn-900 px-6 py-12 max-w-3xl mx-auto">
      {/* TODO: protect this page with Supabase Auth before public deploy */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <Link href="/" className="data-label text-predawn-500 hover:text-white transition-colors">
            ← run.ilo
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-3">
            Admin
          </h1>
        </div>
        <Link
          href="/admin/new"
          className="bg-sunrise text-predawn-900 font-display font-semibold text-sm px-4 py-2 rounded-xl hover:bg-sunrise/90 transition-colors"
        >
          + New Race
        </Link>
      </div>

      <AdminEventList events={events} />
    </main>
  )
}
