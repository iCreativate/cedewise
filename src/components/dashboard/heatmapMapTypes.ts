export type HeatmapControls = {
  riskLayer: 'Policy Exposure' | 'Claims Density' | 'Broker Activity' | 'Regional Migration' | 'Loss Ratio'
  timeRange: 'Today' | '7 Days' | '30 Days' | 'Quarter' | 'Year'
  intensity: number
  radius: number
  showColumns: boolean
  showHeat: boolean
}

/** @deprecated Use HeatmapControls */
export type LeafletHeatmapControls = HeatmapControls

export type MapFlyToTarget = {
  lat: number
  lng: number
  zoom?: number
  key: number
}

export type { HeatmapViewport } from '@/lib/heatmapRegion'
