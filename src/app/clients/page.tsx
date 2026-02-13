'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

interface Client {
  id: string;
  name: string;
  type: 'Insurer' | 'Reinsurer' | 'Broker' | 'Direct';
  location: string;
  contactPerson: string;
  email: string;
  policies: number;
  lastInteraction: string;
}

// Sample data
const clients: Client[] = [
  {
    id: '1',
    name: 'Global Insurance Ltd',
    type: 'Insurer',
    location: 'London, UK',
    contactPerson: 'Jane Smith',
    email: 'jane.smith@globalinsurance.com',
    policies: 12,
    lastInteraction: '2023-11-15'
  },
  {
    id: '2',
    name: 'Continental Reinsurance',
    type: 'Reinsurer',
    location: 'Zurich, Switzerland',
    contactPerson: 'Mark Johnson',
    email: 'm.johnson@continental-re.com',
    policies: 8,
    lastInteraction: '2023-11-10'
  },
  {
    id: '3',
    name: 'Atlantic Brokers',
    type: 'Broker',
    location: 'New York, USA',
    contactPerson: 'Sarah Williams',
    email: 'swilliams@atlanticbrokers.com',
    policies: 24,
    lastInteraction: '2023-11-01'
  },
  {
    id: '4',
    name: 'Pacific Marine Co',
    type: 'Direct',
    location: 'Singapore',
    contactPerson: 'David Chen',
    email: 'dchen@pacificmarine.com',
    policies: 5,
    lastInteraction: '2023-10-28'
  },
  {
    id: '5',
    name: 'European Risk Partners',
    type: 'Broker',
    location: 'Paris, France',
    contactPerson: 'Sophie Dubois',
    email: 's.dubois@erp-group.eu',
    policies: 17,
    lastInteraction: '2023-11-12'
  },
]

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: 'ascending' | 'descending';
  } | null>(null)

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle type filter
  const handleFilterChange = (type: string | null) => {
    setFilterType(type === filterType ? null : type)
  }

  // Handle sorting
  const handleSort = (key: keyof Client) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    
    setSortConfig({ key, direction })
  }

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          client.name.toLowerCase().includes(searchLower) ||
          client.contactPerson.toLowerCase().includes(searchLower) ||
          client.location.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
    .filter(client => {
      // Apply type filter
      if (filterType) {
        return client.type === filterType
      }
      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (!sortConfig) return 0
      
      const { key, direction } = sortConfig
      
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1
      }
      return 0
    })

  // Get sort indicator
  const getSortIndicator = (key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    
    return sortConfig.direction === 'ascending' 
      ? <ChevronUpIcon className="ml-1 h-4 w-4 inline" /> 
      : <ChevronDownIcon className="ml-1 h-4 w-4 inline" />
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all clients including their name, type, location, and contact information.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add client
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex gap-4 flex-col sm:flex-row">
        {/* Search input */}
        <div className="relative mt-2 rounded-md shadow-sm max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search clients"
          />
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          {(['Insurer', 'Reinsurer', 'Broker', 'Direct'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                filterType === type
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
          {filterType && (
            <button
              onClick={() => setFilterType(null)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <span className="group inline-flex items-center">
                        Client Name
                        {getSortIndicator('name')}
                      </span>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <span className="group inline-flex items-center">
                        Type
                        {getSortIndicator('type')}
                      </span>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('location')}
                    >
                      <span className="group inline-flex items-center">
                        Location
                        {getSortIndicator('location')}
                      </span>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Contact
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('policies')}
                    >
                      <span className="group inline-flex items-center">
                        Policies
                        {getSortIndicator('policies')}
                      </span>
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('lastInteraction')}
                    >
                      <span className="group inline-flex items-center">
                        Last Interaction
                        {getSortIndicator('lastInteraction')}
                      </span>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <Link href={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {client.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.location}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{client.contactPerson}</div>
                          <div className="text-xs text-gray-400">{client.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{client.policies}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(client.lastInteraction).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No clients found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 