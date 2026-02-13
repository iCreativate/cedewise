'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface FormData {
  companyName: string
  insuredName: string
  classOfBusiness: string
  businessOccupation: string
  riskCountry: string
  reinsurer: string
  quotedPercentage: string
  remainingPercentage: string
  sumInsured: string
  assets: string
  description: string
  surveyReport: File | null
  claimsHistoryReport: File | null
}

const marketOptions = [
  { id: 'insurer', name: 'Insurer' },
  { id: 'co-insurer', name: 'Co-Insurer' },
  { id: 'reinsurer', name: 'Reinsurer' },
  { id: 'co-broker', name: 'Co-Broker' },
  { id: 'retrocession', name: 'Retrocession' },
  { id: 'none', name: 'None' },
]

const reinsurerRatings = [
  { id: 'a', name: 'A' },
  { id: 'none', name: 'None' },
  { id: 'other', name: 'Other (Specify)' },
]

interface Reinsurer {
  id: string
  name: string
  rating: string
}

const sampleReinsurers: Reinsurer[] = [
  { id: '1', name: 'Munich Re', rating: 'a' },
  { id: '2', name: 'Swiss Re', rating: 'a' },
  { id: '3', name: 'Hannover Re', rating: 'a' },
  { id: '4', name: 'SCOR', rating: 'a' },
  { id: '5', name: 'Lloyd\'s', rating: 'a' },
]

export default function SubmitNewBusinessPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    insuredName: '',
    classOfBusiness: '',
    businessOccupation: '',
    riskCountry: '',
    reinsurer: '',
    quotedPercentage: '',
    remainingPercentage: '',
    sumInsured: '',
    assets: '',
    description: '',
    surveyReport: null,
    claimsHistoryReport: null,
  })

  const [selectedMarket, setSelectedMarket] = useState('')
  const [isReinsurerDrawerOpen, setIsReinsurerDrawerOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState('')
  const [otherRating, setOtherRating] = useState('')
  const [filteredReinsurers, setFilteredReinsurers] = useState<Reinsurer[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedMarket(value)
    if (value === 'reinsurer') {
      setIsReinsurerDrawerOpen(true)
    }
  }

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating)
    if (rating === 'other') {
      setOtherRating('')
    } else {
      setFilteredReinsurers(sampleReinsurers.filter(r => r.rating === rating))
    }
  }

  const handleReinsurerSelect = (reinsurer: Reinsurer) => {
    setFormData(prev => ({ ...prev, reinsurer: reinsurer.name }))
    setIsReinsurerDrawerOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    router.push('/non-life/insurer')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Submit New Business
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Fill in the details to submit a new business placement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="insuredName" className="block text-sm font-medium text-gray-700">
                Insured Name
              </label>
              <input
                type="text"
                name="insuredName"
                id="insuredName"
                value={formData.insuredName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="classOfBusiness" className="block text-sm font-medium text-gray-700">
                Class of Business
              </label>
              <select
                name="classOfBusiness"
                id="classOfBusiness"
                value={formData.classOfBusiness}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a class</option>
                <option value="property">Property</option>
                <option value="marine">Marine</option>
                <option value="aviation">Aviation</option>
                <option value="engineering">Engineering</option>
                <option value="liability">Liability</option>
              </select>
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="market" className="block text-sm font-medium text-gray-700">
                Market
              </label>
              <select
                name="market"
                id="market"
                value={selectedMarket}
                onChange={handleMarketChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a market</option>
                {marketOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
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
                onChange={handleInputChange}
                onClick={() => selectedMarket === 'reinsurer' && setIsReinsurerDrawerOpen(true)}
                readOnly={selectedMarket === 'reinsurer'}
                required={selectedMarket === 'reinsurer'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="quotedPercentage" className="block text-sm font-medium text-gray-700">
                Quoted Percentage
              </label>
              <input
                type="number"
                name="quotedPercentage"
                id="quotedPercentage"
                value={formData.quotedPercentage}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="remainingPercentage" className="block text-sm font-medium text-gray-700">
                Remaining Percentage
              </label>
              <input
                type="number"
                name="remainingPercentage"
                id="remainingPercentage"
                value={formData.remainingPercentage}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="sumInsured" className="block text-sm font-medium text-gray-700">
                Sum Insured
              </label>
              <input
                type="number"
                name="sumInsured"
                id="sumInsured"
                value={formData.sumInsured}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="assets" className="block text-sm font-medium text-gray-700">
                Assets
              </label>
              <input
                type="text"
                name="assets"
                id="assets"
                value={formData.assets}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="surveyReport" className="block text-sm font-medium text-gray-700">
                Survey Report
              </label>
              <input
                type="file"
                name="surveyReport"
                id="surveyReport"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="claimsHistoryReport" className="block text-sm font-medium text-gray-700">
                Claims History Report
              </label>
              <input
                type="file"
                name="claimsHistoryReport"
                id="claimsHistoryReport"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Reinsurer Selection Drawer */}
      <Transition.Root show={isReinsurerDrawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsReinsurerDrawerOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Select Reinsurer
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setIsReinsurerDrawerOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-1 px-4 sm:px-6">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Reinsurer Rating
                            </label>
                            <div className="mt-2 space-y-2">
                              {reinsurerRatings.map((rating) => (
                                <div key={rating.id} className="flex items-center">
                                  <input
                                    type="radio"
                                    id={rating.id}
                                    name="rating"
                                    value={rating.id}
                                    checked={selectedRating === rating.id}
                                    onChange={() => handleRatingChange(rating.id)}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={rating.id}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    {rating.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {selectedRating === 'other' && (
                            <div>
                              <label htmlFor="otherRating" className="block text-sm font-medium text-gray-700">
                                Specify Rating
                              </label>
                              <input
                                type="text"
                                id="otherRating"
                                value={otherRating}
                                onChange={(e) => setOtherRating(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          )}

                          {selectedRating && selectedRating !== 'other' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Available Reinsurers
                              </label>
                              <div className="mt-2 space-y-2">
                                {filteredReinsurers.map((reinsurer) => (
                                  <button
                                    key={reinsurer.id}
                                    type="button"
                                    onClick={() => handleReinsurerSelect(reinsurer)}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  >
                                    {reinsurer.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
} 