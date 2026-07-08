'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',       label: 'Races',   icon: IconRaces },
  { href: '/feed',   label: 'Feed',    icon: IconFeed },
  { href: '/submit', label: 'Submit',  icon: IconSubmit },
]

function IconRaces({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.5 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

function IconFeed({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.5 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function IconSubmit({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Admin pages get no shell
  if (pathname.startsWith('/admin')) return <>{children}</>

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className="min-h-screen flex flex-col bg-predawn-900">
      {/* ── Top header ── */}
      <header className="sticky top-0 z-30 bg-predawn-900 border-b border-predawn-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg leading-none">
            <span className="text-white">run</span>
            <span className="text-sunrise">.</span>
            <span className="bg-gradient-to-r from-festival via-royal to-mango bg-clip-text text-transparent">ilo</span>
          </Link>
          <Link
            href="/submit"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sunrise text-white hover:bg-orange-500 transition-colors"
          >
            + Submit Race
          </Link>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-predawn-900 border-t border-predawn-800 safe-bottom">
        <div className="max-w-2xl mx-auto flex">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors',
                  active ? 'text-sunrise' : 'text-predawn-400 hover:text-predawn-200',
                ].join(' ')}
              >
                <Icon active={active} />
                <span className="text-[10px] font-mono tracking-wider uppercase">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
