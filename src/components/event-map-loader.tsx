import dynamic from 'next/dynamic'

// Leaflet touches `window` — must not SSR. Import this file instead of event-map.tsx.
const EventMapLoader = dynamic(() => import('./event-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-xl bg-predawn-800 animate-pulse" />
  ),
})

export default EventMapLoader
