'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HeatmapKpiCards from '@/components/dashboard/HeatmapKpiCards'
import HeatmapRegionDetailPanel from '@/components/dashboard/HeatmapRegionDetailPanel'
import HeatmapStreetView from '@/components/dashboard/HeatmapStreetView'
import type { HeatmapPoint, RegionRiskDetail } from '@/types/heatmap'
import type { LeafletHeatmapControls } from '@/components/dashboard/LeafletRiskHeatmap'

const LeafletRiskHeatmap = dynamic(() => import('@/components/dashboard/LeafletRiskHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="h-[72vh] min-h-[520px] w-full rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse" />
  ),
})

function detail(partial: Partial<RegionRiskDetail> & Pick<RegionRiskDetail, 'municipality' | 'summary'>): RegionRiskDetail {
  return {
    province: 'Gauteng',
    predominantPerils: ['Fire & allied perils', 'Business interruption', 'Theft'],
    indicativeExposure: 'R 400M – R 1.2B',
    lossRatioBand: '42% – 58%',
    activePolicies: 210,
    openClaims: 12,
    premiumBenchmark: '0.55% – 0.95% of TSI (indicative)',
    underwritingFocus: [
      'Reconcile TSI vs. occupancy schedules for this cell.',
      'Stress BI and waiting periods against recent large-loss patterns.',
    ],
    reinsuranceAngle: 'Layered programme with nat-cat sub-limits recommended for peak Gauteng corridors.',
    ...partial,
  }
}

