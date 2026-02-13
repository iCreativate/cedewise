'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface BrokerDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function BrokerDrawer({ isOpen, onClose }: BrokerDrawerProps) {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<'treaty' | 'facultative' | null>(null)

  const handleTreaty = () => {
    router.push('/non-life/broker/treaty')
    onClose()
  }

  const handleFacultativeOption = (option: 'non-proportional' | 'proportional' | 'auto-fac') => {
    router.push(`/non-life/broker/facultative/${option}`)
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
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                          Select Broker Type
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {selectedOption === null ? (
                        <div className="space-y-4">
                          <button
                            onClick={() => setSelectedOption('treaty')}
                            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-3" />
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Treaty</h3>
                                <p className="text-sm text-gray-500">Select treaty reinsurance</p>
                              </div>
                            </div>
                            <div className="h-5 w-5 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </button>

                          <button
                            onClick={() => setSelectedOption('facultative')}
                            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <ArrowPathIcon className="h-6 w-6 text-indigo-500 mr-3" />
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Facultative</h3>
                                <p className="text-sm text-gray-500">Select facultative reinsurance</p>
                              </div>
                            </div>
                            <div className="h-5 w-5 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      ) : selectedOption === 'treaty' ? (
                        <div>
                          <div className="mb-4">
                            <button
                              onClick={() => setSelectedOption(null)}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              ← Back to options
                            </button>
                          </div>
                          <div className="text-center py-12">
                            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Treaty Reinsurance</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Proceed with treaty reinsurance selection.
                            </p>
                            <div className="mt-6">
                              <button
                                type="button"
                                onClick={handleTreaty}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-4">
                            <button
                              onClick={() => setSelectedOption(null)}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              ← Back to options
                            </button>
                          </div>
                          <div className="space-y-4">
                            <button
                              onClick={() => handleFacultativeOption('non-proportional')}
                              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-3" />
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">Non-Proportional</h3>
                                  <p className="text-sm text-gray-500">Select non-proportional facultative</p>
                                </div>
                              </div>
                              <div className="h-5 w-5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </button>

                            <button
                              onClick={() => handleFacultativeOption('proportional')}
                              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-3" />
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">Proportional</h3>
                                  <p className="text-sm text-gray-500">Select proportional facultative</p>
                                </div>
                              </div>
                              <div className="h-5 w-5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </button>

                            <button
                              onClick={() => handleFacultativeOption('auto-fac')}
                              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-3" />
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">Auto Fac</h3>
                                  <p className="text-sm text-gray-500">Select auto facultative</p>
                                </div>
                              </div>
                              <div className="h-5 w-5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </button>
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
  )
} 