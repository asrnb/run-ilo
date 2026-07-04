export type RaceStatus = 'published' | 'pending' | 'rejected'
export type RaceSource = 'admin' | 'submission'

export type RaceRoute = [number, number][] // [lat, lng] pairs

export interface RaceEvent {
  id: string
  slug: string
  name: string
  date: string       // ISO date: YYYY-MM-DD
  gunStart: string   // HH:MM 24h
  distances: number[] // km integers: 5, 10, 21, 42
  location: string
  lat: number
  lng: number
  route?: RaceRoute
  registrationUrl?: string
  description?: string
  status: RaceStatus
  source: RaceSource
  createdAt: string  // ISO timestamp
}

// DB row shape (snake_case) — only used in events.ts via fromRow()
export interface RaceEventRow {
  id: string
  slug: string
  name: string
  date: string
  gun_start: string
  distances: number[]
  location: string
  lat: number
  lng: number
  route: [number, number][] | null
  registration_url: string | null
  description: string | null
  status: RaceStatus
  source: RaceSource
  created_at: string
}
