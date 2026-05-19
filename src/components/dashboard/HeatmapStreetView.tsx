'use client'

import type { HeatmapPoint } from '@/types/heatmap'
import {
  buildStreetViewEmbedUrl,
  buildStreetViewExternalUrl,
  getGoogleMapsApiKey,
} from '@/lib/googleMaps'

const GOOGLE_KEY = getGoogleMapsApiKey()

function StreetViewSetupHint() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5 text-center">
      <div className="max-w-sm rounded-xl border border-slate-600 bg-slate-900/90 p-4 text-left">
        <p className="text-sm font-semibold text-white">Enable embedded Street View</p>
        <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs text-slate-300">
          <li>
            Create an API key in{' '}
            <a
              href="https://console.cloud.google.com/google/maps-apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-400 underline hover:text-cyan-300"
            >
              Google Cloud Console
            </a>
            .
          </li>
          <li>
            Enable the <span className="font-medium text-slate-200">Maps Embed API</span> for that
            project.
          </li>
          <li>
            Add to your project <code className="rounded bg-slate-800 px-1 py-0.5 text-[10px]">.env</code>:
            <pre className="mt-1.5 overflow-x-auto rounded-lg bg-slate-950 px-2 py-2 text-[10px] text-emerald-300">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
            </pre>
          </li>
          <li>Restart the dev server (<code className="text-[10px]">npm run dev</code>).</li>
        </ol>
      </div>
    </div>
  )
}

export default function HeatmapStreetView({ region }: { region: HeatmapPoint | null }) {
  if (!region) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">Street-level view</p>
        <p className="mt-2 max-w-xs text-xs text-slate-500">
          Select a hotspot or search a location on the map to load Google Street View beside the
          heatmap.
        </p>
        {!GOOGLE_KEY && (
          <p className="mt-4 max-w-xs rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Set <code className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in{' '}
            <code className="font-mono text-[10px]">.env</code> to embed Street View here.
          </p>
        )}
      </div>
    )
  }

  const { lat, lng } = region
  const streetViewSrc = GOOGLE_KEY ? buildStreetViewEmbedUrl(lat, lng, GOOGLE_KEY) : null
  const openInMapsHref = buildStreetViewExternalUrl(lat, lng)

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
          <>
            <StreetViewSetupHint />
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/90 p-3 text-center">
              <a
                href={openInMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow hover:bg-slate-100"
              >
                Open Street View in Google Maps
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
