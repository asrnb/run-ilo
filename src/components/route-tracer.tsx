'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickHandler({ onAdd }: { onAdd: (pt: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAdd([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

interface RouteTracerProps {
  center: [number, number]
  route: [number, number][]
  onChange: (route: [number, number][]) => void
}

export default function RouteTracer({ center, route, onChange }: RouteTracerProps) {
  function addPoint(pt: [number, number]) {
    onChange([...route, pt])
  }

  function undoLast() {
    onChange(route.slice(0, -1))
  }

  function clearAll() {
    onChange([])
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <p className="data-label text-gray-500 flex-1">Click on the map to trace the race route</p>
        <button type="button" onClick={undoLast} disabled={route.length === 0}
          className="data-label px-3 py-1 border border-gray-200 text-gray-500 rounded-lg hover:border-gray-400 disabled:opacity-30 transition-colors">
          Undo
        </button>
        <button type="button" onClick={clearAll} disabled={route.length === 0}
          className="data-label px-3 py-1 border border-gray-200 text-gray-500 rounded-lg hover:border-red-300 hover:text-red-400 disabled:opacity-30 transition-colors">
          Clear
        </button>
      </div>
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <MapContainer center={center} zoom={14} style={{ height: '320px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onAdd={addPoint} />
          {route.length > 1 && (
            <Polyline positions={route} pathOptions={{ color: '#f97057', weight: 4, opacity: 0.85 }} />
          )}
          {route.map((pt, i) => (
            <Marker key={i} position={pt} />
          ))}
        </MapContainer>
      </div>
      <p className="data-label text-gray-300">{route.length} point{route.length !== 1 ? 's' : ''} placed</p>
    </div>
  )
}
