'use client'

import React, { useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PencilSquareIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// Sample data - replace with actual API call in production
const policies = [
  { id: 1, name: 'Commercial Property Insurance', client: 'ABC Corp', type: 'Property', expiryDate: '2024-12-31', premium: '$450,000', status: 'Active' },
  { id: 2, name: 'General Liability Coverage', client: 'XYZ Ltd', type: 'Liability', expiryDate: '2024-10-15', premium: '$320,000', status: 'Active' },
  { id: 3, name: 'Marine Cargo Insurance', client: 'Global Shipping', type: 'Marine', expiryDate: '2024-08-22', premium: '$580,000', status: 'Active' },
  { id: 4, name: 'Aviation Liability', client: 'Sky Airlines', type: 'Aviation', expiryDate: '2025-01-15', premium: '$1,200,000', status: 'Active' },
  { id: 5, name: 'Motor Fleet', client: 'Transport Co', type: 'Motor', expiryDate: '2024-12-15', premium: '$275,000', status: 'Active' },
  { id: 6, name: 'Engineering', client: 'BuildTech', type: 'Engineering', expiryDate: '2025-02-28', premium: '$890,000', status: 'Active' },
  { id: 7, name: 'Workers Compensation', client: 'Mega Industries', type: 'Liability', expiryDate: '2024-11-30', premium: '$520,000', status: 'Active' },
  { id: 8, name: 'Commercial Auto', client: 'Delivery Express', type: 'Motor', expiryDate: '2025-03-15', premium: '$310,000', status: 'Active' },
  { id: 9, name: 'Product Liability', client: 'Manufacturers Inc', type: 'Liability', expiryDate: '2024-09-22', premium: '$420,000', status: 'Active' },
  { id: 10, name: 'Property Package', client: 'Real Estate Group', type: 'Property', expiryDate: '2024-10-05', premium: '$680,000', status: 'Active' },
]

type SortKey = 'name' | 'client' | 'type' | 'expiryDate' | 'premium'
type SortDirection = 'asc' | 'desc'

export default function SubmitRenewalPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('expiryDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  // Handle search
  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Handle sorting
  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    const aValue = a[sortKey]
    const bValue = b[sortKey]
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
  
  // Handle sort change
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }
  
  // Handle view policy details
  const handleViewPolicy = (policyId: number) => {
    router.push(`/non-life/policies/${policyId}`)
  }
  
  // Handle edit policy
  const handleEditPolicy = (policyId: number) => {
    router.push(`/non-life/policies/${policyId}/edit`)
  }
  
  // Handle submit renewal
  const handleRenewPolicy = (policyId: number) => {
    router.push(`/non-life/policies/${policyId}/renew`)
  }
  
  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Submit a Renewal</h1>
          <p className="mt-2 text-sm text-gray-500">Select a policy to renew from the list below.</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            id="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            placeholder="Search policies by name, client or type..."
          />
        </div>
      </div>
      
      {/* Policy List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  scope="col" 
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Policy Name
                    {sortKey === 'name' && (
                      sortDirection === 'asc' 
                        ? <ChevronUpIcon className="ml-2 h-4 w-4" /> 
                        : <ChevronDownIcon className="ml-2 h-4 w-4" />
                    )}
                    {sortKey !== 'name' && <ArrowsUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('client')}
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Client
                    {sortKey === 'client' && (
                      sortDirection === 'asc' 
                        ? <ChevronUpIcon className="ml-2 h-4 w-4" /> 
                        : <ChevronDownIcon className="ml-2 h-4 w-4" />
                    )}
                    {sortKey !== 'client' && <ArrowsUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('type')}
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Type
                    {sortKey === 'type' && (
                      sortDirection === 'asc' 
                        ? <ChevronUpIcon className="ml-2 h-4 w-4" /> 
                        : <ChevronDownIcon className="ml-2 h-4 w-4" />
                    )}
                    {sortKey !== 'type' && <ArrowsUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('premium')}
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Premium
                    {sortKey === 'premium' && (
                      sortDirection === 'asc' 
                        ? <ChevronUpIcon className="ml-2 h-4 w-4" /> 
                        : <ChevronDownIcon className="ml-2 h-4 w-4" />
                    )}
                    {sortKey !== 'premium' && <ArrowsUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('expiryDate')}
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Expiry Date
                    {sortKey === 'expiryDate' && (
                      sortDirection === 'asc' 
                        ? <ChevronUpIcon className="ml-2 h-4 w-4" /> 
                        : <ChevronDownIcon className="ml-2 h-4 w-4" />
                    )}
                    {sortKey !== 'expiryDate' && <ArrowsUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />}
                  </div>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedPolicies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                    No policies found matching your search criteria
                  </td>
                </tr>
              ) : (
                sortedPolicies.map((policy) => (
                  <tr 
                    key={policy.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleViewPolicy(policy.id)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {policy.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {policy.client}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {policy.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {policy.premium}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(policy.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPolicy(policy.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="View policy details"
                        >
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPolicy(policy.id);
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                          title="Edit policy"
                        >
                          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenewPolicy(policy.id);
                          }}
                          className="ml-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Renew
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 