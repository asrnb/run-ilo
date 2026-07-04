'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const DISTANCES = [5, 10, 21, 42]

const LABELS: Record<number, string> = {
  5:  '5K',
  10: '10K',
  21: '21K Half',
  42: '42K Full',
}

const PILL_ACTIVE: Record<number, string> = {
  5:  'bg-festival border-festival text-white',
  10: 'bg-royal border-royal text-white',
  21: 'bg-sunrise border-sunrise text-white',
  42: 'bg-mango border-mango text-gray-900',
}

const PILL_INACTIVE: Record<number, string> = {
  5:  'border-festival/40 text-festival/80 hover:border-festival hover:text-festival',
  10: 'border-royal/40 text-royal/80 hover:border-royal hover:text-royal',
  21: 'border-sunrise/40 text-sunrise/80 hover:border-sunrise hover:text-sunrise',
  42: 'border-mango/40 text-mango/80 hover:border-mango hover:text-mango',
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
            'data-label px-3 py-1.5 rounded-full border transition-all',
            active === String(d) ? PILL_ACTIVE[d] : PILL_INACTIVE[d],
          ].join(' ')}
        >
          {LABELS[d]}
        </button>
      ))}
    </div>
  )
}
