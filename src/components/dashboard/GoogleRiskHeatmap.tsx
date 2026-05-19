'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { HeatmapPoint } from '@/types/heatmap'
import { getGoogleMapId, loadGoogleMapsApi } from '@/lib/googleMaps'
import type { HeatmapControls, HeatmapViewport, MapFlyToTarget } from './heatmapMapTypes'
import { zoomForRegionalRadius } from '@/lib/heatmapRegion'

function fitRegionalMap(
  map: google.maps.Map,
  pts: HeatmapPoint[],
  viewport: HeatmapViewport
) {
  const maxZoom = zoomForRegionalRadius(viewport.radiusKm)
  if (pts.length >= 2) {
    const bounds = new google.maps.LatLngBounds()
    pts.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }))
    map.fitBounds(bounds, 48)
    const z = map.getZoom()
    if (z !== undefined && z > maxZoom) map.setZoom(maxZoom)
  } else {
    map.setCenter(viewport.center)
    map.setZoom(maxZoom)
  }
}

const RISK_COLOR: Record<HeatmapPoint['risk'], { fill: string; stroke: string }> = {
  Low: { fill: '#34d399', stroke: '#047857' },
  Medium: { fill: '#facc15', stroke: '#a16207' },
  High: { fill: '#fb923c', stroke: '#c2410c' },
  Critical: { fill: '#fb7185', stroke: '#be123c' },
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
}

