'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import type { HeatmapPoint } from '@/types/heatmap'

export type LeafletHeatmapControls = {
  riskLayer: 'Policy Exposure' | 'Claims Density' | 'Broker Activity' | 'Regional Migration' | 'Loss Ratio'
  timeRange: 'Today' | '7 Days' | '30 Days' | 'Quarter' | 'Year'
  intensity: number // 25..140 (% scale)
  radius: number // px
  showColumns: boolean
  showHeat: boolean
}

const DEFAULT_CENTER: L.LatLngExpression = [-26.2041, 28.0473]
const DEFAULT_ZOOM = 11

const RISK_COLOR: Record<
  HeatmapPoint['risk'],
  { fill: string; stroke: string }
> = {
  Low: { fill: '#34d399', stroke: '#ecfdf5' },
  Medium: { fill: '#facc15', stroke: '#fefce8' },
  High: { fill: '#fb923c', stroke: '#fff7ed' },
  Critical: { fill: '#fb7185', stroke: '#fff1f2' },
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
}

export default function LeafletRiskHeatmap({
  points,
  controls,
  selectedRegion,
  onSelectRegion,
}: {
  points: HeatmapPoint[]
  controls: LeafletHeatmapControls
  selectedRegion: HeatmapPoint | null
  onSelectRegion: (region: HeatmapPoint | null) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const heatLayerRef = useRef<L.Layer | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const resetControlRef = useRef<L.Control | null>(null)

  const [hovered, setHovered] = useState<HeatmapPoint | null>(null)
  const [mapReady, setMapReady] = useState(false)
  /** leaflet.heat loads async — map/tiles render without waiting on this */
  const [heatPluginReady, setHeatPluginReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const onSelectRef = useRef(onSelectRegion)
  onSelectRef.current = onSelectRegion

  const selectedRef = useRef(selectedRegion)
  selectedRef.current = selectedRegion

  const intensityScale = useMemo(() => clamp(controls.intensity / 100, 0.25, 1.6), [controls.intensity])

  const active = selectedRegion ?? hovered
  const exposure = active ? Math.round(3_000_000_000 * active.intensity * intensityScale * 0.5) : null
  const claims = active ? Math.max(1, Math.round(active.intensity * intensityScale * (active.risk === 'Critical' ? 40 : 22))) : null

  const clearSelection = useCallback(() => onSelectRegion(null), [onSelectRegion])

  const hoverHandlersRef = useRef({
    onHover: (_p: HeatmapPoint) => {},
    onLeave: () => {},
    onClick: (_p: HeatmapPoint) => {},
    selectedLabel: null as string | null,
  })

  hoverHandlersRef.current = {
    onHover: (p) => {
      if (!selectedRef.current) setHovered(p)
    },
    onLeave: () => {
      if (!selectedRef.current) setHovered(null)
    },
    onClick: (p) => {
      const cur = selectedRef.current
      onSelectRef.current(cur?.label === p.label ? null : p)
      setHovered(null)
    },
    selectedLabel: selectedRegion?.label ?? null,
  }

  // Base map + tiles first (sync). Heat plugin loads in a follow-up effect so a slow/failed
  // leaflet.heat chunk never leaves the map area blank.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    let mapBackgroundClick: (() => void) | null = null
    let invalidate: (() => void) | null = null
    let t1 = 0
    let t2 = 0
    let raf = 0
    let resizeObserver: ResizeObserver | null = null

    setMapError(null)
    setMapReady(false)
    setHeatPluginReady(false)

    let attempts = 0
    const maxAttempts = 90

    const mountMap = () => {
        if (cancelled) return
        attempts += 1
        if (attempts > maxAttempts) {
          if (!cancelled) {
            setMapError('Map container did not get a layout size. Try refreshing the page.')
          }
          return
        }
        const rect = el.getBoundingClientRect()
        if (rect.width < 4 || rect.height < 4) {
          raf = window.requestAnimationFrame(mountMap)
          return
        }

        try {
        if (typeof window !== 'undefined') {
          ;(window as unknown as { L?: typeof L }).L = L
        }

        const map = L.map(el, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          zoomControl: false,
        })

        mapBackgroundClick = () => {
          onSelectRef.current(null)
          setHovered(null)
        }
        map.on('click', mapBackgroundClick)

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)

        const ResetControl = L.Control.extend({
          onAdd: (ctrlMap: L.Map) => {
            const btn = L.DomUtil.create('button', 'cedewise-reset-control') as HTMLButtonElement
            btn.type = 'button'
            btn.textContent = 'Reset'
            btn.className =
              'bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm border border-slate-200'
            L.DomEvent.disableClickPropagation(btn)
            L.DomEvent.on(btn, 'click', () => {
              ctrlMap.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true })
              onSelectRef.current(null)
              setHovered(null)
            })
            return btn
          },
        })
        const resetCtrl = new ResetControl({ position: 'topright' })
        resetCtrl.addTo(map)
        resetControlRef.current = resetCtrl

        invalidate = () => {
          map.invalidateSize({ animate: false })
        }

        map.whenReady(() => {
          invalidate?.()
        })

        invalidate()
        t1 = window.setTimeout(() => invalidate?.(), 120)
        t2 = window.setTimeout(() => invalidate?.(), 500)
        window.addEventListener('resize', invalidate)

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => invalidate?.())
          resizeObserver.observe(el)
        }

        if (cancelled) {
          try {
            map.remove()
          } catch {
            /* ignore */
          }
          return
        }

        mapRef.current = map
        setMapReady(true)
        } catch (err) {
          console.error('[LeafletRiskHeatmap] init failed', err)
          if (!cancelled) {
            setMapError(err instanceof Error ? err.message : 'Map failed to load')
          }
        }
    }

    mountMap()

    return () => {
      cancelled = true
      window.cancelAnimationFrame(raf)
      setMapReady(false)
      setHeatPluginReady(false)
      const map = mapRef.current
      if (mapBackgroundClick && map) {
        try {
          map.off('click', mapBackgroundClick)
        } catch {
          /* ignore */
        }
      }
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      if (resizeObserver) {
        try {
          resizeObserver.disconnect()
        } catch {
          /* ignore */
        }
        resizeObserver = null
      }
      if (invalidate) {
        window.removeEventListener('resize', invalidate)
      }
      if (heatLayerRef.current && map) {
        try {
          map.removeLayer(heatLayerRef.current)
        } catch {
          /* ignore */
        }
        heatLayerRef.current = null
      }
      markersRef.current.forEach((m) => {
        try {
          m.remove()
        } catch {
          /* ignore */
        }
      })
      markersRef.current = []
      if (resetControlRef.current && map) {
        try {
          map.removeControl(resetControlRef.current)
        } catch {
          /* ignore */
        }
        resetControlRef.current = null
      }
      if (map) {
        try {
          map.remove()
        } catch {
          /* ignore */
        }
      }
      mapRef.current = null
    }
  }, [])

  // Load leaflet.heat after the map exists so tiles/markers are not blocked by chunk load.
  useEffect(() => {
    if (!mapReady) return
    let cancelled = false
    ;(async () => {
      try {
        if (typeof window !== 'undefined') {
          ;(window as unknown as { L?: typeof L }).L = L
        }
        await import('leaflet.heat')
        if (cancelled) return
        const heatLayerFn = (L as unknown as { heatLayer?: unknown }).heatLayer
        if (typeof heatLayerFn !== 'function' && typeof window !== 'undefined') {
          const wL = (window as unknown as { L?: { heatLayer?: (pts: unknown, opts: unknown) => L.Layer } }).L
          if (wL && typeof wL.heatLayer === 'function') {
            ;(L as unknown as { heatLayer: typeof wL.heatLayer }).heatLayer = wL.heatLayer
          }
        }
        if (!cancelled) setHeatPluginReady(true)
      } catch (e) {
        console.warn('[LeafletRiskHeatmap] leaflet.heat failed to load', e)
      }
    })()
    return () => {
      cancelled = true
      setHeatPluginReady(false)
    }
  }, [mapReady])

  // Heat layer (requires heat plugin on `L`)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !heatPluginReady) return

    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current)
      } catch {
        /* ignore */
      }
      heatLayerRef.current = null
    }

    if (!controls.showHeat) return

    const heatLayerFn = (L as unknown as { heatLayer?: (pts: unknown, opts: unknown) => L.Layer }).heatLayer
    if (typeof heatLayerFn !== 'function') {
      console.warn('[LeafletRiskHeatmap] heatLayer is not available; heat overlay skipped')
      return
    }

    const heatPoints = points.map(
      (p) => [p.lat, p.lng, clamp(p.intensity * intensityScale, 0, 1)] as [number, number, number]
    )
    const layer = heatLayerFn(heatPoints, {
      radius: controls.radius,
      blur: Math.round(controls.radius * 0.85),
      maxZoom: 15,
      minOpacity: 0.25,
      gradient: {
        0.2: '#34d399',
        0.45: '#facc15',
        0.7: '#fb923c',
        1.0: '#fb7185',
      },
    })
    layer.addTo(map)
    heatLayerRef.current = layer
    queueMicrotask(() => {
      try {
        map.invalidateSize({ animate: false })
      } catch {
        /* ignore */
      }
      markersRef.current.forEach((m) => {
        try {
          m.bringToFront()
        } catch {
          /* ignore */
        }
      })
    })
  }, [mapReady, heatPluginReady, points, controls.showHeat, controls.radius, intensityScale])

  // Point markers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    if (!controls.showColumns) return

    const scale = controls.intensity / 100
    const selectedLabel = hoverHandlersRef.current.selectedLabel

    const markers = points.map((p) => {
      const c = RISK_COLOR[p.risk]
      const isSelected = selectedLabel === p.label
      const baseRadius = clamp(5 + Math.round(p.intensity * 14 * scale), 5, 22)

      const style = (radius: number, weight: number) => ({
        radius,
        color: c.stroke,
        weight,
        opacity: 1,
        fillColor: c.fill,
        fillOpacity: 0.88,
      })

      const circle = L.circleMarker([p.lat, p.lng], {
        ...style(isSelected ? baseRadius + 3 : baseRadius, isSelected ? 3 : 2),
        interactive: true,
      })
      circle.addTo(map)

      circle.on('mouseover', () => {
        const sel = hoverHandlersRef.current.selectedLabel
        if (!sel || sel === p.label) {
          circle.setStyle(style(baseRadius + 5, 3))
        }
        hoverHandlersRef.current.onHover(p)
      })
      circle.on('mouseout', () => {
        const selected = hoverHandlersRef.current.selectedLabel === p.label
        circle.setStyle(style(selected ? baseRadius + 3 : baseRadius, selected ? 3 : 2))
        hoverHandlersRef.current.onLeave()
      })
      circle.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e)
        hoverHandlersRef.current.onClick(p)
      })

      return circle
    })

    markersRef.current = markers
    markers.forEach((m) => {
      try {
        m.bringToFront()
      } catch {
        /* ignore */
      }
    })

    return () => {
      markers.forEach((m) => m.remove())
    }
  }, [mapReady, points, controls.showColumns, controls.intensity, selectedRegion?.label])

  return (
    <div className="relative z-0 h-[72vh] min-h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-slate-800">
      <div
        ref={containerRef}
        className="cedewise-leaflet-root z-0 h-full w-full min-h-[400px]"
        style={{ height: '100%', width: '100%', minHeight: 'min(72vh, 520px)' }}
      />

      {!mapReady && !mapError && (
        <div className="pointer-events-none absolute inset-0 z-[900] flex items-center justify-center bg-slate-100/80 backdrop-blur-[2px]">
          <p className="text-sm font-medium text-slate-600">Loading map…</p>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 z-[900] flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-800">Could not load heatmap</p>
            <p className="mt-2 text-xs text-slate-600">{mapError}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 right-4 z-[1000] flex items-start justify-between gap-3">
        <div className="pointer-events-auto max-w-[780px] rounded-2xl border border-white/10 bg-slate-950/65 backdrop-blur-xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="text-sm font-semibold text-white">CARTO dark basemap · risk heat</div>
          <div className="mt-0.5 text-xs text-slate-300">
            {controls.riskLayer} • {controls.timeRange} • Johannesburg / Gauteng · click empty map to clear
          </div>
        </div>
      </div>

      {active && !selectedRegion && (
        <div className="absolute left-4 bottom-4 z-[1000] w-[min(420px,calc(100%-32px))] rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white">{active.label}</div>
              <div className="mt-0.5 text-xs text-slate-300">
                Risk: <span className="text-white">{active.risk}</span> • Intensity{' '}
                <span className="text-white">{Math.round(active.intensity * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-slate-300/80">Estimated exposure</div>
              <div className="mt-1 font-semibold text-white">{formatMoney(exposure ?? 0)}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-slate-300/80">Active claims</div>
              <div className="mt-1 font-semibold text-white">{claims ?? 0}</div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-300/70">Click the marker for full region dossier & Street View.</div>
        </div>
      )}

      {selectedRegion && (
        <div className="pointer-events-auto absolute right-4 top-16 z-[1000]">
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-xl bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur hover:bg-slate-900"
          >
            Clear selection
          </button>
        </div>
      )}

      <style jsx global>{`
        /* Heat canvas can stack above circle markers; ignore pointer so marker clicks register */
        .cedewise-leaflet-root .leaflet-overlay-pane canvas {
          pointer-events: none !important;
        }
        /* Redundant safeguard: Tailwind Preflight must not constrain tile imgs */
        .cedewise-leaflet-root img.leaflet-tile,
        .cedewise-leaflet-root .leaflet-tile-container img {
          max-width: none !important;
        }
      `}</style>
    </div>
  )
}
