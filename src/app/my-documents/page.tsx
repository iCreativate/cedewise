'use client'

import Link from 'next/link'
import { DocumentTextIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const MOCK_DOCS = [
  {
    id: '1',
    name: 'Loss history — Marshalltown cluster.pdf',
    context: 'Facultative · Non-proportional',
    updated: '2 days ago',
    size: '1.2 MB',
  },
  {
    id: '2',
    name: 'Sprinkler inspection certificate.pdf',
    context: 'Johannesburg CBD · Primary placement',
    updated: '5 days ago',
    size: '840 KB',
  },
  {
    id: '3',
    name: 'BI indemnity schedule.xlsx',
    context: 'Sandton · Proportional',
    updated: '1 week ago',
    size: '320 KB',
  },
] as const

export default function MyDocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
            <DocumentTextIcon className="h-8 w-8" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Documents</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Files you and your counterparties attach to placements and submissions will appear here. This view uses
              sample rows until a documents API is wired up.
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent files</h2>
            <Link
              href="/submissions"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Open submissions
              <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-gray-100" role="list">
            {MOCK_DOCS.map((doc) => (
              <li key={doc.id} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.context}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs text-gray-500 sm:text-right">
                  <span>{doc.size}</span>
                  <span className="tabular-nums">{doc.updated}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 text-xs text-gray-500">
          To upload on a live quote, use the <span className="font-medium text-gray-700">Documents</span> tab on
          broker facultative flows (e.g.{' '}
          <Link href="/non-life/broker/facultative/proportional" className="text-indigo-600 hover:underline">
            proportional
          </Link>
          ).
        </p>
      </div>
    </div>
  )
}
