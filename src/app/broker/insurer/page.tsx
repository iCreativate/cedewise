'use client'

import { useState } from 'react'
import { 
  BuildingOfficeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import CurrencySelector from '@/components/CurrencySelector'
import RoleGuard from '@/components/RoleGuard'

const insurers = [
  {
    id: 1,
    name: 'Global Insurance Co.',
    type: 'Primary',
    status: 'Active',
    policies: 125,
    premium: '$5,500,000',
    contact: 'Robert Wilson',
    email: 'robert.wilson@globalinsurance.com',
  },
  {
    id: 2,
    name: 'Pacific Reinsurance',
    type: 'Reinsurance',
    status: 'Active',
    policies: 87,
    premium: '$3,200,000',
    contact: 'Sarah Chen',
    email: 'sarah.chen@pacificre.com',
  },
  {
    id: 3,
    name: 'Atlantic Risk Solutions',
    type: 'Primary',
    status: 'Active',
    policies: 64,
    premium: '$2,800,000',
    contact: 'Michael Rodriguez',
    email: 'm.rodriguez@atlanticrisk.com',
  },
  {
    id: 4,
    name: 'Northern Underwriters',
    type: 'Primary',
    status: 'Inactive',
    policies: 32,
    premium: '$1,500,000',
    contact: 'Jennifer Lee',
    email: 'j.lee@northernunderwriters.com',
  },
  {
    id: 5,
    name: 'Southern Re',
    type: 'Reinsurance',
    status: 'Active',
    policies: 98,
    premium: '$4,200,000',
    contact: 'David Thompson',
    email: 'd.thompson@southernre.com',
  },
]

const filters = {
  status: ['All', 'Active', 'Inactive'],
  type: ['All', 'Primary', 'Reinsurance'],
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function InsurerListContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const filteredInsurers = insurers
    .filter(insurer => {
      const matchesSearch = insurer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insurer.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insurer.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'All' || insurer.status === selectedStatus
      const matchesType = selectedType === 'All' || insurer.type === selectedType
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'desc' 
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      }
      if (sortBy === 'premium') {
        const premiumA = parseFloat(a.premium.replace(/[$,]/g, ''))
        const premiumB = parseFloat(b.premium.replace(/[$,]/g, ''))
        return sortOrder === 'desc' ? premiumB - premiumA : premiumA - premiumB
      }
      if (sortBy === 'policies') {
        return sortOrder === 'desc' ? b.policies - a.policies : a.policies - b.policies
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">Broker's Insurer List</h1>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector />
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Add Insurer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Search insurers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                className="mt-2 md:mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {filters.status.map((status) => (
                  <option key={status} value={status}>
                    Status: {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                className="mt-2 md:mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {filters.type.map((type) => (
                  <option key={type} value={type}>
                    Type: {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                className="mt-2 md:mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-')
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="premium-desc">Highest Premium</option>
                <option value="premium-asc">Lowest Premium</option>
                <option value="policies-desc">Most Policies</option>
                <option value="policies-asc">Least Policies</option>
              </select>
            </div>
          </div>
        </div>

        {/* Insurers List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredInsurers.map((insurer) => (
              <li key={insurer.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserGroupIcon className="h-10 w-10 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">{insurer.name}</h2>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="mr-2">{insurer.type}</span>
                          <span className={classNames(
                            insurer.status === 'Active' ? 'text-green-600' : 'text-red-600',
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                          )}>
                            {insurer.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <DocumentTextIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        {insurer.policies} Policies
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0">
                        <CurrencySelector />
                        {insurer.premium} Premium
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Contact: {insurer.contact} ({insurer.email})
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function ProtectedInsurerList() {
  return (
    <RoleGuard allowedRoles={['broker']}>
      <InsurerListContent />
    </RoleGuard>
  )
} 