export default function HeatmapsPage() {
  const heatmapPoints: HeatmapPoint[] = useMemo(
    () => [
      {
        lat: -26.2041,
        lng: 28.0473,
        intensity: 0.95,
        label: 'Johannesburg CBD',
        risk: 'Critical',
        details: detail({
          municipality: 'Johannesburg',
          summary:
            'Dense CBD commercial stack with elevated BI accumulation and concentration of high-value retail and offices. Street-level review should focus on ingress/egress, fire compartmentation, and neighbouring exposures.',
          predominantPerils: ['Fire', 'BI / CBI', 'Political violence spillover', 'Theft'],
          indicativeExposure: 'R 2.4B – R 3.6B',
          lossRatioBand: '72% – 88%',
          activePolicies: 412,
          openClaims: 38,
          premiumBenchmark: '1.05% – 1.45% of TSI (indicative)',
          underwritingFocus: [
            'Demand updated valuations and sprinkler inspection certificates.',
            'Map BI indemnity vs. realistic maximum indemnity period.',
            'Peer review against Sandton / Rosebank cluster correlations.',
          ],
          reinsuranceAngle:
            'Strong case for facultative top-up or per-risk excess of loss before binding primary layer renewals.',
          lineOfBusiness: 'CBD commercial property',
          quotableBusinesses: [
            { id: 'jhb-cbd-all', name: 'Full CBD cell (aggregated portfolio)', segment: 'Portfolio' },
            {
              id: 'jhb-cbd-1',
              name: 'Carlton Centre — retail & upper offices',
              segment: 'Retail / office',
              location: '45 Commissioner St, Johannesburg CBD',
              tsiBand: 'R 410M – R 620M',
              summary: 'Super-block retail and tower offices; high BI dependency and dense footfall — confirm fire engineering and sprinkler maintenance records.',
              policiesCount: 14,
              openClaims: 5,
            },
            {
              id: 'jhb-cbd-2',
              name: 'Marshalltown fire-precinct commercial cluster',
              segment: 'Commercial property',
              location: 'Marshalltown / Simmonds St precinct',
              tsiBand: 'R 95M – R 210M',
              summary: 'Mid-rise commercial stack; peer with Gandhi Square for grid and civil unrest correlation.',
              policiesCount: 9,
              openClaims: 2,
            },
            {
              id: 'jhb-cbd-3',
              name: 'Gandhi Square — transport-adjacent retail',
              segment: 'Retail',
              location: 'Gandhi Square & Lillian Ngoyi St',
              tsiBand: 'R 38M – R 92M',
              summary: 'Commuter-heavy retail; theft and glass perils elevated — line-size often layered with CBD programme.',
              policiesCount: 22,
              openClaims: 4,
            },
          ],
        }),
      },
      {
        lat: -26.1076,
        lng: 28.0567,
        intensity: 0.75,
        label: 'Sandton',
        risk: 'High',
        details: detail({
          municipality: 'Sandton',
          summary:
            'Premium office and mixed-use node with sustained placement activity. Loss experience skewed to water damage and power-surge BI events.',
          indicativeExposure: 'R 1.1B – R 2.0B',
          lossRatioBand: '58% – 72%',
          activePolicies: 318,
          openClaims: 22,
          lineOfBusiness: 'Office / mixed-use',
          quotableBusinesses: [
            { id: 'sdn-all', name: 'Full Sandton cell (aggregated)', segment: 'Portfolio' },
            { id: 'sdn-1', name: 'Sandton City — super-regional mall', segment: 'Retail' },
            { id: 'sdn-2', name: 'Alice Lane / Fredman Drive office strip', segment: 'Office' },
            { id: 'sdn-3', name: 'Sandton Gautrain precinct mixed-use', segment: 'Mixed-use' },
          ],
        }),
      },
      {
        lat: -26.1451,
        lng: 28.0341,
        intensity: 0.65,
        label: 'Rosebank',
        risk: 'High',
        details: detail({
          municipality: 'Rosebank',
          summary:
            'Mid-rise commercial hub with retail podiums; watch for aggregation with adjacent nodes on the same grid.',
          indicativeExposure: 'R 720M – R 1.4B',
          lossRatioBand: '54% – 68%',
          activePolicies: 256,
          openClaims: 17,
          quotableBusinesses: [
            { id: 'rb-all', name: 'Full Rosebank cell (aggregated)', segment: 'Portfolio' },
            { id: 'rb-1', name: 'The Zone @ Rosebank — retail podium', segment: 'Retail' },
            { id: 'rb-2', name: 'Oxford / Cradock mid-rise offices', segment: 'Office' },
            { id: 'rb-3', name: 'Rosebank Mall — anchor & line shops', segment: 'Retail' },
          ],
        }),
      },
      {
        lat: -26.2678,
        lng: 27.8585,
        intensity: 0.55,
        label: 'Soweto',
        risk: 'Medium',
        details: detail({
          municipality: 'Soweto',
          summary:
            'Residential and light commercial mix with different peril mix (fire, weather, liability). Community exposure drivers differ from CBD core.',
          predominantPerils: ['Fire', 'Weather', 'Liability'],
          indicativeExposure: 'R 180M – R 520M',
          lossRatioBand: '44% – 58%',
          activePolicies: 540,
          openClaims: 31,
          lineOfBusiness: 'Residential / SMME',
          quotableBusinesses: [
            { id: 'sow-all', name: 'Full Soweto cell (aggregated)', segment: 'Portfolio' },
            { id: 'sow-1', name: 'Jabulani Mall — community retail hub', segment: 'Retail' },
            { id: 'sow-2', name: 'Maponya Mall — mixed retail & offices', segment: 'Mixed' },
            { id: 'sow-3', name: 'SMME light industrial strip — Orlando', segment: 'SMME' },
          ],
        }),
      },
      {
        lat: -26.3225,
        lng: 28.1237,
        intensity: 0.45,
        label: 'Alberton',
        risk: 'Medium',
        details: detail({
          municipality: 'Alberton',
          summary:
            'Industrial fringe and logistics exposure; check for stacking with highway-adjacent risks and hail history.',
          indicativeExposure: 'R 140M – R 380M',
          lossRatioBand: '40% – 54%',
          activePolicies: 198,
          openClaims: 11,
          lineOfBusiness: 'Industrial / logistics',
          quotableBusinesses: [
            { id: 'alb-all', name: 'Full Alberton cell (aggregated)', segment: 'Portfolio' },
            { id: 'alb-1', name: 'Alrode industrial park — heavy plant', segment: 'Industrial' },
            { id: 'alb-2', name: 'N12 logistics warehouse cluster', segment: 'Logistics' },
            { id: 'alb-3', name: 'Highway-adjacent cold storage', segment: 'Logistics' },
          ],
        }),
      },
      {
        lat: -26.1883,
        lng: 28.3208,
        intensity: 0.35,
        label: 'Benoni',
        risk: 'Low',
        details: detail({
          municipality: 'Benoni',
          summary:
            'Lower heat intensity cell suitable for cleaner primary terms, subject to standard underwriting evidence.',
          indicativeExposure: 'R 90M – R 240M',
          lossRatioBand: '32% – 46%',
          activePolicies: 142,
          openClaims: 6,
          premiumBenchmark: '0.35% – 0.65% of TSI (indicative)',
          quotableBusinesses: [
            { id: 'ben-all', name: 'Full Benoni cell (aggregated)', segment: 'Portfolio' },
            { id: 'ben-1', name: 'Lakefield office park', segment: 'Office' },
            { id: 'ben-2', name: 'Northmead light industrial row', segment: 'SMME' },
          ],
        }),
      },
    ],
    []
  )

  const [controls, setControls] = useState<LeafletHeatmapControls>({
    riskLayer: 'Policy Exposure',
    timeRange: '30 Days',
    intensity: 100,
    radius: 42,
    showColumns: true,
    showHeat: true,
  })

  const [selectedRegion, setSelectedRegion] = useState<HeatmapPoint | null>(null)
  const regionPanelRef = useRef<HTMLDivElement | null>(null)

  const handleSelectRegion = useCallback((region: HeatmapPoint | null) => {
    setSelectedRegion(region)
  }, [])

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
          Visualize regional risk concentration, claim density, broker activity, and policy exposure — then open Street View and a regional dossier to support quoting.
        </p>
      </div>

      <div className="mb-6">
        <HeatmapKpiCards />
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
        <LeafletRiskHeatmap
          points={heatmapPoints}
          controls={controls}
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
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
