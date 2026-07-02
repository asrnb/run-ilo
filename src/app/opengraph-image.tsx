import { ImageResponse } from 'next/og'
import { loadOgFonts } from '@/lib/og-font'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'run.ilo — Iloilo Race Directory'

const DISPLAY = 'Archivo'
const BODY = 'Plus Jakarta Sans'
const MONO = 'JetBrains Mono'

export default async function Image() {
  const fonts = (await loadOgFonts()) ?? undefined

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0d0e2e 0%, #171870 100%)',
          fontFamily: fonts ? BODY : 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            borderLeft: '8px solid #f97057',
            paddingLeft: '32px',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: fonts ? MONO : 'monospace',
              fontSize: 28,
              letterSpacing: 6,
              color: '#f97057',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            Iloilo City, Philippines
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: fonts ? DISPLAY : 'sans-serif',
              fontSize: 130,
              fontWeight: 700,
              color: 'white',
            }}
          >
            run<span style={{ color: '#f97057' }}>.</span>ilo
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              color: '#93a4ff',
              marginTop: 24,
              maxWidth: 820,
            }}
          >
            Community directory of fun runs and marathons
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
