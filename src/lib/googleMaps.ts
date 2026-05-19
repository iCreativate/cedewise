/** Client-safe Google Maps API key (NEXT_PUBLIC_* — inlined at build time). */
export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
  return key || undefined
}

/** Map ID for Advanced Markers (Cloud Console or Google's DEMO_MAP_ID for testing). */
export function getGoogleMapId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAP_ID?.trim() || 'DEMO_MAP_ID'
}

let loadPromise: Promise<typeof google> | null = null

/** Load Maps JS API (beta) with marker + visualization — matches Google gmp-map samples. */
export function loadGoogleMapsApi(): Promise<typeof google> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only load in the browser'))
  }
  if (window.google?.maps) {
    return Promise.resolve(window.google)
  }
  if (loadPromise) return loadPromise

  const key = getGoogleMapsApiKey()
  if (!key) {
    return Promise.reject(new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set'))
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-cedewise-gmaps]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google))
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed')))
      return
    }

    const script = document.createElement('script')
    script.dataset.cedewiseGmaps = 'true'
    script.async = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=maps,marker,visualization&v=beta`
    script.onload = () => {
      if (window.google?.maps) resolve(window.google)
      else reject(new Error('Google Maps failed to initialize'))
    }
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })

  return loadPromise
}

export function buildStreetViewEmbedUrl(lat: number, lng: number, apiKey: string): string {
  const params = new URLSearchParams({
    key: apiKey,
    location: `${lat},${lng}`,
    heading: '25',
    pitch: '5',
    fov: '75',
  })
  return `https://www.google.com/maps/embed/v1/streetview?${params.toString()}`
}

export function buildStreetViewExternalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`
}
