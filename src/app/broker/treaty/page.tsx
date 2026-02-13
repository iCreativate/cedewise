'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

const stats = [
  { name: 'Active Treaties', value: '12', change: '+2', changeType: 'increase' },
  { name: 'Pending Approvals', value: '4', change: '-1', changeType: 'decrease' },
  { name: 'Total Premium', value: '$2.4M', change: '+12%', changeType: 'increase' },
  { name: 'Renewal Rate', value: '85%', change: '+5%', changeType: 'increase' },
]

const recentTreaties = [
  {
    id: 1,
    name: 'Property Catastrophe Treaty',
    client: 'Global Insurance Co.',
    type: 'Property',
    premium: '$1.2M',
    status: 'Active',
    renewalDate: '2024-12-31',
  },
  {
    id: 2,
    name: 'Marine Cargo Treaty',
    client: 'Oceanic Underwriters',
    type: 'Marine',
    premium: '$800K',
    status: 'Pending',
    renewalDate: '2024-09-30',
  },
  {
    id: 3,
    name: 'Aviation Liability Treaty',
    client: 'SkyGuard Insurance',
    type: 'Aviation',
    premium: '$1.5M',
    status: 'Active',
    renewalDate: '2025-03-31',
  },
]

const quickActions = [
  {
    name: 'New Treaty',
    description: 'Create a new treaty agreement',
    href: '/broker/treaty/new',
    icon: PlusIcon,
  },
  {
    name: 'Renew Treaty',
    description: 'Renew an existing treaty',
    href: '/broker/treaty/renew',
    icon: ArrowPathIcon,
  },
  {
    name: 'View Reports',
    description: 'Access treaty reports and analytics',
    href: '/broker/treaty/reports',
    icon: ChartBarIcon,
  },
  {
    name: 'Manage Clients',
    description: 'View and manage treaty clients',
    href: '/broker/treaty/clients',
    icon: UserGroupIcon,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TreatyPage() {
  const router = useRouter()
  const [selectedTreaty, setSelectedTreaty] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-semibold leading-7 text-gray-900">Treaty Reinsurance</h1>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Manage and monitor your treaty reinsurance agreements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {stat.value}
              </div>
              <div
                className={classNames(
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                )}
              >
                {stat.change}
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <div
            key={action.name}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <action.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <a href={action.href} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                <p className="truncate text-sm text-gray-500">{action.description}</p>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Treaties */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Recent Treaties</h2>
          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Treaty Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Client
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Premium
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Renewal Date
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTreaties.map((treaty) => (
                      <tr key={treaty.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {treaty.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {treaty.client}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {treaty.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {treaty.premium}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={classNames(
                              treaty.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800',
                              'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                            )}
                          >
                            {treaty.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {treaty.renewalDate}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => router.push(`/broker/treaty/${treaty.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View<span className="sr-only">, {treaty.name}</span>
                          </button>
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
  )
} 