'use client'

import { useState } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid'
import { 
  BuildingOfficeIcon,
  FireIcon,
  TruckIcon,
  HomeIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid'

const stats = [
  {
    name: 'Gross Written Premium',
    value: '$45.2M',
    change: '+6.75%',
    changeType: 'positive',
    icon: BanknotesIcon,
  },
  {
    name: 'Combined Ratio',
    value: '92.5%',
    change: '-1.8%',
    changeType: 'positive',
    icon: ChartBarIcon,
  },
  {
    name: 'Active Policies',
    value: '3,842',
    change: '+4.2%',
    changeType: 'positive',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Loss Ratio',
    value: '58.3%',
    change: '-2.4%',
    changeType: 'positive',
    icon: ShieldCheckIcon,
  },
]

// Add new cards for Treaty and Facultative
const businessTypes = [
  {
    id: 1,
    name: 'Treaty',
    description: 'Manage treaty reinsurance placements and renewals',
    icon: DocumentTextIcon,
    href: '/non-life/broker/treaty',
    metrics: [
      { label: 'Active Treaties', value: '125' },
      { label: 'Annual Premium', value: '$28.6M' }
    ]
  },
  {
    id: 2,
    name: 'Facultative',
    description: 'Place individual risks with selected reinsurers',
    icon: ShieldCheckIcon,
    href: '/non-life/broker/facultative',
    metrics: [
      { label: 'Active Cases', value: '342' },
      { label: 'Annual Premium', value: '$16.6M' }
    ]
  },
]

const recentRisks = [
  {
    id: 1,
    type: 'Property',
    name: 'Commercial Building Complex - NYC',
    date: '2 hours ago',
    status: 'Under Review',
    statusColor: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    value: '$25M'
  },
  {
    id: 2,
    type: 'Marine Cargo',
    name: 'Container Fleet - Pacific Route',
    date: '1 day ago',
    status: 'Bound',
    statusColor: 'bg-green-50 text-green-700 border border-green-200',
    value: '$12M'
  },
  {
    id: 3,
    type: 'Engineering',
    name: 'Power Plant Construction',
    date: '2 days ago',
    status: 'Pending Documents',
    statusColor: 'bg-green-50 text-green-700 border border-green-200',
    value: '$45M'
  },
]

const portfolioMix = [
  {
    id: 1,
    name: 'Property',
    premium: '$18.5M',
    risks: '856',
    growth: '+5.2%',
    icon: BuildingOfficeIcon,
  },
  {
    id: 2,
    name: 'Marine & Aviation',
    premium: '$12.3M',
    risks: '234',
    growth: '+3.8%',
    icon: TruckIcon,
  },
  {
    id: 3,
    name: 'Casualty',
    premium: '$8.9M',
    risks: '1,245',
    growth: '+4.1%',
    icon: ShieldCheckIcon,
  },
  {
    id: 4,
    name: 'Engineering',
    premium: '$5.5M',
    risks: '167',
    growth: '+7.2%',
    icon: HomeIcon,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function NonLife() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-x-3">
          <FireIcon className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Non-Life Insurance Overview</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">Comprehensive view of non-life insurance portfolio performance and risk exposure.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/60 shadow-lg shadow-gray-200/80 hover:border-gray-300"
          >
            <dt className="flex items-center gap-x-3">
              <div className="rounded-lg bg-green-50 p-2 shadow-sm">
                <stat.icon className="h-5 w-5 text-green-600" aria-hidden="true" />
              </div>
              <p className="truncate text-sm font-medium text-gray-600">{stat.name}</p>
            </dt>
            <dd className="mt-6">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={classNames(
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600',
                  'flex items-baseline text-sm font-medium mt-2'
                )}
              >
                {stat.changeType === 'positive' ? (
                  <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center mr-1" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center mr-1" aria-hidden="true" />
                )}
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Treaty and Facultative Cards Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reinsurance Business Types</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {businessTypes.map((type) => (
            <a
              key={type.id}
              href={type.href}
              className="relative overflow-hidden rounded-xl bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/60 shadow-lg shadow-gray-200/80 hover:border-gray-300 flex flex-col h-full"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-50 p-3 shadow-sm">
                  <type.icon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{type.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                {type.metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-sm text-right text-green-600 font-medium">
                View {type.name} →
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Risks */}
        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/80 border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-900">Recent Risks</h3>
            <p className="mt-1 text-sm text-gray-500">Latest risk submissions and their current status.</p>
          </div>
          <div className="border-t border-gray-200/60">
            <ul role="list" className="divide-y divide-gray-200/60">
              {recentRisks.map((risk) => (
                <li key={risk.id} className="px-6 py-4 transition-colors duration-200 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="truncate text-sm font-semibold text-green-600">{risk.name}</p>
                      <p className="flex text-sm text-gray-500">
                        <span>{risk.type}</span>
                        <span className="ml-1 flex-shrink-0 font-normal">· {risk.date}</span>
                      </p>
                    </div>
                    <div className="ml-2 flex flex-col items-end gap-y-1">
                      <span className="text-sm font-semibold text-gray-900">{risk.value}</span>
                      <span className={classNames('inline-flex rounded-full px-3 py-1 text-xs font-medium shadow-sm', risk.statusColor)}>
                        {risk.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Portfolio Mix */}
        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/80 border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Mix</h3>
            <p className="mt-1 text-sm text-gray-500">Distribution of non-life insurance lines and their performance.</p>
          </div>
          <div className="border-t border-gray-200/60">
            <ul role="list" className="divide-y divide-gray-200/60">
              {portfolioMix.map((line) => (
                <li key={line.id} className="px-6 py-4 transition-colors duration-200 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-lg bg-green-50 p-2 mr-3">
                        <line.icon className="h-5 w-5 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900">{line.name}</p>
                        <p className="flex text-sm text-gray-500">
                          {line.risks} risks
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-900">{line.premium}</span>
                      <span className="text-xs text-green-600">{line.growth}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 