'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { HeatmapPoint, QuotableBusiness, RegionRiskDetail, RiskLevel } from '@/types/heatmap'

const SEARCH_SCOPES = [
  { value: 'full', label: 'Full cell — all segments & sizes' },
  { value: 'high_tsi', label: 'High TSI — top quartile accounts only' },
  { value: 'open_claims', label: 'Accounts with open claims' },
  { value: 'renewal_90', label: 'Renewals in the next 90 days' },
  { value: 'nat_cat', label: 'Nat-cat / catastrophe-sensitive exposures' },
] as const

function riskBadgeClass(risk: RiskLevel) {
  switch (risk) {
    case 'Critical':
      return 'bg-rose-100 text-rose-900 ring-rose-200'
    case 'High':
      return 'bg-orange-100 text-orange-900 ring-orange-200'
    case 'Medium':
      return 'bg-amber-100 text-amber-900 ring-amber-200'
    default:
      return 'bg-emerald-100 text-emerald-900 ring-emerald-200'
  }
}

function defaultDetails(region: HeatmapPoint): RegionRiskDetail {
  const intensityPct = Math.round(region.intensity * 100)
  const lob = region.details?.lineOfBusiness ?? 'Commercial property'
  const slug = region.label.replace(/\s+/g, '-').toLowerCase()
  return {
    municipality: region.details?.municipality ?? region.label,
    province: region.details?.province ?? 'Gauteng',
    summary: region.isSearchLocation
      ? region.details?.summary ??
        `User-selected location for quoting. Use Street View and the metrics below before binding facultative terms.`
      : `Aggregated ${intensityPct}% heat intensity for this cell under the current risk layer. Use Street View and the metrics below to sanity-check accumulation, nat-cat drivers, and local claims velocity before quoting.`,
    predominantPerils:
      region.risk === 'Critical' || region.risk === 'High'
        ? ['Fire & allied perils', 'Business interruption', 'Theft & malicious damage']
        : ['Fire', 'Weather-related damage', 'Liability spillover'],
    indicativeExposure:
      region.risk === 'Critical'
        ? 'R 2.1B – R 3.4B (portfolio view)'
        : region.risk === 'High'
          ? 'R 900M – R 1.8B'
          : 'R 200M – R 900M',
    lossRatioBand:
      region.risk === 'Critical' ? '68% – 82%' : region.risk === 'High' ? '52% – 68%' : '38% – 52%',
    activePolicies: 120 + Math.round(region.intensity * 80),
    openClaims: 4 + Math.round(region.intensity * 24),
    premiumBenchmark:
      region.risk === 'Critical' ? '0.95% – 1.35% of TSI (indicative)' : '0.45% – 0.95% of TSI (indicative)',
    underwritingFocus: [
      'Validate occupancy, sums insured, and BI indemnity period vs. exposure band.',
      'Check nat-cat and reinsurance line limits for this corridor.',
      'Confirm loss history and large-loss drivers in the last 5 years.',
    ],
    reinsuranceAngle:
      'Consider facultative top-up or per-risk excess where concentration overlaps other peak zones in Gauteng.',
    lineOfBusiness: 'Commercial property (non-life facultative)',
    quotableBusinesses: [
      {
        id: `${slug}-all`,
        name: `Full ${region.label} cell (aggregated book)`,
        segment: 'Portfolio',
        property: 'Multiple properties — cell-wide programme',
        address: `Various insured locations · ${region.label}, Gauteng`,
        tsiBand: region.risk === 'Critical' ? 'R 1.8B – R 3.2B (cell aggregate)' : 'R 220M – R 900M (cell aggregate)',
        summary: `Whole-cell view across all insureds in ${region.label}; use for programme-level facultative or when named-risk splits are not yet allocated.`,
        policiesCount: 120 + Math.round(region.intensity * 80),
        openClaims: 4 + Math.round(region.intensity * 24),
        lineOfBusiness: lob,
      },
      {
        id: `${slug}-1`,
        name: `Primary commercial placement — ${region.label}`,
        segment: lob,
        property: 'Multi-storey commercial tower (offices + ground-floor retail)',
        address: `142 Marshall St, ${region.label}, Gauteng 2001`,
        tsiBand: region.risk === 'Critical' ? 'R 180M – R 420M' : 'R 45M – R 160M',
        summary: 'Largest single-site concentration in the cell; prioritise sprinkler evidence, BI indemnity period, and nat-cat sub-limits.',
        policiesCount: 8 + Math.round(region.intensity * 6),
        openClaims: region.risk === 'Critical' ? 4 : 2,
        lineOfBusiness: lob,
      },
      {
        id: `${slug}-2`,
        name: `Secondary account — ${region.label}`,
        segment: lob,
        property: 'Light industrial / logistics warehouse',
        address: `Unit 3B, R21 Business Park, cnr N1 link & Atlas Rd · ${region.label}`,
        tsiBand: 'R 28M – R 95M',
        summary: 'Mid-tier commercial account; useful for line-size tests and layering under primary cell quote.',
        policiesCount: 5 + Math.round(region.intensity * 4),
        openClaims: 1,
        lineOfBusiness: lob,
      },
      {
        id: `${slug}-3`,
        name: `SMME / satellite risk — ${region.label}`,
        segment: 'SMME',
        property: 'Mixed-use retail strip (shops + upper offices)',
        address: `Shop 7–12, The Grove Walk, 88 Main Rd · ${region.label}`,
        tsiBand: 'R 4M – R 22M',
        summary: 'Smaller commercial / SMME cluster; check liability drivers and tenant mix where retail is blended.',
        policiesCount: 22 + Math.round(region.intensity * 18),
        openClaims: 2,
        lineOfBusiness: 'SMME commercial',
      },
    ],
  }
}

