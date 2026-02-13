'use client'

import { useState } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid'
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  ScaleIcon,
  ChartBarIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import TreatyModal from '@/components/TreatyModal'
import CurrencySelector, { formatAmount } from '@/components/CurrencySelector'
import { useCurrency } from '@/context/CurrencyContext'

// Helper function to convert string monetary values to numbers
function parseAmount(amountStr: string): number {
  return parseFloat(amountStr.replace(/[^0-9.-]+/g, ""))
}

const baseStats = [
  {
    name: 'Treaty Premium',
    value: 82500000, // Store raw numbers
    change: '+8.2%',
    changeType: 'positive',
    icon: BanknotesIcon,
  },
  {
    name: 'Claims Ratio',
    value: '64.8%',
    change: '-3.5%',
    changeType: 'positive',
    icon: ChartBarIcon,
  },
  {
    name: 'Capacity Utilization',
    value: '78.2%',
    change: '+5.4%',
    changeType: 'positive',
    icon: ScaleIcon,
  },
  {
    name: 'Active Treaties',
    value: '24',
    change: '+2',
    changeType: 'positive',
    icon: DocumentTextIcon,
  },
]

const baseTreaties = [
  {
    id: 1,
    name: 'Property Catastrophe XOL',
    cedant: 'Global Insurance Co.',
    renewal: 'Apr 1, 2024',
    premium: 28500000, // Store raw numbers
    status: 'Active',
    statusColor: 'bg-green-50 text-green-700 border border-green-200',
    type: 'Non-Proportional'
  },
  {
    id: 2,
    name: 'Marine Quota Share',
    cedant: 'Maritime Assurance Ltd.',
    renewal: 'Jul 1, 2024',
    premium: 15200000,
    status: 'Renewal Pending',
    statusColor: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    type: 'Proportional'
  },
  {
    id: 3,
    name: 'Liability Excess of Loss',
    cedant: 'Corporate Risk Solutions',
    renewal: 'Jan 1, 2025',
    premium: 22800000,
    status: 'Under Review',
    statusColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    type: 'Non-Proportional'
  },
]

const baseClaims = [
  {
    id: 1,
    treaty: 'Property Cat XOL',
    event: 'Hurricane Impact - Florida',
    date: '3 days ago',
    amount: 12500000,
    status: 'Under Assessment',
    progress: 35,
  },
  {
    id: 2,
    treaty: 'Marine QS',
    event: 'Cargo Vessel Collision',
    date: '1 week ago',
    amount: 8200000,
    status: 'Approved',
    progress: 100,
  },
  {
    id: 3,
    treaty: 'Liability XOL',
    event: 'Product Liability Claim',
    date: '2 weeks ago',
    amount: 5700000,
    status: 'In Progress',
    progress: 65,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Reinsurance() {
  const [selectedTreaty, setSelectedTreaty] = useState<typeof baseTreaties[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { selectedCurrency } = useCurrency()

  const handleTreatyClick = (treaty: typeof baseTreaties[0]) => {
    setSelectedTreaty(treaty)
    setIsModalOpen(true)
  }

  const handleSaveTreaty = (updatedTreaty: typeof baseTreaties[0]) => {
    setIsModalOpen(false)
    setSelectedTreaty(null)
  }

  // Format stats with current currency
  const stats = baseStats.map(stat => ({
    ...stat,
    displayValue: typeof stat.value === 'number' 
      ? formatAmount(stat.value, selectedCurrency)
      : stat.value
  }))

  // Format treaties with current currency
  const activeTreaties = baseTreaties.map(treaty => ({
    ...treaty,
    displayPremium: formatAmount(treaty.premium, selectedCurrency)
  }))

  // Format claims with current currency
  const recentClaims = baseClaims.map(claim => ({
    ...claim,
    displayAmount: formatAmount(claim.amount, selectedCurrency)
  }))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <BuildingOfficeIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-semibold text-gray-900">Reinsurance Operations</h1>
          </div>
          <CurrencySelector />
        </div>
        <p className="mt-2 text-sm text-gray-600">Comprehensive overview of treaty performance, claims, and capacity management.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/60 shadow-lg shadow-gray-200/80 hover:border-gray-300"
          >
            <dt className="flex items-center gap-x-3">
              <div className="rounded-lg bg-indigo-50 p-2 shadow-sm">
                <stat.icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              </div>
              <p className="truncate text-sm font-medium text-gray-600">{stat.name}</p>
            </dt>
            <dd className="mt-6">
              <p className="text-2xl font-semibold text-gray-900">{stat.displayValue}</p>
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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Treaties */}
        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/80 border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-900">Active Treaties</h3>
            <p className="mt-1 text-sm text-gray-500">Current treaty portfolio and renewal status.</p>
          </div>
          <div className="border-t border-gray-200/60">
            <ul role="list" className="divide-y divide-gray-200/60">
              {activeTreaties.map((treaty) => (
                <li 
                  key={treaty.id} 
                  className="px-6 py-4 transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTreatyClick(treaty)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-x-2">
                        <p className="truncate text-sm font-semibold text-indigo-600">{treaty.name}</p>
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {treaty.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-2 mt-1">
                        <p className="text-sm text-gray-500">{treaty.cedant}</p>
                        <span className="text-gray-300">·</span>
                        <p className="text-sm text-gray-500">Renewal: {treaty.renewal}</p>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col items-end gap-y-1">
                      <span className="text-sm font-semibold text-gray-900">{treaty.displayPremium}</span>
                      <span className={classNames('inline-flex rounded-full px-3 py-1 text-xs font-medium shadow-sm', treaty.statusColor)}>
                        {treaty.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/80 border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
            <p className="mt-1 text-sm text-gray-500">Latest treaty claims and their processing status.</p>
          </div>
          <div className="border-t border-gray-200/60">
            <ul role="list" className="divide-y divide-gray-200/60">
              {recentClaims.map((claim) => (
                <li key={claim.id} className="px-6 py-4 transition-colors duration-200 hover:bg-gray-50">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="truncate text-sm font-semibold text-indigo-600">{claim.event}</p>
                        <p className="flex text-sm text-gray-500">
                          <span>{claim.treaty}</span>
                          <span className="ml-1 flex-shrink-0 font-normal">· {claim.date}</span>
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{claim.displayAmount}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className={classNames(
                              'h-2 rounded-full',
                              claim.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                            )}
                            style={{ width: `${claim.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-900">{claim.status}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Treaty Modal */}
      {selectedTreaty && (
        <TreatyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTreaty(null)
          }}
          treaty={{
            ...selectedTreaty,
            premium: formatAmount(selectedTreaty.premium, selectedCurrency)
          }}
          onSave={handleSaveTreaty}
        />
      )}
    </div>
  )
} 