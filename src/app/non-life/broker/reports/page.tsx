'use client'

import { useState } from 'react'
import { 
  ChartBarIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const reports = [
  {
    id: 1,
    name: 'Portfolio Performance',
    description: 'Overview of treaty and facultative portfolio performance',
    icon: ChartBarIcon,
    href: '/non-life/broker/reports/portfolio',
    stats: {
      totalPremium: 'R4.3B',
      growth: '+12%',
      isPositive: true
    }
  },
  {
    id: 2,
    name: 'Claims Analysis',
    description: 'Detailed analysis of claims and loss ratios',
    icon: DocumentChartBarIcon,
    href: '/non-life/broker/reports/claims',
    stats: {
      totalClaims: 'R850M',
      growth: '-5%',
      isPositive: true
    }
  },
  {
    id: 3,
    name: 'Premium Distribution',
    description: 'Distribution of premiums across different lines of business',
    icon: CurrencyDollarIcon,
    href: '/non-life/broker/reports/premium',
    stats: {
      totalLines: 8,
      growth: '+3%',
      isPositive: true
    }
  },
  {
    id: 4,
    name: 'Client Analysis',
    description: 'Analysis of client portfolio and relationships',
    icon: UserGroupIcon,
    href: '/non-life/broker/reports/clients',
    stats: {
      totalClients: 45,
      growth: '+8%',
      isPositive: true
    }
  }
]

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
              <p className="mt-2 text-sm text-gray-700">
                Access detailed reports and analytics for your reinsurance portfolio
              </p>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={report.href}
                className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <report.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
                <dl className="mt-6 grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {report.name === 'Portfolio Performance' ? 'Total Premium' :
                       report.name === 'Claims Analysis' ? 'Total Claims' :
                       report.name === 'Premium Distribution' ? 'Business Lines' :
                       'Total Clients'}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {report.stats.totalPremium || report.stats.totalClaims || report.stats.totalLines || report.stats.totalClients}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Growth</dt>
                    <dd className="mt-1 flex items-center text-sm">
                      {report.stats.isPositive ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      )}
                      <span className={`ml-1 ${report.stats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {report.stats.growth}
                      </span>
                    </dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 