function mergedRegionDetail(region: HeatmapPoint): RegionRiskDetail {
  const fullDefault = defaultDetails(region)
  return {
    ...fullDefault,
    ...region.details,
    quotableBusinesses:
      region.details?.quotableBusinesses && region.details.quotableBusinesses.length > 0
        ? region.details.quotableBusinesses
        : fullDefault.quotableBusinesses,
  }
}

function defaultPropertyForBusiness(b: QuotableBusiness, region: HeatmapPoint): string {
  const seg = (b.segment ?? '').toLowerCase()
  if (b.segment === 'Portfolio' || b.id.endsWith('-all')) return 'Multiple properties — programme / cell view'
  if (/smme/.test(seg)) return 'SMME commercial premises'
  if (/retail/.test(seg)) return 'Retail / shopping premises'
  if (/office|mixed/.test(seg)) return 'Office / mixed-use building'
  if (/industrial|logistics/.test(seg)) return 'Industrial / warehouse facility'
  return `${b.lineOfBusiness ?? 'Commercial'} insured premises`
}

function defaultAddressForBusiness(b: QuotableBusiness, region: HeatmapPoint, cell: RegionRiskDetail): string {
  if (b.segment === 'Portfolio' || b.id.endsWith('-all')) {
    return `Various sites · ${cell.municipality}, ${cell.province}`
  }
  return `Insured location · ${region.label}, ${cell.province}`
}

function enrichQuotableBusiness(b: QuotableBusiness, region: HeatmapPoint, cell: RegionRiskDetail): QuotableBusiness {
  const lob = b.lineOfBusiness ?? cell.lineOfBusiness ?? b.segment ?? 'Commercial property'
  const isPortfolio = b.segment === 'Portfolio' || b.id.endsWith('-all')
  return {
    ...b,
    property: b.property ?? defaultPropertyForBusiness(b, region),
    address: b.address ?? defaultAddressForBusiness(b, region, cell),
    location: b.location ?? `${cell.municipality} · ${region.label} heat cell`,
    tsiBand:
      b.tsiBand ??
      (isPortfolio
        ? cell.indicativeExposure
        : region.risk === 'Critical'
          ? 'R 85M – R 340M'
          : region.risk === 'High'
            ? 'R 35M – R 160M'
            : 'R 8M – R 72M'),
    summary:
      b.summary ??
      (isPortfolio
        ? `Aggregated book across insureds in ${region.label}; use for programme-level or cell-wide facultative.`
        : `Named-risk slice under ${lob}; align valuations and peril drivers with regional heat before quoting.`),
    policiesCount: b.policiesCount ?? (isPortfolio ? cell.activePolicies : Math.max(3, Math.round(cell.activePolicies * 0.09))),
    openClaims: b.openClaims ?? (isPortfolio ? cell.openClaims : Math.max(0, Math.round(cell.openClaims * 0.11))),
    lineOfBusiness: lob,
  }
}

