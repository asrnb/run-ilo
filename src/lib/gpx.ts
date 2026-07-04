export function parseGPX(text: string): [number, number][] {
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const points = doc.querySelectorAll('trkpt, rtept, wpt')
  return Array.from(points)
    .map((pt) => {
      const lat = parseFloat(pt.getAttribute('lat') ?? '')
      const lon = parseFloat(pt.getAttribute('lon') ?? '')
      return [lat, lon] as [number, number]
    })
    .filter(([lat, lon]) => !isNaN(lat) && !isNaN(lon))
}
