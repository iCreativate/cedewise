'use client'

import { useState } from 'react'
import { 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const treaties = [
  {
    id: 1,
    name: 'Property Treaty 2024',
    client: 'ABC Insurance',
    type: 'Property',
    status: 'Active',
    premium: 'R500M',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    growth: '+12%',
    isPositive: true
  },
  {
    id: 2,
    name: 'Motor Treaty 2024',
    client: 'XYZ Insurance',
    type: 'Motor',
    status: 'Pending',
    premium: 'R300M',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    growth: '+8%',
    isPositive: true
  },
  {
    id: 3,
    name: 'Marine Treaty 2024',
    client: 'DEF Insurance',
    type: 'Marine',
    status: 'Expired',
    premium: 'R200M',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    growth: '-5%',
    isPositive: false
  }
]

export default function TreatyPage() {
  const router = useRouter()
  
  const handleViewTreaty = (treatyId: number) => {
    router.push(`/non-life/broker/treaty/${treatyId}`)
  }
  
  const handleEditTreaty = (treatyId: number) => {
    router.push(`/non-life/broker/treaty/${treatyId}/edit`)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Treaty Reinsurance</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your treaty reinsurance agreements
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                onClick={() => router.push('/non-life/broker/treaty/new')}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Create New Treaty
              </button>
            </div>
          </div>

          {/* Treaty List */}
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Treaty Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Client
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Premium
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Period
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Growth
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {treaties.map((treaty) => (
                        <tr 
                          key={treaty.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleViewTreaty(treaty.id)}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {treaty.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {treaty.client}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {treaty.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              treaty.status === 'Active' ? 'bg-green-100 text-green-800' :
                              treaty.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {treaty.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {treaty.premium}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {treaty.startDate} - {treaty.endDate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center ${
                              treaty.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {treaty.isPositive ? (
                                <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <ArrowTrendingDownIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                              <span className="ml-1">{treaty.growth}</span>
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTreaty(treaty.id);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                              >
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTreaty(treaty.id);
                                }}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 