function buildQuoteQuery(
  region: HeatmapPoint,
  business: QuotableBusiness,
  searchScope: string,
  riskLayer: string | undefined,
  timeRange: string | undefined,
  quoteProduct: 'non-proportional' | 'proportional' | 'auto-fac' | 'my-quote'
) {
  const q = new URLSearchParams({
    region: region.label,
    risk: region.risk,
    searchScope,
    businessId: business.id,
    businessName: business.name,
    quoteProduct,
    source: 'heatmap',
  })
  if (riskLayer) q.set('riskLayer', riskLayer)
  if (timeRange) q.set('timeRange', timeRange)
  if (business.segment) q.set('segment', business.segment)
  const lob = business.lineOfBusiness ?? ''
  if (lob) q.set('lineOfBusiness', lob)
  if (business.property) q.set('property', business.property)
  if (business.address) q.set('address', business.address)
  return q.toString()
}

function segmentPillClass(segment?: string) {
  if (!segment) return 'bg-slate-100 text-slate-700 ring-slate-200/90'
  if (segment === 'Portfolio') return 'bg-violet-50 text-violet-900 ring-violet-200/90'
  if (/retail/i.test(segment)) return 'bg-amber-50 text-amber-950 ring-amber-200/80'
  if (/office|mixed/i.test(segment)) return 'bg-sky-50 text-sky-950 ring-sky-200/80'
  if (/industrial|logistics/i.test(segment)) return 'bg-orange-50 text-orange-950 ring-orange-200/80'
  if (/SMME|smme/i.test(segment)) return 'bg-emerald-50 text-emerald-950 ring-emerald-200/80'
  return 'bg-slate-100 text-slate-800 ring-slate-200/90'
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m4.5-18v18m4.5-18v18m4.5-18v18M9 8.25h.008v.008H9V8.25Zm0 3h.008v.008H9V11.25Zm0 3h.008v.008H9V14.25Zm4.5-6h.008v.008h-.008V8.25Zm0 3h.008v.008h-.008V11.25Zm0 3h.008v.008h-.008V14.25Zm4.5-6h.008v.008h-.008V8.25Zm0 3h.008v.008h-.008V11.25Zm0 3h.008v.008h-.008V14.25Z"
      />
    </svg>
  )
}

