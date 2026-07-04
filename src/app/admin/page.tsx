import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAllEvents, isSupabaseConfigured } from '@/lib/events'
import { getSessionUser, checkIsAdmin } from '@/lib/auth'
import AdminEventList from '@/components/AdminEventList'
import LogoutButton from '@/components/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let userEmail: string | null = null

  if (isSupabaseConfigured()) {
    const user = await getSessionUser()
    if (!user) redirect('/admin/login')
    const admin = await checkIsAdmin(user.id)
    if (!admin) {
      return (
        <main className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{user.email} is not authorized as an admin.</p>
            <LogoutButton />
          </div>
        </main>
      )
    }
    userEmail = user.email ?? null
  }

  const events = await getAllEvents()

  return (
    <main className="min-h-screen bg-white px-6 py-12 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <Link href="/" className="data-label text-gray-400 hover:text-gray-900 transition-colors">← run.ilo</Link>
          <h1 className="font-display text-2xl font-bold text-gray-900 mt-3">Admin</h1>
          {userEmail && <p className="data-label mt-1">{userEmail}</p>}
        </div>
        <div className="flex gap-4 items-center">
          {isSupabaseConfigured() && <LogoutButton />}
          <Link href="/admin/new"
            className="bg-sunrise text-white font-display font-semibold text-sm px-4 py-2 rounded-xl hover:bg-sunrise/90 transition-colors">
            + New Race
          </Link>
        </div>
      </div>
      <AdminEventList events={events} />
    </main>
  )
}
