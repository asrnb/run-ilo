// Resolves an absolute site URL for metadata (Open Graph images, canonical links).
// Falls back through Vercel's own env vars so previews and prod both work
// without extra config; only needs NEXT_PUBLIC_SITE_URL for custom domains.
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
