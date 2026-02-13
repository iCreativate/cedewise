'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface MarketSelectionDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const marketOptions = [
  { id: 'insurer', name: 'Insurer' },
  { id: 'co-insurer', name: 'Co-Insurer' },
  { id: 'reinsurer', name: 'Reinsurer' },
  { id: 'co-broker', name: 'Co-Broker' },
  { id: 'retrocession', name: 'Retrocession' },
  { id: 'none', name: 'None' },
]

const ratingOptions = [
  { id: 'a', name: 'A' },
  { id: 'none', name: 'None' },
  { id: 'other', name: 'Other (specify)' },
]

// Sample reinsurer data - replace with actual data from your backend
const sampleReinsurers = [
  { id: 1, name: 'Swiss Re', rating: 'A' },
  { id: 2, name: 'Munich Re', rating: 'A' },
  { id: 3, name: 'Hannover Re', rating: 'A' },
  { id: 4, name: 'SCOR', rating: 'A' },
  { id: 5, name: 'Partner Re', rating: 'A' },
]

export default function MarketSelectionDrawer({ isOpen, onClose }: MarketSelectionDrawerProps) {
  const router = useRouter()
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<string | null>(null)
  const [otherRating, setOtherRating] = useState('')
  const [showReinsurerList, setShowReinsurerList] = useState(false)

  const handleMarketSelection = (marketId: string) => {
    setSelectedMarket(marketId)
    if (marketId === 'reinsurer') {
      setShowReinsurerList(true)
    } else {
      // Handle other market selections
      router.push(`/broker/submit-new-business/${marketId}`)
      onClose()
    }
  }

  const handleRatingSelection = (rating: string) => {
    setSelectedRating(rating)
    if (rating === 'other') {
      // Show input field for other rating
      return
    }
    // Filter reinsurers based on rating
    const filteredReinsurers = sampleReinsurers.filter(
      reinsurer => rating === 'none' ? !reinsurer.rating : reinsurer.rating === rating
    )
    // Handle the filtered reinsurers
    console.log('Filtered reinsurers:', filteredReinsurers)
  }

  const handleReinsurerSelection = (reinsurerId: number) => {
    // Handle reinsurer selection
    router.push(`/broker/submit-new-business/reinsurer/${reinsurerId}`)
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
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
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                          Choose a Market
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
                      {!showReinsurerList ? (
                        <div className="space-y-4">
                          {marketOptions.map((market) => (
                            <button
                              key={market.id}
                              onClick={() => handleMarketSelection(market.id)}
                              className="w-full rounded-lg border border-gray-300 p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {market.name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Select Reinsurer Rating</h3>
                          <div className="space-y-2">
                            {ratingOptions.map((rating) => (
                              <button
                                key={rating.id}
                                onClick={() => handleRatingSelection(rating.id)}
                                className="w-full rounded-lg border border-gray-300 p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                {rating.name}
                              </button>
                            ))}
                          </div>
                          {selectedRating === 'other' && (
                            <div className="mt-4">
                              <label htmlFor="other-rating" className="block text-sm font-medium text-gray-700">
                                Specify Rating
                              </label>
                              <input
                                type="text"
                                id="other-rating"
                                value={otherRating}
                                onChange={(e) => setOtherRating(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          )}
                          {selectedRating && selectedRating !== 'other' && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900">Available Reinsurers</h4>
                              <div className="mt-2 space-y-2">
                                {sampleReinsurers
                                  .filter(reinsurer => selectedRating === 'none' ? !reinsurer.rating : reinsurer.rating === selectedRating)
                                  .map((reinsurer) => (
                                    <button
                                      key={reinsurer.id}
                                      onClick={() => handleReinsurerSelection(reinsurer.id)}
                                      className="w-full rounded-lg border border-gray-300 p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                      {reinsurer.name}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
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