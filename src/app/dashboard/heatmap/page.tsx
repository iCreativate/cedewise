'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HeatmapKpiCards from '@/components/dashboard/HeatmapKpiCards'
import HeatmapRegionDetailPanel from '@/components/dashboard/HeatmapRegionDetailPanel'
import HeatmapStreetView from '@/components/dashboard/HeatmapStreetView'
import type { HeatmapPoint } from '@/types/heatmap'
import HeatmapLocationSearch from '@/components/dashboard/HeatmapLocationSearch'
import RiskHeatmap, { type LeafletHeatmapControls, type MapFlyToTarget } from '@/components/dashboard/RiskHeatmap'
import type { GeocodeResult } from '@/lib/geocode'
import { getAllHeatmapPoints } from '@/data/heatmapPoints'
import { createHeatmapPointFromSearch } from '@/lib/heatmapFromLocation'
import { useHeatmapViewport } from '@/hooks/useHeatmapViewport'
import { zoomForRegionalRadius } from '@/lib/heatmapRegion'

export default function HeatmapsPage() {
  const heatmapPoints = useMemo(() => getAllHeatmapPoints(), [])

  const [controls, setControls] = useState<LeafletHeatmapControls>({
    riskLayer: 'Policy Exposure',
    timeRange: '30 Days',
    intensity: 100,
    radius: 42,
    showColumns: true,
    showHeat: true,
  })

  const [selectedRegion, setSelectedRegion] = useState<HeatmapPoint | null>(null)
  const [searchedPoint, setSearchedPoint] = useState<HeatmapPoint | null>(null)
  const [flyTo, setFlyTo] = useState<MapFlyToTarget | null>(null)
  const regionPanelRef = useRef<HTMLDivElement | null>(null)

  const {
    viewport,
    regionalPoints,
    userLocation,
    geoStatus,
    requestGeolocation,
    setViewportFromSearch,
  } = useHeatmapViewport(heatmapPoints, searchedPoint)

  const handleSelectRegion = useCallback((region: HeatmapPoint | null) => {
    setSelectedRegion(region)
  }, [])

  const handleSearchLocation = useCallback(
    (result: GeocodeResult) => {
      const point = createHeatmapPointFromSearch(result)
      setSearchedPoint(point)
      setSelectedRegion(point)
      setViewportFromSearch(result)
      const zoom =
        result.displayName.split(',').length <= 2
          ? zoomForRegionalRadius(viewport.radiusKm)
          : result.displayName.match(/\d/)
            ? 14
            : 12
      setFlyTo({ lat: result.lat, lng: result.lng, zoom, key: Date.now() })
    },
    [setViewportFromSearch, viewport.radiusKm]
  )

  useEffect(() => {
    if (!selectedRegion) return
    regionPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedRegion])

  const intensityScale = useMemo(() => Math.min(1.6, Math.max(0.25, controls.intensity / 100)), [controls.intensity])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/60 border border-white/10 px-3 py-1 text-xs text-slate-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
          Executive Risk Intelligence
        </div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Heatmaps</h1>
        <p className="mt-2 text-slate-600">
          Risk concentration for your area — allow location access or search where you want to quote. Hotspots are filtered to the active region.
        </p>
      </div>

      <div className="mb-6">
        <HeatmapKpiCards />
      </div>

      <div className="mb-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-white p-4 shadow-sm">
        <HeatmapLocationSearch
          onSelectLocation={handleSearchLocation}
          onUseMyLocation={requestGeolocation}
          geoStatus={geoStatus}
          regionLabel={viewport.label}
        />
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-600">Risk Layer</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40"
              value={controls.riskLayer}
              onChange={(e) => setControls((p) => ({ ...p, riskLayer: e.target.value as LeafletHeatmapControls['riskLayer'] }))}
            >
              <option>Policy Exposure</option>
              <option>Claims Density</option>
              <option>Broker Activity</option>
              <option>Regional Migration</option>
              <option>Loss Ratio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Time Range</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40"
              value={controls.timeRange}
              onChange={(e) => setControls((p) => ({ ...p, timeRange: e.target.value as LeafletHeatmapControls['timeRange'] }))}
            >
              <option>Today</option>
              <option>7 Days</option>
              <option>30 Days</option>
              <option>Quarter</option>
              <option>Year</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Intensity</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="range"
                min={25}
                max={140}
                value={controls.intensity}
                onChange={(e) => setControls((p) => ({ ...p, intensity: Number(e.target.value) }))}
                className="w-full accent-cyan-500"
              />
              <div className="w-12 shrink-0 text-right text-sm font-semibold text-slate-700">{controls.intensity}%</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Radius</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="range"
                min={20}
                max={80}
                value={controls.radius}
                onChange={(e) => setControls((p) => ({ ...p, radius: Number(e.target.value) }))}
                className="w-full accent-cyan-500"
              />
              <div className="w-12 shrink-0 text-right text-sm font-semibold text-slate-700">{controls.radius}px</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2">
          <span className="text-xs font-medium text-slate-500 sm:mr-1">Display</span>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={controls.showColumns}
              onChange={(e) => setControls((p) => ({ ...p, showColumns: e.target.checked }))}
              className="h-4 w-4 accent-cyan-500"
            />
            Show markers
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={controls.showHeat}
              onChange={(e) => setControls((p) => ({ ...p, showHeat: e.target.checked }))}
              className="h-4 w-4 accent-cyan-500"
            />
            Show Heat Overlay
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-stretch">
        <RiskHeatmap
          points={regionalPoints}
          viewport={viewport}
          userLocation={userLocation}
          controls={controls}
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
          flyTo={flyTo}
        />
        <HeatmapStreetView region={selectedRegion} />
      </div>

      <section id="heatmap-region-detail" className="mt-6 scroll-mt-6" aria-label="Selected region details">
        <h2 className="sr-only">Selected region</h2>
        <HeatmapRegionDetailPanel
          ref={regionPanelRef}
          region={selectedRegion}
          intensityScale={intensityScale}
          riskLayer={controls.riskLayer}
          timeRange={controls.timeRange}
        />
      </section>
    </div>
  )
}
