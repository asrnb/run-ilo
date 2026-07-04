import { ImageResponse } from 'next/og'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'

export const runtime = 'edge'
export const alt = 'Race event'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const DISTANCE_COLORS: Record<number, string> = {
  5:  '#16c25e',
  10: '#4a90e2',
  21: '#f97057',
  42: '#ffb347',
}

async function getEvent(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const res = await fetch(
    `${url}/rest/v1/race_events?slug=eq.${slug}&status=eq.published&select=name,date,gun_start,distances,location`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  )
  const rows = await res.json()
  return rows?.[0] ?? null
}

export default async function Image({ params }: { params: { slug: string } }) {
  const row = await getEvent(params.slug)

  if (!row) {
    return new ImageResponse(
      <div style={{ background: '#0e0b08', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#a87f60', fontSize: 32 }}>run.ilo</span>
      </div>,
      { ...size },
    )
  }

  const name: string = row.name
  const distances: number[] = row.distances

  return new ImageResponse(
    <div
      style={{
        background: '#0e0b08',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(22,194,94,0.1) 0%, transparent 70%)',
        display: 'flex',
      }} />

      {/* run.ilo wordmark */}
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 'auto' }}>
        <span style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>run</span>
        <span style={{ color: '#f97057', fontSize: 28, fontWeight: 700 }}>.</span>
        <span style={{ color: '#16c25e', fontSize: 28, fontWeight: 700 }}>ilo</span>
      </div>

      {/* Race name */}
      <div style={{
        color: 'white',
        fontSize: name.length > 30 ? 56 : 72,
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: 20,
        maxWidth: 900,
      }}>
        {name}
      </div>

      {/* Date + location */}
      <div style={{ color: '#a87f60', fontSize: 22, marginBottom: 36, display: 'flex', gap: 12 }}>
        <span>{formatDate(row.date)}</span>
        <span style={{ color: '#473520' }}>·</span>
        <span>{row.location}</span>
      </div>

      {/* Distances + gun start */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {distances.map((d) => (
          <div
            key={d}
            style={{
              background: '#1c1610',
              border: `1px solid ${DISTANCE_COLORS[d]}40`,
              color: DISTANCE_COLORS[d],
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '0.05em',
              display: 'flex',
            }}
          >
            {formatDistance(d)}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: '#473520', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            GUN START
          </span>
          <span style={{ color: '#f97057', fontSize: 44, fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
            {formatGunStart(row.gun_start)}
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  )
}
