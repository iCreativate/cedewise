import { NextRequest, NextResponse } from 'next/server'
import { parseNominatimPlace, type NominatimPlace } from '@/lib/geocode'

export const runtime = 'nodejs'

const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search'

const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse'

export async function GET(request: NextRequest) {
  const latParam = request.nextUrl.searchParams.get('lat')
  const lngParam = request.nextUrl.searchParams.get('lng') ?? request.nextUrl.searchParams.get('lon')
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (latParam && lngParam) {
    const lat = Number.parseFloat(latParam)
    const lng = Number.parseFloat(lngParam)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 })
    }
    try {
      const url = new URL(NOMINATIM_REVERSE)
      url.searchParams.set('lat', String(lat))
      url.searchParams.set('lon', String(lng))
      url.searchParams.set('format', 'json')
      url.searchParams.set('addressdetails', '1')

      const res = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Cedewise/1.0 (heatmap reverse geocode; contact@cedewise.com)',
        },
        next: { revalidate: 3600 },
      })

      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: 'Reverse geocoding is temporarily unavailable.' },
          { status: 502 }
        )
      }

      const place = (await res.json()) as NominatimPlace
      if (!place?.lat) {
        return NextResponse.json({ success: true, results: [] })
      }
      return NextResponse.json({ success: true, results: [parseNominatimPlace(place)] })
    } catch (e) {
      console.error('[geocode reverse]', e)
      return NextResponse.json(
        { success: false, error: e instanceof Error ? e.message : 'Reverse geocoding failed' },
        { status: 500 }
      )
    }
  }

  if (q.length < 2) {
    return NextResponse.json({ success: true, results: [] })
  }

  try {
    const url = new URL(NOMINATIM_SEARCH)
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'json')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', '8')

    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Cedewise/1.0 (heatmap location search; contact@cedewise.com)',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Location search is temporarily unavailable.' },
        { status: 502 }
      )
    }

    const data = (await res.json()) as NominatimPlace[]
    const results = Array.isArray(data) ? data.map(parseNominatimPlace) : []

    return NextResponse.json({ success: true, results })
  } catch (e) {
    console.error('[geocode]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Geocoding failed' },
      { status: 500 }
    )
  }
}
