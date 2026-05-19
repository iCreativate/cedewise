'use client'

import dynamic from 'next/dynamic'
import { getGoogleMapsApiKey } from '@/lib/googleMaps'
import type { HeatmapControls, HeatmapViewport, MapFlyToTarget } from './heatmapMapTypes'
import type { HeatmapPoint } from '@/types/heatmap'

export type {
  HeatmapControls,
  HeatmapControls as LeafletHeatmapControls,
  HeatmapViewport,
  MapFlyToTarget,
} from './heatmapMapTypes'

const mapLoading = (
  <div className="h-[72vh] min-h-[520px] w-full rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse" />
)

const GoogleRiskHeatmap = dynamic(() => import('@/components/dashboard/GoogleRiskHeatmap'), {
  ssr: false,
  loading: () => mapLoading,
})

const LeafletRiskHeatmap = dynamic(() => import('@/components/dashboard/LeafletRiskHeatmap'), {
  ssr: false,
  loading: () => mapLoading,
})

export default function RiskHeatmap(props: {
  points: HeatmapPoint[]
  viewport: HeatmapViewport
  userLocation?: { lat: number; lng: number } | null
  controls: HeatmapControls
  selectedRegion: HeatmapPoint | null
  onSelectRegion: (region: HeatmapPoint | null) => void
  flyTo?: MapFlyToTarget | null
}) {
  const useGoogle = Boolean(getGoogleMapsApiKey())
  const MapComponent = useGoogle ? GoogleRiskHeatmap : LeafletRiskHeatmap
  return <MapComponent {...props} />
}
