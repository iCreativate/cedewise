'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'

interface FormData {
  companyName: string
  insuredName: string
  classOfBusiness: string
  businessOccupation: string
  riskCountry: string
  market: string
  reinsurerRating: string
  reinsurer: string
  riskType: string
  quotedPercentage: string
  remainingPercentage: string
  sumInsured: string
  assets: string
  description: string
  documents: File[]
}

interface Reinsurer {
  id: string
  name: string
  rating: string
}

const markets = [
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
  { id: 'other', name: 'Other (specify)' },
]

const riskTypes = [
  { id: 'non-proportional', name: 'Non-Proportional' },
  { id: 'proportional', name: 'Proportional' },
  { id: 'auto-fac', name: 'Auto Fac' },
]

// Sample reinsurers data - replace with actual data from your API
const reinsurers: Reinsurer[] = [
  { id: '1', name: 'Reinsurer A', rating: 'A' },
  { id: '2', name: 'Reinsurer B', rating: 'A' },
  { id: '3', name: 'Reinsurer C', rating: 'B' },
  { id: '4', name: 'Reinsurer D', rating: 'C' },
]

export default function SubmitNewBusinessPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    insuredName: '',
    classOfBusiness: '',
    businessOccupation: '',
    riskCountry: '',
    market: '',
    reinsurerRating: '',
    reinsurer: '',
    riskType: '',
    quotedPercentage: '',
    remainingPercentage: '',
    sumInsured: '',
    assets: '',
    description: '',
    documents: []
  })

  const [isReinsurerDrawerOpen, setIsReinsurerDrawerOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState('')
  const [otherRating, setOtherRating] = useState('')
  const [showRiskTypes, setShowRiskTypes] = useState(false)
  const [selectedReinsurer, setSelectedReinsurer] = useState<Reinsurer | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'market' && value === 'reinsurer') {
      setIsReinsurerDrawerOpen(true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: Array.from(e.target.files!)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    // Redirect to insurer page after successful submission
    router.push('/non-life/insurer')
  }

  const handleReinsurerSelection = (reinsurer: Reinsurer) => {
    setSelectedReinsurer(reinsurer)
    setFormData(prev => ({
      ...prev,
      reinsurer: reinsurer.name
    }))
    setShowRiskTypes(true)
  }

  const handleRiskTypeSelection = (riskType: string) => {
    setFormData(prev => ({
      ...prev,
      riskType
    }))
    setIsReinsurerDrawerOpen(false)
    
    // Navigate to the appropriate page based on the risk type
    if (riskType === 'non-proportional') {
      router.push('/non-life/broker/facultative/non-proportional')
    } else if (riskType === 'proportional') {
      router.push('/non-life/broker/facultative/proportional')
    } else if (riskType === 'auto-fac') {
      router.push('/non-life/broker/facultative/auto-fac')
    }
  }

  const filteredReinsurers = reinsurers.filter(reinsurer => 
    selectedRating === 'other' 
      ? reinsurer.rating.toLowerCase().includes(otherRating.toLowerCase())
      : reinsurer.rating === selectedRating
  )

  return (
    <>
      <Header 
        title="Submit New Business"
        subtitle="Fill in the details to submit a new business placement"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
                    >
                      <option value="">Select a class</option>
                      <option value="property">Property</option>
                      <option value="marine">Marine</option>
                      <option value="aviation">Aviation</option>
                      <option value="cyber">Cyber</option>
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="market" className="block text-sm font-medium text-gray-700">
                      Choose a Market
                    </label>
                    <select
                      name="market"
                      id="market"
                      value={formData.market}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
                    >
                      <option value="">Select a market</option>
                      {markets.map(market => (
                        <option key={market.id} value={market.id}>
                          {market.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.market === 'reinsurer' && (
                    <div>
                      <label htmlFor="reinsurer" className="block text-sm font-medium text-gray-700">
                        Reinsurer
                      </label>
                      <input
                        type="text"
                        name="reinsurer"
                        id="reinsurer"
                        value={formData.reinsurer}
                        onClick={() => setIsReinsurerDrawerOpen(true)}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 cursor-pointer"
                        required
                      />
                    </div>
                  )}

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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      required
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                    Documents
                  </label>
                  <input
                    type="file"
                    name="documents"
                    id="documents"
                    multiple
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload survey report and claims history report
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Reinsurer Selection Drawer */}
      <Transition.Root show={isReinsurerDrawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsReinsurerDrawerOpen(false)}>
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
                          <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                            {showRiskTypes ? 'Place a New Risk' : 'Select Reinsurer'}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => {
                                if (showRiskTypes) {
                                  setShowRiskTypes(false)
                                } else {
                                  setIsReinsurerDrawerOpen(false)
                                }
                              }}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {!showRiskTypes ? (
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                Reinsurer Rating
                              </label>
                              <select
                                id="rating"
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                              >
                                <option value="">Select a rating</option>
                                {reinsurerRatings.map(rating => (
                                  <option key={rating.id} value={rating.id}>
                                    {rating.name}
                                  </option>
                                ))}
                              </select>
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
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                  placeholder="Enter rating"
                                />
                              </div>
                            )}

                            <div className="space-y-4">
                              {filteredReinsurers.map((reinsurer) => (
                                <button
                                  key={reinsurer.id}
                                  onClick={() => handleReinsurerSelection(reinsurer)}
                                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">{reinsurer.name}</h4>
                                    <p className="text-sm text-gray-500">Rating: {reinsurer.rating}</p>
                                  </div>
                                  <div className="h-5 w-5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {selectedReinsurer && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-900">Selected Reinsurer</h4>
                                <p className="text-sm text-gray-500">{selectedReinsurer.name} (Rating: {selectedReinsurer.rating})</p>
                              </div>
                            )}
                            
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Place a New Risk</h3>
                              <div className="space-y-4">
                                {riskTypes.map((riskType) => (
                                  <button
                                    key={riskType.id}
                                    onClick={() => handleRiskTypeSelection(riskType.id)}
                                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                  >
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">{riskType.name}</h4>
                                    </div>
                                    <div className="h-5 w-5 text-gray-400">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
} 