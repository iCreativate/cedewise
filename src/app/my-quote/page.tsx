'use client'

import { Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

function facHref(
  base: URLSearchParams,
  product: 'non-proportional' | 'proportional' | 'auto-fac'
): string {
  const q = new URLSearchParams(base)
  q.set('quoteProduct', product)
  const path =
    product === 'non-proportional'
      ? '/non-life/broker/facultative/non-proportional'
      : product === 'proportional'
        ? '/non-life/broker/facultative/proportional'
        : '/non-life/broker/facultative/auto-fac'
  return `${path}?${q.toString()}`
}

function MyQuoteContent() {
  const searchParams = useSearchParams()
  const q = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  const region = q.get('region')
  const risk = q.get('risk')
  const businessName = q.get('businessName')
  const lineOfBusiness = q.get('lineOfBusiness')
  const segment = q.get('segment')
  const property = q.get('property')
  const address = q.get('address')
  const source = q.get('source')
  const searchScope = q.get('searchScope')

  const hasContext = Boolean(region || businessName || source === 'heatmap')

  const meta = [
    { label: 'Region', value: region },
    { label: 'Risk band', value: risk },
    { label: 'Insured / risk', value: businessName },
    { label: 'Line of business', value: lineOfBusiness },
    { label: 'Segment', value: segment },
    { label: 'Property', value: property },
    { label: 'Address', value: address },
    { label: 'Search scope', value: searchScope },
  ].filter((x) => x.value)

  const quoteBtn =
    'inline-flex min-h-[2.25rem] items-center justify-center rounded-xl px-4 py-2 text-center text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-1'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
            <ClipboardDocumentListIcon className="h-8 w-8" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Quote</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Workspace for drafting and routing facultative quotes. When you arrive from the heatmap or another screen,
              context is carried in the URL so you can continue in the right product flow.
            </p>
          </div>
        </div>

        {hasContext ? (
          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Current context</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-6">
              <Link
                href={facHref(q, 'non-proportional')}
                className={`${quoteBtn} bg-blue-600 text-white hover:bg-blue-700`}
              >
                Open non-proportional
              </Link>
              <Link href={facHref(q, 'proportional')} className={`${quoteBtn} border border-gray-200 bg-white text-gray-800 hover:bg-gray-50`}>
                Open proportional
              </Link>
              <Link href={facHref(q, 'auto-fac')} className={`${quoteBtn} bg-gray-800 text-white hover:bg-gray-900`}>
                Open auto-fac
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white/80 p-8 text-center">
            <p className="text-sm text-gray-600">
              No quote context in the URL yet. Use the sidebar to open facultative flows, or start from the broker heatmap
              and choose <span className="font-medium text-gray-800">My Quote</span> on an insured row to land here with
              the cell and risk pre-filled.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                href={facHref(q, 'non-proportional')}
                className={`${quoteBtn} bg-blue-600 text-white hover:bg-blue-700`}
              >
                Non-proportional
              </Link>
              <Link href={facHref(q, 'proportional')} className={`${quoteBtn} border border-gray-200 bg-white text-gray-800 hover:bg-gray-50`}>
                Proportional
              </Link>
              <Link href={facHref(q, 'auto-fac')} className={`${quoteBtn} bg-gray-800 text-white hover:bg-gray-900`}>
                Auto-fac
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default function MyQuotePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-gray-50 text-sm text-gray-600">Loading…</div>
      }
    >
      <MyQuoteContent />
    </Suspense>
  )
}
