'use client'

import React, { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
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

interface SubmitPlacementDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubmitPlacementDrawer({ isOpen, onClose }: SubmitPlacementDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState<'new' | 'renewal' | null>(null)
  const router = useRouter()

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = () => {
    if (selectedOption === 'new') {
      router.push('/non-life/submit-new-business')
    } else if (selectedOption === 'renewal' && searchQuery) {
      router.push('/non-life/submit-renewal')
    }
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Submit a Placement
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                          onClick={onClose}
                        >
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 px-4 sm:px-6">
                      {!selectedOption ? (
                        <div className="space-y-6">
                          <div>
                            <button
                              onClick={() => setSelectedOption('new')}
                              className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                                <div className="ml-4">
                                  <h3 className="text-lg font-medium text-gray-900">Submit New Business</h3>
                                  <p className="mt-1 text-sm text-gray-500">Create a new reinsurance placement</p>
                                </div>
                              </div>
                            </button>
                          </div>

                          <div>
                            <button
                              onClick={() => setSelectedOption('renewal')}
                              className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <ArrowPathIcon className="h-6 w-6 text-indigo-600" />
                                <div className="ml-4">
                                  <h3 className="text-lg font-medium text-gray-900">Submit a Renewal</h3>
                                  <p className="mt-1 text-sm text-gray-500">Renew an existing policy</p>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ) : selectedOption === 'new' ? (
                        <div>
                          <button
                            onClick={handleSubmit}
                            className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Continue to New Business Form</h3>
                                <p className="mt-1 text-sm text-gray-500">Fill out the form to submit new business</p>
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => setSelectedOption(null)}
                            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
                          >
                            ← Back
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-4">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search policies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            {filteredPolicies.map((policy) => (
                              <button
                                key={policy.id}
                                onClick={() => handleSubmit()}
                                className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left hover:bg-gray-50"
                              >
                                <h3 className="text-lg font-medium text-gray-900">{policy.name}</h3>
                                <div className="mt-2 text-sm text-gray-500">
                                  <p>Client: {policy.client}</p>
                                  <p>Type: {policy.type}</p>
                                  <p>Expiry Date: {new Date(policy.expiryDate).toLocaleDateString()}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setSelectedOption(null)}
                            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
                          >
                            ← Back
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        {selectedOption && (
                          <button
                            type="button"
                            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={selectedOption === 'renewal' && !searchQuery}
                          >
                            Continue
                          </button>
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
  )
} 