function ChevronIcon({ className, open }: { className?: string; open: boolean }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function BusinessQuoteRow({
  business,
  enriched,
  region,
  searchScope,
  riskLayer,
  timeRange,
  isSelected,
  onToggleSelect,
}: {
  business: QuotableBusiness
  enriched: QuotableBusiness
  region: HeatmapPoint
  searchScope: string
  riskLayer?: string
  timeRange?: string
  isSelected: boolean
  onToggleSelect: () => void
}) {
  const qNp = buildQuoteQuery(region, enriched, searchScope, riskLayer, timeRange, 'non-proportional')
  const qP = buildQuoteQuery(region, enriched, searchScope, riskLayer, timeRange, 'proportional')
  const qAf = buildQuoteQuery(region, enriched, searchScope, riskLayer, timeRange, 'auto-fac')
  const qMq = buildQuoteQuery(region, enriched, searchScope, riskLayer, timeRange, 'my-quote')

  const quoteBtn =
    'inline-flex min-h-[2.25rem] flex-1 items-center justify-center rounded-xl px-3 py-2 text-center text-xs font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-1 sm:flex-none sm:min-w-[5.5rem]'

  return (
    <li
      className={`group relative overflow-hidden rounded-lg border bg-white transition-colors duration-200 ${
        isSelected
          ? 'border-cyan-300/80 shadow-sm shadow-cyan-950/[0.04]'
          : 'border-slate-100 hover:border-slate-200/90 hover:bg-slate-50/50'
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-[3px] transition-colors ${isSelected ? 'bg-cyan-500' : 'bg-slate-200/80 group-hover:bg-slate-300'}`}
        aria-hidden
      />
      <div className="relative pl-3 sm:pl-4">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-5 sm:p-5">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={onToggleSelect}
              className="group/row flex w-full gap-3 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2"
              aria-expanded={isSelected}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200/80">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <span className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-[15px] font-semibold leading-snug tracking-tight text-slate-900 group-hover/row:text-slate-950">
                    {business.name}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200/80">
                    <ChevronIcon className="h-3.5 w-3.5 text-slate-400" open={isSelected} />
                    {isSelected ? 'Less' : 'Detail'}
                  </span>
                </span>
                {business.segment ? (
                  <span
                    className={`mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${segmentPillClass(business.segment)}`}
                  >
                    {business.segment}
                  </span>
                ) : null}
                <dl className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium text-slate-500">Property</dt>
                    <dd className="min-w-0 leading-snug text-slate-700">{enriched.property}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium text-slate-500">Address</dt>
                    <dd className="min-w-0 leading-snug text-slate-700">{enriched.address}</dd>
                  </div>
                </dl>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{enriched.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200/70">
                    <span className="text-slate-400">TSI</span>
                    {enriched.tsiBand}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200/70">
                    <span className="text-slate-400">Policies</span>
                    {enriched.policiesCount ?? '—'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200/70">
                    <span className="text-slate-400">Claims</span>
                    {enriched.openClaims ?? '—'}
                  </span>
                </div>
              </span>
            </button>
          </div>

          <div className="flex shrink-0 flex-col justify-center border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <p className="mb-2 hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">Quote</p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              <Link
                href={`/non-life/broker/facultative/non-proportional?${qNp}`}
                title="Non-proportional facultative"
                className={`${quoteBtn} bg-blue-600 text-white hover:bg-blue-700`}
              >
                Non-prop
              </Link>
              <Link
                href={`/non-life/broker/facultative/proportional?${qP}`}
                title="Proportional facultative"
                className={`${quoteBtn} border border-slate-200 bg-white text-slate-800 hover:bg-slate-50`}
              >
                Prop
              </Link>
              <Link
                href={`/non-life/broker/facultative/auto-fac?${qAf}`}
                title="Automatic facultative"
                className={`${quoteBtn} bg-slate-800 text-white hover:bg-slate-900`}
              >
                Auto-fac
              </Link>
              <Link
                href={`/my-quote?${qMq}`}
                title="My Quote workspace"
                className={`${quoteBtn} bg-gradient-to-b from-blue-50 to-white text-blue-900 ring-1 ring-blue-200/90 hover:from-blue-100`}
              >
                My Quote
              </Link>
            </div>
          </div>
        </div>

        {isSelected ? (
          <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/90 to-white px-4 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Placement intelligence</p>
            <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50/80 p-3">
                <dt className="text-xs font-medium text-slate-500">Location</dt>
                <dd className="mt-1 font-medium leading-snug text-slate-900">{enriched.location}</dd>
              </div>
              <div className="rounded-lg bg-slate-50/80 p-3">
                <dt className="text-xs font-medium text-slate-500">Indicative TSI band</dt>
                <dd className="mt-1 font-semibold tabular-nums text-slate-900">{enriched.tsiBand}</dd>
              </div>
              <div className="rounded-lg bg-slate-50/80 p-3">
                <dt className="text-xs font-medium text-slate-500">Line of business</dt>
                <dd className="mt-1 font-medium text-slate-900">{enriched.lineOfBusiness}</dd>
              </div>
              <div className="rounded-lg bg-slate-50/80 p-3 sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Placement note</dt>
                <dd className="mt-1 leading-relaxed text-slate-700">{enriched.summary}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    </li>
  )
}

const HeatmapRegionDetailPanel = forwardRef<
  HTMLDivElement,
  {
    region: HeatmapPoint | null
    intensityScale: number
    riskLayer?: string
    timeRange?: string
  }
>(function HeatmapRegionDetailPanel({ region, intensityScale, riskLayer, timeRange }, ref) {
  const [searchScope, setSearchScope] = useState<(typeof SEARCH_SCOPES)[number]['value']>('full')
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)

  const [quoteTargetOpen, setQuoteTargetOpen] = useState(true)

  const d = useMemo(() => (region ? mergedRegionDetail(region) : null), [region])
  const businesses: QuotableBusiness[] = d?.quotableBusinesses ?? []

  const enrichedById = useMemo(() => {
    if (!region || !d) return new Map<string, QuotableBusiness>()
    const m = new Map<string, QuotableBusiness>()
    for (const b of d.quotableBusinesses ?? []) {
      m.set(b.id, enrichQuotableBusiness(b, region, d))
    }
    return m
  }, [region, d])

  useEffect(() => {
    if (!region) return
    setSearchScope('full')
    setSelectedBusinessId(null)
    setQuoteTargetOpen(true)
  }, [region])

  if (!region || !d) {
    return (
      <div ref={ref} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
        <p className="text-sm font-medium text-slate-700">Regional risk dossier</p>
        <p className="mt-2 text-sm text-slate-500">
          Search a location anywhere in the world, or click a coloured hotspot on the map, to open a region profile, Street View, and quoting shortcuts.
        </p>
      </div>
    )
  }

  const exposureHint = Math.round(3_000_000_000 * region.intensity * intensityScale * 0.5)
  const latLng = `${region.lat.toFixed(4)}°, ${region.lng.toFixed(4)}°`

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900">{region.label}</h2>
            {region.isSearchLocation ? (
              <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-900 ring-1 ring-cyan-200">
                Searched location
              </span>
            ) : null}
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${riskBadgeClass(region.risk)}`}>
              {region.risk} risk
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {d.municipality} · {d.province}
            {d.lineOfBusiness ? ` · ${d.lineOfBusiness}` : ''}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Selected cell · {latLng}
            {riskLayer && timeRange ? ` · ${riskLayer} · ${timeRange}` : ''}
          </p>
          <p className="mt-2 max-w-2xl text-xs text-slate-500">
            Open <span className="font-medium text-slate-700">Refine search & quote target</span> to pick search scope, review each insured, and jump straight into proportional, non-proportional, auto-fac, or My Quote for that business.
          </p>
        </div>
      </div>

      <div className="p-6">
        <details
          className="group rounded-xl border border-slate-100 bg-white open:shadow-sm"
          open={quoteTargetOpen}
          onToggle={(e) => setQuoteTargetOpen(e.currentTarget.open)}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
            <span>Refine search & quote target</span>
            <span
              className={`text-slate-400 transition ${quoteTargetOpen ? 'rotate-180' : ''}`}
              aria-hidden
            >
              ▼
            </span>
          </summary>
          <div className="space-y-4 border-t border-slate-100 px-4 pb-4 pt-3">
            <p className="text-xs text-slate-500">
              Narrow how the cell is scoped, then review insureds below. Click a business for placement detail; use the quote buttons for the product you need.
            </p>
            <div>
              <label htmlFor="heatmap-search-scope" className="block text-xs font-medium text-slate-600">
                Fine-tune search scope
              </label>
              <select
                id="heatmap-search-scope"
                value={searchScope}
                onChange={(e) => setSearchScope(e.target.value as (typeof SEARCH_SCOPES)[number]['value'])}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                {SEARCH_SCOPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-800">
                    <BuildingIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold tracking-tight text-slate-900">Insureds & clusters</h4>
                    <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600">
                      Scoped to{' '}
                      <span className="font-semibold text-cyan-950/90">
                        {SEARCH_SCOPES.find((s) => s.value === searchScope)?.label}
                      </span>
                      . Tap <span className="font-medium text-slate-800">Detail</span> for placement intelligence; quote actions stay on every row.
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center self-start rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 sm:self-center">
                  {businesses.length} in cell
                </span>
              </div>
              <ul className="space-y-2 border-t border-slate-100 pt-3" role="list">
                {businesses.map((b) => (
                  <BusinessQuoteRow
                    key={b.id}
                    business={b}
                    enriched={enrichedById.get(b.id) ?? b}
                    region={region}
                    searchScope={searchScope}
                    riskLayer={riskLayer}
                    timeRange={timeRange}
                    isSelected={selectedBusinessId === b.id}
                    onToggleSelect={() => setSelectedBusinessId((cur) => (cur === b.id ? null : b.id))}
                  />
                ))}
              </ul>
            </div>
          </div>
        </details>

        <p className="mt-6 text-sm leading-relaxed text-slate-700">{d.summary}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Heat intensity" value={`${Math.round(region.intensity * 100)}%`} hint="Current layer & filters" />
          <Metric label="Indicative exposure" value={d.indicativeExposure} hint="Book view" />
          <Metric label="Modeled exposure (cell)" value={formatRand(exposureHint)} hint="Scaled by intensity control" />
          <Metric label="Loss ratio band" value={d.lossRatioBand} hint="Rolling window" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">Predominant perils</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {d.predominantPerils.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-slate-900">Activity</h3>
            <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Active policies</dt>
                <dd className="font-semibold text-slate-900">{d.activePolicies}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Open claims</dt>
                <dd className="font-semibold text-slate-900">{d.openClaims}</dd>
              </div>
              <div className="col-span-2 rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Premium benchmark</dt>
                <dd className="font-semibold text-slate-900">{d.premiumBenchmark}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Underwriting focus</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {d.underwritingFocus.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <h3 className="text-sm font-semibold text-blue-950">Reinsurance angle</h3>
          <p className="mt-1 text-sm text-blue-950/90">{d.reinsuranceAngle}</p>
        </div>
      </div>
    </div>
  )
})

HeatmapRegionDetailPanel.displayName = 'HeatmapRegionDetailPanel'

export default HeatmapRegionDetailPanel

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/90 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>
    </div>
  )
}

function formatRand(n: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
}
