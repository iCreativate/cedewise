'use client'

import type { HeatmapPoint } from '@/types/heatmap'

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function HeatmapStreetView({ region }: { region: HeatmapPoint | null }) {
  if (!region) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">Street-level view</p>
        <p className="mt-2 max-w-xs text-xs text-slate-500">
          Select a hotspot on the map to load Google Street View at that location and review in-depth risk context beside the map.
        </p>
      </div>
    )
  }

  const { lat, lng } = region
  const streetViewSrc = GOOGLE_KEY
    ? `https://www.google.com/maps/embed/v1/streetview?key=${encodeURIComponent(GOOGLE_KEY)}&location=${lat},${lng}&heading=25&pitch=5&fov=75`
    : null

  const openInMapsHref = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
      <div className="border-b border-white/10 bg-slate-950/80 px-3 py-2">
        <p className="text-xs font-semibold text-white">Street View</p>
        <p className="truncate text-[11px] text-slate-400">{region.label}</p>
      </div>
      <div className="relative flex-1 min-h-[220px] bg-black">
        {streetViewSrc ? (
          <iframe
            title={`Street View — ${region.label}`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            src={streetViewSrc}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <p className="text-xs text-slate-300">
              Add <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable embedded Street View.
            </p>
            <a
              href={openInMapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow hover:bg-slate-100"
            >
              Open Street View in Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
