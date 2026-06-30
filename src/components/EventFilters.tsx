'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const DISTANCES = [5, 10, 21, 42]

const LABELS: Record<number, string> = {
  5: '5K',
  10: '10K',
  21: '21K Half',
  42: '42K Full',
}

export default function EventFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('distance')

  function toggle(d: number) {
    const next = new URLSearchParams(params.toString())
    if (active === String(d)) {
      next.delete('distance')
    } else {
      next.set('distance', String(d))
    }
    router.push(`/?${next.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {DISTANCES.map((d) => (
        <button
          key={d}
          onClick={() => toggle(d)}
          className={[
            'data-label px-3 py-1.5 rounded-full border transition-colors',
            active === String(d)
              ? 'border-sunrise bg-sunrise text-predawn-900'
              : d === 42
                ? 'border-mango/60 text-mango hover:border-mango'
                : 'border-predawn-700 text-predawn-400 hover:border-predawn-500',
          ].join(' ')}
        >
          {LABELS[d]}
        </button>
      ))}
    </div>
  )
}
