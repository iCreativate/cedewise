'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { HeatmapPoint } from '@/types/heatmap'
import type { GeocodeResult } from '@/lib/geocode'
import {
  FALLBACK_VIEWPORT,
  filterPointsForViewport,
  mergePointsWithSearch,
  REGIONAL_RADIUS_KM,
  type HeatmapViewport,
} from '@/lib/heatmapRegion'

export type GeoStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported'

async function reverseGeocodeLabel(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
    const json = (await res.json()) as { success?: boolean; results?: GeocodeResult[] }
    if (!res.ok || !json.success || !json.results?.[0]) return null
    return json.results[0].shortLabel
  } catch {
    return null
  }
}

export function useHeatmapViewport(allPoints: HeatmapPoint[], searchedPoint: HeatmapPoint | null) {
  const [viewport, setViewport] = useState<HeatmapViewport>(FALLBACK_VIEWPORT)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')
  const geoRequestedRef = useRef(false)

  const requestGeolocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('unsupported')
      return
    }

    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(center)
        setGeoStatus('ready')
        setViewport((prev) => ({
          center,
          radiusKm: REGIONAL_RADIUS_KM,
          label: 'Your area',
          source: 'geolocation',
          key: prev.key + 1,
        }))
        void reverseGeocodeLabel(center.lat, center.lng).then((label) => {
          if (!label) return
          setViewport((prev) =>
            prev.source === 'geolocation' ? { ...prev, label } : prev
          )
        })
      },
      (err) => {
        setGeoStatus(err.code === 1 ? 'denied' : 'unsupported')
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300_000 }
    )
  }, [])

  useEffect(() => {
    if (geoRequestedRef.current) return
    geoRequestedRef.current = true
    requestGeolocation()
  }, [requestGeolocation])

  const setViewportFromSearch = useCallback((result: GeocodeResult) => {
    setViewport((prev) => ({
      center: { lat: result.lat, lng: result.lng },
      radiusKm: REGIONAL_RADIUS_KM,
      label: result.shortLabel,
      source: 'search',
      key: prev.key + 1,
    }))
  }, [])

  const regionalPoints = useMemo(() => {
    const filtered = filterPointsForViewport(allPoints, viewport.center, viewport.radiusKm)
    return mergePointsWithSearch(filtered, searchedPoint)
  }, [allPoints, viewport.center, viewport.radiusKm, viewport.key, searchedPoint])

  return {
    viewport,
    regionalPoints,
    userLocation,
    geoStatus,
    requestGeolocation,
    setViewportFromSearch,
  }
}
