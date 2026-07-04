'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (!mounted) return <div className="w-16 h-5" />

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-1.5 group"
    >
      <span className={`text-xs transition-colors ${dark ? 'text-gray-600' : 'text-gray-400'}`}>☀</span>
      <div className={`relative w-10 h-5 rounded-full transition-colors ${dark ? 'bg-predawn-700' : 'bg-gray-200'}`}>
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${dark ? 'left-5' : 'left-0.5'}`}
        />
      </div>
      <span className={`text-xs transition-colors ${dark ? 'text-predawn-300' : 'text-gray-300'}`}>☾</span>
    </button>
  )
}
