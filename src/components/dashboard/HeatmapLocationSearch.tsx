'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { MagnifyingGlassIcon, MapPinIcon, SignalIcon } from '@heroicons/react/24/outline'
import type { GeocodeResult } from '@/lib/geocode'
import type { GeoStatus } from '@/hooks/useHeatmapViewport'

interface HeatmapLocationSearchProps {
  onSelectLocation: (result: GeocodeResult) => void
  onUseMyLocation?: () => void
  geoStatus?: GeoStatus
  regionLabel?: string
  className?: string
}

export default function HeatmapLocationSearch({
  onSelectLocation,
  onUseMyLocation,
  geoStatus = 'idle',
  regionLabel,
  className = '',
}: HeatmapLocationSearchProps) {
  const listId = useId()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q.trim())}`)
      const json = (await res.json()) as { success?: boolean; results?: GeocodeResult[]; error?: string }
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Could not search locations')
      }
      setSuggestions(json.results ?? [])
      setIsOpen((json.results?.length ?? 0) > 0)
      setActiveIndex(-1)
    } catch (e) {
      setSuggestions([])
      setIsOpen(false)
      setError(e instanceof Error ? e.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(query)
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSuggestions])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const pickResult = (result: GeocodeResult) => {
    setQuery(result.shortLabel)
    setIsOpen(false)
    setSuggestions([])
    onSelectLocation(result)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      pickResult(suggestions[activeIndex])
      return
    }
    if (suggestions[0]) {
      pickResult(suggestions[0])
      return
    }
    if (query.trim().length < 2) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`)
      const json = (await res.json()) as { success?: boolean; results?: GeocodeResult[]; error?: string }
      if (!res.ok || !json.success) throw new Error(json.error || 'Could not search locations')
      const results = json.results ?? []
      if (results[0]) pickResult(results[0])
      else setError('No locations found. Try a city, address, or landmark.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const geoHint =
    geoStatus === 'loading'
      ? 'Detecting your location…'
      : geoStatus === 'ready'
        ? regionLabel
          ? `Showing hotspots near ${regionLabel}.`
          : 'Showing hotspots near you.'
        : geoStatus === 'denied'
          ? 'Location access denied — search for a city or use the button below.'
          : geoStatus === 'unsupported'
            ? 'Geolocation unavailable — search for where you want to quote.'
            : null

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="heatmap-location-search" className="block text-xs font-medium text-slate-600">
            Quote location (search to change region)
          </label>
          <div className="relative mt-1">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              id="heatmap-location-search"
              type="search"
              autoComplete="off"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listId}
              aria-autocomplete="list"
              placeholder="City, address, or landmark — e.g. Sandton, Cape Town, London"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
              onKeyDown={onKeyDown}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          {onUseMyLocation && (
            <button
              type="button"
              onClick={onUseMyLocation}
              disabled={geoStatus === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <SignalIcon className="h-4 w-4 text-cyan-600" aria-hidden />
              {geoStatus === 'loading' ? 'Locating…' : 'My location'}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || query.trim().length < 2}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 disabled:opacity-50"
          >
            <MapPinIcon className="h-4 w-4" aria-hidden />
            {isLoading ? 'Searching…' : 'Go to location'}
          </button>
        </div>
      </form>

      {geoHint && (
        <p className="mt-2 text-xs text-slate-600" role="status">
          {geoHint}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg sm:right-auto"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.lat}-${s.lng}-${i}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickResult(s)}
                className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm hover:bg-slate-50 ${
                  i === activeIndex ? 'bg-cyan-50' : ''
                }`}
              >
                <span className="font-medium text-slate-900">{s.shortLabel}</span>
                <span className="text-xs text-slate-500 line-clamp-2">{s.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-xs text-slate-500">
        The map focuses on your region for concentrated risk data. Allow location access on load, or search any area to quote there.
      </p>
    </div>
  )
}
