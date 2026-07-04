import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'run.ilo — Iloilo Race Directory'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#0e0b08',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(249,112,87,0.15) 0%, transparent 70%)',
        display: 'flex',
      }} />

      {/* Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(244,63,94,0.1)',
        border: '1px solid rgba(244,63,94,0.25)',
        borderRadius: 999,
        padding: '6px 14px',
        marginBottom: 32,
        width: 'fit-content',
      }}>
        <span style={{ color: '#f43f5e', fontSize: 14 }}>♥</span>
        <span style={{ color: '#f43f5e', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          The City of Love, Iloilo
        </span>
      </div>

      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 24 }}>
        <span style={{ color: 'white', fontSize: 110, fontWeight: 800, lineHeight: 1 }}>run</span>
        <span style={{ color: '#f97057', fontSize: 110, fontWeight: 800, lineHeight: 1 }}>.</span>
        <span style={{ color: '#16c25e', fontSize: 110, fontWeight: 800, lineHeight: 1 }}>ilo</span>
      </div>

      {/* Divider */}
      <div style={{
        width: 160, height: 4, borderRadius: 2,
        background: 'linear-gradient(to right, #16c25e, #f97057, #ffb347)',
        marginBottom: 32,
        display: 'flex',
      }} />

      <div style={{ color: '#a87f60', fontSize: 26, fontWeight: 400 }}>
        Community directory of fun runs &amp; marathons in Iloilo City
      </div>
    </div>,
    { ...size },
  )
}
