export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatGunStart(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatDistance(km: number): string {
  if (km === 42) return '42K Full Marathon'
  if (km === 21) return '21K Half Marathon'
  return `${km}K`
}

export function toSlug(name: string, date: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const year = date.split('-')[0] || String(new Date().getFullYear())
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${year}-${suffix}`
}
