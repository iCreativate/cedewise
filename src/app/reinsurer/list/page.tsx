'use client'

import { useState } from 'react'
import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import CurrencySelector from '@/components/CurrencySelector'
import RoleGuard from '@/components/RoleGuard'

const reinsurers = [
  {
    id: 1,
    name: 'Global Reinsurance Co.',
    type: 'Professional',
    status: 'Active',
    treaties: 82,
    capacity: '$2,500,000,000',
    contact: 'James Anderson',
    email: 'j.anderson@globalreinsurance.com',
    region: 'Global',
    registered: true
  },
  {
    id: 2,
    name: 'European Re',
    type: 'Professional',
    status: 'Active',
    treaties: 64,
    capacity: '$1,800,000,000',
    contact: 'Sophie Laurent',
    email: 's.laurent@europeanre.com',
    region: 'Europe',
    registered: true
  },
  {
    id: 3,
    name: 'Asia Pacific Reinsurance',
    type: 'Professional',
    status: 'Active',
    treaties: 53,
    capacity: '$1,600,000,000',
    contact: 'Li Wei',
    email: 'l.wei@apacre.com',
    region: 'Asia-Pacific',
    registered: false
  },
  {
    id: 4,
    name: 'American Re Solutions',
    type: 'Professional',
    status: 'Inactive',
    treaties: 28,
    capacity: '$950,000,000',
    contact: 'Michael Brown',
    email: 'm.brown@americanre.com',
    region: 'Americas',
    registered: false
  },
  {
    id: 5,
    name: 'African Reinsurance Corp',
    type: 'Professional',
    status: 'Active',
    treaties: 42,
    capacity: '$800,000,000',
    contact: 'Samuel Okafor',
    email: 's.okafor@africanre.com',
    region: 'Africa',
    registered: true
  },
]

