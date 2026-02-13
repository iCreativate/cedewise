'use client'

import React, { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// Sample data - replace with actual API call
const policies = [
  { id: 1, name: 'Commercial Property Insurance', client: 'ABC Corp', type: 'Property', expiryDate: '2024-12-31' },
  { id: 2, name: 'General Liability Coverage', client: 'XYZ Ltd', type: 'Liability', expiryDate: '2024-10-15' },
  { id: 3, name: 'Marine Cargo Insurance', client: 'Global Shipping', type: 'Marine', expiryDate: '2024-08-22' },
  { id: 4, name: 'Aviation Liability', client: 'Sky Airlines', type: 'Aviation', expiryDate: '2025-01-15' },
  { id: 5, name: 'Motor Fleet', client: 'Transport Co', type: 'Motor', expiryDate: '2024-12-15' },
  { id: 6, name: 'Engineering', client: 'BuildTech', type: 'Engineering', expiryDate: '2025-02-28' },
]

export default function SubmitPlacementPage() {
  const [isNewFacultativeDrawerOpen, setIsNewFacultativeDrawerOpen] = useState(false)
  const [isNewTreatyDrawerOpen, setIsNewTreatyDrawerOpen] = useState(false)
  const [isNonProportionalExpanded, setIsNonProportionalExpanded] = useState(false)
  const router = useRouter()

  const handleNewFacultativeClick = () => {
    setIsNewFacultativeDrawerOpen(true)
  }

  const handleNewTreatyClick = () => {
    setIsNewTreatyDrawerOpen(true)
  }

  const handleRenewalClick = () => {
    router.push('/non-life/submit-renewal')
  }

  // Facultative handlers
  const handleProportionalClick = () => {
    router.push('/non-life/broker/facultative/proportional')
    setIsNewFacultativeDrawerOpen(false)
  }

  const handleNonProportionalClick = () => {
    router.push('/non-life/broker/facultative/non-proportional')
    setIsNewFacultativeDrawerOpen(false)
  }

  // Treaty handlers
  const handleQuotaShareClick = () => {
    router.push('/non-life/broker/treaty/quota-share')
    setIsNewTreatyDrawerOpen(false)
  }

  const handleSurplusClick = () => {
    router.push('/non-life/broker/treaty/surplus')
    setIsNewTreatyDrawerOpen(false)
  }

  const handleRiskXoLClick = () => {
    router.push('/non-life/broker/treaty/risk-xol')
    setIsNewTreatyDrawerOpen(false)
  }

  const handleCatXoLClick = () => {
    router.push('/non-life/broker/treaty/cat-xol')
    setIsNewTreatyDrawerOpen(false)
  }

  const handleAggregateXoLClick = () => {
    router.push('/non-life/broker/treaty/aggregate-xol')
    setIsNewTreatyDrawerOpen(false)
  }

  const handleStopLossClick = () => {
    router.push('/non-life/broker/treaty/stop-loss')
    setIsNewTreatyDrawerOpen(false)
  }

  const toggleNonProportional = () => {
    setIsNonProportionalExpanded(!isNonProportionalExpanded)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submit a Placement</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-6">
          Choose an option to submit a new placement or renew an existing policy.
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleNewFacultativeClick}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit New Facultative Business
          </button>
          
          <button
            onClick={handleNewTreatyClick}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit New Treaty Business
          </button>
          
          <button
            onClick={handleRenewalClick}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit a Renewal
          </button>
        </div>
      </div>

      {/* New Facultative Business Options Drawer */}
      <Transition.Root show={isNewFacultativeDrawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsNewFacultativeDrawerOpen}>
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
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                            New Facultative Business Options
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500"
                              onClick={() => setIsNewFacultativeDrawerOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-4">
                          <button
                            onClick={handleProportionalClick}
                            className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left hover:bg-gray-50"
                          >
                            <h3 className="text-lg font-medium text-gray-900">Proportional</h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Submit a proportional reinsurance placement
                            </p>
                          </button>
                          <button
                            onClick={handleNonProportionalClick}
                            className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left hover:bg-gray-50"
                          >
                            <h3 className="text-lg font-medium text-gray-900">Non-Proportional</h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Submit a non-proportional reinsurance placement
                            </p>
                          </button>
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

      {/* New Treaty Business Options Drawer */}
      <Transition.Root show={isNewTreatyDrawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsNewTreatyDrawerOpen}>
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
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                            New Treaty Business Options
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500"
                              onClick={() => setIsNewTreatyDrawerOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-4">
                          <button
                            onClick={handleQuotaShareClick}
                            className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left hover:bg-gray-50"
                          >
                            <h3 className="text-lg font-medium text-gray-900">Quota Share</h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Submit a quota share treaty reinsurance placement
                            </p>
                          </button>
                          
                          <button
                            onClick={handleSurplusClick}
                            className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left hover:bg-gray-50"
                          >
                            <h3 className="text-lg font-medium text-gray-900">Surplus</h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Submit a surplus treaty reinsurance placement
                            </p>
                          </button>
                          
                          <div className="rounded-lg border border-gray-300 bg-white overflow-hidden">
                            <button
                              onClick={toggleNonProportional}
                              className="w-full p-4 text-left hover:bg-gray-50 flex justify-between items-center"
                            >
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Non-Proportional</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                  Submit a non-proportional treaty reinsurance placement
                                </p>
                              </div>
                              <ChevronRightIcon 
                                className={`h-5 w-5 text-gray-400 transition-transform ${isNonProportionalExpanded ? 'rotate-90' : ''}`} 
                                aria-hidden="true" 
                              />
                            </button>
                            
                            {isNonProportionalExpanded && (
                              <div className="border-t border-gray-200 bg-gray-50 p-2">
                                <div className="space-y-2 pl-2">
                                  <button
                                    onClick={handleRiskXoLClick}
                                    className="w-full rounded-md p-3 text-left hover:bg-gray-100"
                                  >
                                    <h4 className="text-md font-medium text-gray-800">Risk Excess of Loss</h4>
                                  </button>
                                  
                                  <button
                                    onClick={handleCatXoLClick}
                                    className="w-full rounded-md p-3 text-left hover:bg-gray-100"
                                  >
                                    <h4 className="text-md font-medium text-gray-800">Cat / Event XoL</h4>
                                  </button>
                                  
                                  <button
                                    onClick={handleAggregateXoLClick}
                                    className="w-full rounded-md p-3 text-left hover:bg-gray-100"
                                  >
                                    <h4 className="text-md font-medium text-gray-800">Aggregate XoL</h4>
                                  </button>
                                  
                                  <button
                                    onClick={handleStopLossClick}
                                    className="w-full rounded-md p-3 text-left hover:bg-gray-100"
                                  >
                                    <h4 className="text-md font-medium text-gray-800">Stop Loss</h4>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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