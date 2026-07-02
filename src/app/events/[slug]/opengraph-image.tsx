import { ImageResponse } from 'next/og'
import { getEventBySlug } from '@/lib/events'
import { formatDate, formatGunStart, formatDistance } from '@/lib/format'
import { loadOgFonts } from '@/lib/og-font'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Race card — run.ilo'

const DISPLAY = 'Archivo'
const BODY = 'Plus Jakarta Sans'
const MONO = 'JetBrains Mono'

interface Props {
  params: { slug: string }
}

export default async function Image({ params }: Props) {
  const event = await getEventBySlug(params.slug)
  const fonts = (await loadOgFonts()) ?? undefined

  if (!event) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0e2e',
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            fontFamily: fonts ? DISPLAY : 'sans-serif',
          }}
        >
          run<span style={{ color: '#f97057' }}>.</span>ilo
        </div>
      ),
      { ...size, fonts },
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #0d0e2e 0%, #171870 100%)',
          fontFamily: fonts ? BODY : 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '8px solid #f97057',
            paddingLeft: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: fonts ? MONO : 'monospace',
              fontSize: 26,
              letterSpacing: 4,
              color: '#f97057',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            {formatDate(event.date)}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: fonts ? DISPLAY : 'sans-serif',
              fontSize: 66,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            {event.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#93a4ff',
              marginTop: 20,
            }}
          >
            {event.location}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: fonts ? MONO : 'monospace',
                fontSize: 20,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#6677ef',
                marginBottom: 8,
              }}
            >
              Gun Start
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: fonts ? MONO : 'monospace',
                fontSize: 42,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {formatGunStart(event.gunStart)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginLeft: 32 }}>
            {event.distances.map((d) => (
              <div
                key={d}
                style={{
                  display: 'flex',
                  fontFamily: fonts ? MONO : 'monospace',
                  fontSize: 24,
                  fontWeight: 700,
                  padding: '10px 20px',
                  borderRadius: 12,
                  border: `2px solid ${d === 42 ? '#ffb347' : '#3030b8'}`,
                  color: d === 42 ? '#ffb347' : '#93a4ff',
                }}
              >
                {formatDistance(d)}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: fonts ? DISPLAY : 'sans-serif',
              fontSize: 30,
              fontWeight: 700,
              color: 'white',
              marginLeft: 'auto',
            }}
          >
            run<span style={{ color: '#f97057' }}>.</span>ilo
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