const filters = {
  status: ['All', 'Active', 'Inactive'],
  region: ['All', 'Global', 'Europe', 'Asia-Pacific', 'Americas', 'Africa']
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function ReinsurerListContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showUnregistered, setShowUnregistered] = useState(true)

  const filteredReinsurers = reinsurers
    .filter(reinsurer => {
      const matchesSearch = reinsurer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reinsurer.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reinsurer.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'All' || reinsurer.status === selectedStatus
      const matchesRegion = selectedRegion === 'All' || reinsurer.region === selectedRegion
      const matchesRegistration = showUnregistered || reinsurer.registered
      return matchesSearch && matchesStatus && matchesRegion && matchesRegistration
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'desc' 
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      }
      if (sortBy === 'capacity') {
        const capacityA = parseFloat(a.capacity.replace(/[$,]/g, ''))
        const capacityB = parseFloat(b.capacity.replace(/[$,]/g, ''))
        return sortOrder === 'desc' ? capacityB - capacityA : capacityA - capacityB
      }
      if (sortBy === 'treaties') {
        return sortOrder === 'desc' ? b.treaties - a.treaties : a.treaties - b.treaties
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
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">Reinsurers</h1>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector />
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Add Reinsurer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reinsurer Breakdown Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Reinsurer Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Regional Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Regional Distribution</h3>
              <div className="space-y-2">
                {Object.entries(reinsurers.reduce((acc, reinsurer) => {
                  acc[reinsurer.region] = (acc[reinsurer.region] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).map(([region, count]) => (
                  <div key={region} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        region === 'Global' ? 'bg-purple-500' :
                        region === 'Europe' ? 'bg-blue-500' :
                        region === 'Asia-Pacific' ? 'bg-green-500' :
                        region === 'Americas' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-600">{region}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden">
                {Object.entries(reinsurers.reduce((acc, reinsurer) => {
                  acc[reinsurer.region] = (acc[reinsurer.region] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).map(([region, count], index, array) => {
                  const percentage = (count / reinsurers.length) * 100;
                  const prevPercentages = array.slice(0, index).reduce((sum, [_, c]) => sum + (c / reinsurers.length) * 100, 0);
                  return (
                    <div 
                      key={region}
                      className={`h-full float-left ${
                        region === 'Global' ? 'bg-purple-500' :
                        region === 'Europe' ? 'bg-blue-500' :
                        region === 'Asia-Pacific' ? 'bg-green-500' :
                        region === 'Americas' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%`, marginLeft: index === 0 ? '0' : `${prevPercentages}%` }}
                    ></div>
                  );
                })}
              </div>
            </div>
            
            {/* Status Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <div className="space-y-2">
                {Object.entries(reinsurers.reduce((acc, reinsurer) => {
                  acc[reinsurer.status] = (acc[reinsurer.status] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">{status}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-24 items-end">
                {Object.entries(reinsurers.reduce((acc, reinsurer) => {
                  acc[reinsurer.status] = (acc[reinsurer.status] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).map(([status, count]) => {
                  const percentage = (count / reinsurers.length) * 100;
                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-12 ${status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Registered Reinsurers Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Registered Reinsurers</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Reinsurers</span>
                    <span className="text-lg font-semibold text-gray-900">{reinsurers.length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Registered</span>
                    <span className="text-lg font-semibold text-green-600">
                      {reinsurers.filter(r => r.registered).length} / {reinsurers.length}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Treaties</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {reinsurers.reduce((sum, reinsurer) => sum + reinsurer.treaties, 0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Top Reinsurer</span>
                    <span className="text-sm font-medium text-gray-900">
                      {reinsurers.sort((a, b) => b.treaties - a.treaties)[0]?.name}
                    </span>
                  </div>
                </div>
              </div>
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
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                placeholder="Search reinsurers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                className="mt-2 md:mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6"
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

            {/* Region Filter */}
            <div>
              <select
                className="mt-2 md:mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {filters.region.map((region) => (
                  <option key={region} value={region}>
                    Region: {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between">
              <select
                className="mt-2 md:mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6 mr-4"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-')
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="capacity-desc">Highest Capacity</option>
                <option value="capacity-asc">Lowest Capacity</option>
                <option value="treaties-desc">Most Treaties</option>
                <option value="treaties-asc">Least Treaties</option>
              </select>

              <div className="flex items-center">
                <input 
                  id="show-unregistered" 
                  type="checkbox" 
                  checked={showUnregistered}
                  onChange={() => setShowUnregistered(!showUnregistered)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                <label htmlFor="show-unregistered" className="ml-2 text-sm text-gray-700">
                  Show Unregistered
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Reinsurers List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredReinsurers.map((reinsurer) => (
              <li key={reinsurer.id}>
                <div 
                  className={classNames(
                    "px-4 py-4 sm:px-6",
                    reinsurer.registered ? "hover:bg-gray-50 cursor-pointer" : "opacity-60 cursor-not-allowed bg-gray-50" 
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className={classNames(
                          "h-10 w-10",
                          reinsurer.registered ? "text-green-500" : "text-gray-400"
                        )} />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          {reinsurer.name}
                          {!reinsurer.registered && (
                            <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                              Not Registered
                            </span>
                          )}
                        </h2>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="mr-2 flex items-center">
                            <GlobeAltIcon className="mr-1 h-4 w-4 text-gray-400" />
                            {reinsurer.region}
                          </span>
                          <span className={classNames(
                            reinsurer.status === 'Active' ? 'text-green-600' : 'text-red-600',
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                          )}>
                            {reinsurer.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {reinsurer.registered ? (
                      <button
                        type="button"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        View Details
                      </button>
                      ) : (
                        <button
                          type="button"
                          className="font-medium text-gray-400 cursor-not-allowed"
                          disabled
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <DocumentTextIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        {reinsurer.treaties} Treaties
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0">
                        <CurrencySelector />
                        {reinsurer.capacity} Capacity
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Contact: {reinsurer.contact} ({reinsurer.email})
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

export default function ProtectedReinsurerList() {
  return (
    <RoleGuard allowedRoles={['reinsurer']}>
      <ReinsurerListContent />
    </RoleGuard>
  )
} 