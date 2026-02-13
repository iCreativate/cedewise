'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function SubmitPlacementPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    company: '',
    insured: '',
    classOfBusiness: '',
    reinsurer: '',
    placementPercentage: '',
    commission: '',
    premium: '',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData)
    // Redirect to placements page after submission
    router.push('/broker/placements')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
                <div className="ml-3">
                  <h1 className="text-2xl font-semibold text-gray-900">Submit a Placement</h1>
                  <p className="mt-1 text-sm text-gray-500">Submit a new reinsurance placement.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
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
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="classOfBusiness" className="block text-sm font-medium text-gray-700">
                  Class of Business
                </label>
                <select
                  id="classOfBusiness"
                  name="classOfBusiness"
                  value={formData.classOfBusiness}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="">Select a class</option>
                  <option value="Property">Property</option>
                  <option value="Marine">Marine</option>
                  <option value="Aviation">Aviation</option>
                  <option value="Cyber">Cyber</option>
                </select>
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
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="placementPercentage" className="block text-sm font-medium text-gray-700">
                    Placement %
                  </label>
                  <input
                    type="number"
                    name="placementPercentage"
                    id="placementPercentage"
                    value={formData.placementPercentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
                    Commission %
                  </label>
                  <input
                    type="number"
                    name="commission"
                    id="commission"
                    value={formData.commission}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="premium" className="block text-sm font-medium text-gray-700">
                  Premium (ZAR)
                </label>
                <input
                  type="number"
                  name="premium"
                  id="premium"
                  value={formData.premium}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/broker/placements')}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 