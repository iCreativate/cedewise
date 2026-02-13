'use client'

import { useState } from 'react'
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ExclamationCircleIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// Sample data for placements
const samplePlacements = [
  {
    id: 1,
    company: 'Santam',
    insured: 'Vulcan Risk Mining',
    classOfBusiness: 'Mining',
    businessOccupation: 'Mining Operations',
    riskCountry: 'Mozambique',
    reinsurer: 'Swiss Re',
    placementPercentage: '70%',
    commission: '15%',
    premium: '2,500,000.00',
    placementDate: '2023-05-15',
    status: 'Placed',
    notes: 'Primary layer placement'
  },
  {
    id: 2,
    company: 'Old Mutual',
    insured: 'African Gold Mining',
    classOfBusiness: 'Mining',
    businessOccupation: 'Gold Mining',
    riskCountry: 'South Africa',
    reinsurer: 'Munich Re',
    placementPercentage: '50%',
    commission: '12.5%',
    premium: '1,800,000.00',
    placementDate: '2023-04-10',
    status: 'Pending',
    notes: 'Excess layer placement'
  }
]

// Status options
const statusOptions = [
  'All',
  'Placed',
  'Pending',
  'Declined'
]

// Form status options
const formStatusOptions = [
  'Placed',
  'Pending',
  'Declined'
]

export default function PlacementsPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    insured: '',
    classOfBusiness: '',
    businessOccupation: '',
    riskCountry: '',
    reinsurer: '',
    placementPercentage: '',
    commission: '',
    premium: '',
    placementDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    notes: ''
  })

  // Filter placements based on selected filters and search term
  const filteredPlacements = samplePlacements.filter(placement => {
    const matchesStatus = statusFilter === 'All' || placement.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      Object.values(placement).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    return matchesStatus && matchesSearch
  })

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Placed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'Pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'Declined':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New placement submitted:', formData)
    
    // In a real application, you would send this data to your API
    setIsModalOpen(false)
    
    // Reset form data
    setFormData({
      company: '',
      insured: '',
      classOfBusiness: '',
      businessOccupation: '',
      riskCountry: '',
      reinsurer: '',
      placementPercentage: '',
      commission: '',
      premium: '',
      placementDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Placements</h1>
            <p className="mt-2 text-sm text-gray-700">
              Submit and manage reinsurance placements
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Submit Placement
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              name="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
              placeholder="Search placements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Placements Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Company
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Insured
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Class of Business
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Reinsurer
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Placement %
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Commission
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Premium
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredPlacements.map((placement) => (
                      <tr key={placement.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {placement.company}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {placement.insured}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {placement.classOfBusiness}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {placement.reinsurer}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {placement.placementPercentage}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {placement.commission}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {placement.premium}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {getStatusIcon(placement.status)}
                            <span className="ml-2">{placement.status}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            {placement.placementDate}
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

      {/* New Placement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 sm:align-middle">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Submit New Placement</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Enter the details for the new reinsurance placement.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="insured" className="block text-sm font-medium text-gray-700">
                          Insured
                        </label>
                        <input
                          type="text"
                          name="insured"
                          id="insured"
                          value={formData.insured}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="classOfBusiness" className="block text-sm font-medium text-gray-700">
                          Class of Business
                        </label>
                        <input
                          type="text"
                          name="classOfBusiness"
                          id="classOfBusiness"
                          value={formData.classOfBusiness}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="businessOccupation" className="block text-sm font-medium text-gray-700">
                          Business Occupation
                        </label>
                        <input
                          type="text"
                          name="businessOccupation"
                          id="businessOccupation"
                          value={formData.businessOccupation}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="riskCountry" className="block text-sm font-medium text-gray-700">
                          Risk Country
                        </label>
                        <input
                          type="text"
                          name="riskCountry"
                          id="riskCountry"
                          value={formData.riskCountry}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="reinsurer" className="block text-sm font-medium text-gray-700">
                          Reinsurer
                        </label>
                        <input
                          type="text"
                          name="reinsurer"
                          id="reinsurer"
                          value={formData.reinsurer}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="placementPercentage" className="block text-sm font-medium text-gray-700">
                          Placement %
                        </label>
                        <input
                          type="text"
                          name="placementPercentage"
                          id="placementPercentage"
                          value={formData.placementPercentage}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
                          Commission
                        </label>
                        <input
                          type="text"
                          name="commission"
                          id="commission"
                          value={formData.commission}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="premium" className="block text-sm font-medium text-gray-700">
                          Premium
                        </label>
                        <input
                          type="text"
                          name="premium"
                          id="premium"
                          value={formData.premium}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        >
                          {formStatusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="placementDate" className="block text-sm font-medium text-gray-700">
                          Placement Date
                        </label>
                        <input
                          type="date"
                          name="placementDate"
                          id="placementDate"
                          value={formData.placementDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Add any additional notes about the placement..."
                      />
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Submit Placement
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 