export default function GoogleRiskHeatmap({
  points,
  viewport,
  userLocation,
  controls,
  selectedRegion,
  onSelectRegion,
  flyTo,
}: {
  points: HeatmapPoint[]
  viewport: HeatmapViewport
  userLocation?: { lat: number; lng: number } | null
  controls: HeatmapControls
  selectedRegion: HeatmapPoint | null
  onSelectRegion: (region: HeatmapPoint | null) => void
  flyTo?: MapFlyToTarget | null
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const heatLayerRef = useRef<google.maps.visualization.HeatmapLayer | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const listenersRef = useRef<google.maps.MapsEventListener[]>([])
  const pointsRef = useRef(points)
  pointsRef.current = points
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  const [hovered, setHovered] = useState<HeatmapPoint | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const onSelectRef = useRef(onSelectRegion)
  onSelectRef.current = onSelectRegion
  const selectedRef = useRef(selectedRegion)
  selectedRef.current = selectedRegion

  const intensityScale = useMemo(() => clamp(controls.intensity / 100, 0.25, 1.6), [controls.intensity])
  const displayPoints = useMemo(() => points, [points])

  const active = selectedRegion ?? hovered
  const exposure = active ? Math.round(3_000_000_000 * active.intensity * intensityScale * 0.5) : null
  const claims = active
    ? Math.max(1, Math.round(active.intensity * intensityScale * (active.risk === 'Critical' ? 40 : 22)))
    : null

  const clearSelection = useCallback(() => onSelectRegion(null), [onSelectRegion])

  const fitRegional = useCallback((map: google.maps.Map) => {
    fitRegionalMap(map, pointsRef.current, viewportRef.current)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    setMapError(null)
    setMapReady(false)

    loadGoogleMapsApi()
      .then((g) => {
        if (cancelled) return
        const vp = viewportRef.current
        const map = new g.maps.Map(el, {
          center: vp.center,
          zoom: zoomForRegionalRadius(vp.radiusKm),
          mapId: getGoogleMapId(),
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        })
        mapRef.current = map

        const clickListener = map.addListener('click', () => {
          onSelectRef.current(null)
          setHovered(null)
        })
        listenersRef.current.push(clickListener)

        fitRegionalMap(map, pointsRef.current, vp)
        setMapReady(true)
      })
      .catch((err) => {
        if (!cancelled) {
          setMapError(err instanceof Error ? err.message : 'Google Maps failed to load')
        }
      })

    return () => {
      cancelled = true
      setMapReady(false)
      listenersRef.current.forEach((l) => l.remove())
      listenersRef.current = []
      markersRef.current.forEach((m) => {
        m.map = null
      })
      markersRef.current = []
      if (heatLayerRef.current) {
        heatLayerRef.current.setMap(null)
        heatLayerRef.current = null
      }
      mapRef.current = null
    }
  }, [fitRegional])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    fitRegionalMap(map, points, viewport)
  }, [mapReady, viewport.key, points.length, viewport.center.lat, viewport.center.lng])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null
      userMarkerRef.current = null
    }
    if (!userLocation || !google.maps.marker?.PinElement) return
    const pin = new google.maps.marker.PinElement({
      background: '#38bdf8',
      borderColor: '#0284c7',
      glyphColor: '#ffffff',
      scale: 1.1,
    })
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: userLocation,
      title: 'Your location',
      content: pin.element,
      zIndex: 2000,
    })
    userMarkerRef.current = marker
    return () => {
      marker.map = null
    }
  }, [mapReady, userLocation?.lat, userLocation?.lng])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !flyTo) return
    map.panTo({ lat: flyTo.lat, lng: flyTo.lng })
    map.setZoom(flyTo.zoom ?? 12)
  }, [flyTo, mapReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    if (heatLayerRef.current) {
      heatLayerRef.current.setMap(null)
      heatLayerRef.current = null
    }

    if (!controls.showHeat || !google.maps.visualization?.HeatmapLayer) return

    const heatData = displayPoints
      .filter((p) => !p.isSearchLocation)
      .map((p) => ({
        location: new google.maps.LatLng(p.lat, p.lng),
        weight: clamp(p.intensity * intensityScale, 0.05, 1),
      }))

    const layer = new google.maps.visualization.HeatmapLayer({
      data: heatData,
      map,
      dissipating: true,
      radius: controls.radius,
      opacity: 0.65,
      gradient: [
        'rgba(52,211,153,0)',
        'rgba(52,211,153,0.6)',
        'rgba(250,204,21,0.75)',
        'rgba(251,146,60,0.85)',
        'rgba(251,113,133,1)',
      ],
    })
    heatLayerRef.current = layer
  }, [mapReady, displayPoints, controls.showHeat, controls.radius, intensityScale])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    markersRef.current.forEach((m) => {
      m.map = null
    })
    markersRef.current = []

    if (!controls.showColumns) return

    const selectedLabel = selectedRegion?.label ?? null
    const scale = controls.intensity / 100

    for (const p of displayPoints) {
      const isSearch = Boolean(p.isSearchLocation)
      const colors = isSearch ? { fill: '#06b6d4', stroke: '#0e7490' } : RISK_COLOR[p.risk]
      const isSelected = selectedLabel === p.label
      const scalePin = isSearch ? 1.15 : clamp(0.85 + p.intensity * 0.35 * scale, 0.75, 1.35)

      let content: HTMLElement | undefined
      if (google.maps.marker?.PinElement) {
        const pin = new google.maps.marker.PinElement({
          background: colors.fill,
          borderColor: colors.stroke,
          glyphColor: '#ffffff',
          scale: isSelected ? scalePin * 1.2 : scalePin,
        })
        content = pin.element
      }

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: p.lat, lng: p.lng },
        title: p.label,
        content,
        zIndex: isSelected ? 1000 : Math.round(p.intensity * 500),
      })

      marker.addListener('gmp-click', (e: Event) => {
        e.stopPropagation()
        const cur = selectedRef.current
        onSelectRef.current(cur?.label === p.label ? null : p)
        setHovered(null)
      })

      marker.addListener('mouseover', () => {
        if (!selectedRef.current) setHovered(p)
      })
      marker.addListener('mouseout', () => {
        if (!selectedRef.current) setHovered(null)
      })

      markersRef.current.push(marker)
    }
  }, [mapReady, displayPoints, controls.showColumns, controls.intensity, selectedRegion?.label])

  return (
    <div className="relative z-0 h-[72vh] min-h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        ref={containerRef}
        className="h-full w-full min-h-[400px]"
        style={{ height: '100%', width: '100%', minHeight: 'min(72vh, 520px)' }}
      />

      {!mapReady && !mapError && (
        <div className="pointer-events-none absolute inset-0 z-[900] flex items-center justify-center bg-slate-100/80 backdrop-blur-[2px]">
          <p className="text-sm font-medium text-slate-600">Loading Google Maps…</p>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 z-[900] flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-800">Could not load Google Maps</p>
            <p className="mt-2 text-xs text-slate-600">{mapError}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 right-4 z-[1000] flex items-start justify-between gap-3">
        <div className="pointer-events-auto max-w-[780px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-md">
          <div className="text-sm font-semibold text-slate-900">Risk heatmap · Google Maps</div>
          <div className="mt-0.5 text-xs text-slate-600">
            {viewport.label} · {points.length} hotspots in region · {controls.riskLayer} • {controls.timeRange}
          </div>
        </div>
        {mapReady && (
          <button
            type="button"
            onClick={() => {
              const map = mapRef.current
              if (map) fitRegional(map)
              onSelectRegion(null)
              setHovered(null)
            }}
            className="pointer-events-auto rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-md ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Reset view
          </button>
        )}
      </div>

      {active && !selectedRegion && (
        <div className="absolute left-4 bottom-4 z-[1000] w-[min(420px,calc(100%-32px))] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm p-4 shadow-lg">
          <div className="text-sm font-semibold text-slate-900">{active.label}</div>
          <div className="mt-0.5 text-xs text-slate-600">
            Risk: <span className="font-medium text-slate-900">{active.risk}</span> • Intensity{' '}
            <span className="font-medium text-slate-900">{Math.round(active.intensity * 100)}%</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-slate-500">Estimated exposure</div>
              <div className="mt-1 font-semibold text-slate-900">{formatMoney(exposure ?? 0)}</div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-slate-500">Active claims</div>
              <div className="mt-1 font-semibold text-slate-900">{claims ?? 0}</div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Click a marker for dossier & Street View.</p>
        </div>
      )}

      {selectedRegion && (
        <div className="pointer-events-auto absolute right-4 top-16 z-[1000]">
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-md ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}
