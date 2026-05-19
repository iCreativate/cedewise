export interface GeocodeResult {
  lat: number
  lng: number
  displayName: string
  shortLabel: string
  municipality: string
  region: string
  country: string
}

export interface NominatimAddress {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
  country?: string
  country_code?: string
}

export interface NominatimPlace {
  lat: string
  lon: string
  display_name: string
  address?: NominatimAddress
}

export function parseNominatimPlace(place: NominatimPlace): GeocodeResult {
  const lat = Number.parseFloat(place.lat)
  const lng = Number.parseFloat(place.lon)
  const addr = place.address ?? {}
  const municipality =
    addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? place.display_name.split(',')[0]
  const region = addr.state ?? addr.county ?? ''
  const country = addr.country ?? ''
  const shortLabel = [municipality, country].filter(Boolean).join(', ') || place.display_name.split(',').slice(0, 2).join(', ')

  return {
    lat,
    lng,
    displayName: place.display_name,
    shortLabel,
    municipality,
    region,
    country,
  }
}
