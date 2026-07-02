// Fetches Google Fonts for embedding in generated Open Graph images.
// Satori (used by next/og) ships no default fonts of its own once you pass a
// custom `fonts` list — every family referenced in the tree must be supplied,
// or text silently renders in whichever font happens to be first. Mirrors the
// site's own type stack: Archivo (display), Plus Jakarta Sans (body),
// JetBrains Mono (race data).
const cache = new Map<string, Promise<ArrayBuffer>>()

function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const key = `${family}-${weight}`
  if (!cache.has(key)) {
    const promise = fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
    )
      .then((res) => res.text())
      .then((css) => {
        const match = css.match(/src: url\(([^)]+)\) format\('truetype'\)/)
        if (!match) throw new Error(`Could not resolve font URL for ${family}`)
        return fetch(match[1]).then((res) => res.arrayBuffer())
      })
      .catch((err) => {
        cache.delete(key)
        throw err
      })
    cache.set(key, promise)
  }
  return cache.get(key)!
}

export interface OgFont {
  name: string
  data: ArrayBuffer
  weight: 400 | 700
  style: 'normal'
}

// All-or-nothing: if any font fails to load, callers should render with no
// custom fonts at all rather than mixing embedded + default, since satori
// renders every text node in the same font when the family list is partial.
export async function loadOgFonts(): Promise<OgFont[] | null> {
  try {
    const [display, body, mono] = await Promise.all([
      fetchGoogleFont('Archivo', 700),
      fetchGoogleFont('Plus Jakarta Sans', 400),
      fetchGoogleFont('JetBrains Mono', 700),
    ])
    return [
      { name: 'Archivo', data: display, weight: 700, style: 'normal' },
      { name: 'Plus Jakarta Sans', data: body, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 700, style: 'normal' },
    ]
  } catch {
    return null
  }
}
