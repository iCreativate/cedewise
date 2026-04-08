'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FunnelIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

interface RiskRow {
  id: string
  title: string
  description: string
  status: string
  premium: number
  coverage: string
  submitter?: { name: string; email: string; company?: string }
  createdAt: string
  updatedAt: string
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  BOUND: 'Bound',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Risks() {
  const [risks, setRisks] = useState<RiskRow[]>([])
  const [loading, setLoading] = useState(true)
  const [bindingId, setBindingId] = useState<string | null>(null)

  const fetchRisks = () => {
    fetch('/api/risks')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RiskRow[]) => setRisks(Array.isArray(data) ? data : []))
      .catch(() => setRisks([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRisks()
  }, [])

  const handleBind = async (id: string) => {
    setBindingId(id)
    try {
      const res = await fetch(`/api/risks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'BOUND' }),
      })
      if (res.ok) fetchRisks()
    } finally {
      setBindingId(null)
    }
  }

  if (loading) {
    return (
      <div className="py-6 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="py-6">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Risks</h1>
            <Link
              href="/risks/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Risk
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <div className="flex items-center justify-between bg-white px-6 py-3">
                    <div className="flex-1 sm:hidden" />
                    <div className="flex flex-1 items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900"
                      >
                        <FunnelIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Risk Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Premium
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Submitted By
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {risks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                            No risks yet. Create one from the form or they will appear here once added via the API.
                          </td>
                        </tr>
                      ) : (
                        risks.map((risk) => (
                          <tr key={risk.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {risk.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{risk.coverage}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {typeof risk.premium === 'number' ? `$${risk.premium.toLocaleString()}` : risk.premium}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span
                                className={classNames(
                                  risk.status === 'BOUND'
                                    ? 'bg-green-50 text-green-700'
                                    : risk.status === 'UNDER_REVIEW'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-gray-50 text-gray-700',
                                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                                )}
                              >
                                {STATUS_LABEL[risk.status] ?? risk.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {risk.submitter?.name ?? risk.submitter?.company ?? '—'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(risk.createdAt).toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              {risk.status !== 'BOUND' && (
                                <button
                                  type="button"
                                  disabled={bindingId === risk.id}
                                  onClick={() => handleBind(risk.id)}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50 inline-flex items-center mr-3"
                                >
                                  {bindingId === risk.id ? (
                                    <span className="animate-pulse">Binding…</span>
                                  ) : (
                                    <>
                                      <CheckCircleIcon className="h-4 w-4 mr-1 inline" />
                                      Bind
                                    </>
                                  )}
                                </button>
                              )}
                              <Link href={`/risks/${risk.id}`} className="text-indigo-600 hover:text-indigo-900">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
