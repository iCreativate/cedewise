import type { HeatmapPoint } from '@/types/heatmap'

/** Default radius around the user or searched location (km). */
export const REGIONAL_RADIUS_KM = 400

/** Minimum hotspots to show in a regional view. */
export const MIN_REGIONAL_POINTS = 5

const EARTH_RADIUS_KM = 6371

export type LatLng = { lat: number; lng: number }

export type HeatmapViewport = {
  center: LatLng
  radiusKm: number
  label: string
  source: 'default' | 'geolocation' | 'search'
  /** Bumped when the viewport changes so maps can refit. */
  key: number
}

export const FALLBACK_VIEWPORT: HeatmapViewport = {
  center: { lat: -26.2041, lng: 28.0473 },
  radiusKm: REGIONAL_RADIUS_KM,
  label: 'Gauteng, South Africa',
  source: 'default',
  key: 0,
}

export function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Keep only points near the active region; expand slightly if the area is sparse. */
export function filterPointsForViewport(
  points: HeatmapPoint[],
  center: LatLng,
  radiusKm: number = REGIONAL_RADIUS_KM,
  minPoints: number = MIN_REGIONAL_POINTS
): HeatmapPoint[] {
  if (points.length === 0) return []

  const withDistance = points
    .map((p) => ({ p, d: distanceKm(center, p) }))
    .sort((a, b) => a.d - b.d)

  const inRadius = withDistance.filter(({ d }) => d <= radiusKm).map(({ p }) => p)
  if (inRadius.length >= minPoints) return inRadius

  const take = Math.min(minPoints, withDistance.length)
  const cutoff = withDistance[take - 1]?.d ?? radiusKm
  const expanded = Math.max(radiusKm, cutoff + 25)
  return withDistance.filter(({ d }) => d <= expanded).map(({ p }) => p)
}

/** Suggested map zoom for a regional radius. */
export function zoomForRegionalRadius(radiusKm: number): number {
  if (radiusKm <= 80) return 11
  if (radiusKm <= 200) return 9
  if (radiusKm <= 400) return 8
  return 7
}

export function mergePointsWithSearch(
  regional: HeatmapPoint[],
  searched: HeatmapPoint | null
): HeatmapPoint[] {
  if (!searched) return regional
  const exists = regional.some(
    (p) => p.label === searched.label && Math.abs(p.lat - searched.lat) < 0.02
  )
  if (exists) {
    return regional.map((p) =>
      p.label === searched.label && Math.abs(p.lat - searched.lat) < 0.02
        ? { ...p, ...searched, isSearchLocation: true }
        : p
    )
  }
  return [...regional, searched]
}
