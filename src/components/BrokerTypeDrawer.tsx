import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface BrokerTypeDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function BrokerTypeDrawer({ isOpen, onClose }: BrokerTypeDrawerProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'treaty' | 'facultative' | null>(null)

  const handleTypeSelect = (type: 'treaty' | 'facultative') => {
    if (type === 'treaty') {
      router.push('/broker/treaty')
      onClose()
    } else {
      setSelectedType('facultative')
    }
  }

  const handleFacultativeSelect = (type: string) => {
    router.push(`/broker/facultative/${type.toLowerCase()}`)
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
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 py-6">
                          Select Type of Reinsurance
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      <div className="space-y-4">
                        {!selectedType ? (
                          <>
                            <button
                              onClick={() => handleTypeSelect('treaty')}
                              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"
                            >
                              <h3 className="font-medium text-gray-900">Treaty</h3>
                              <p className="text-sm text-gray-500">Manage treaty reinsurance arrangements</p>
                            </button>
                            <button
                              onClick={() => handleTypeSelect('facultative')}
                              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"
                            >
                              <h3 className="font-medium text-gray-900">Facultative</h3>
                              <p className="text-sm text-gray-500">Handle facultative reinsurance cases</p>
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="mb-4">
                              <button
                                onClick={() => setSelectedType(null)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                ← Back to main options
                              </button>
                            </div>
                            <button
                              onClick={() => handleFacultativeSelect('non-proportional')}
                              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"
                            >
                              <h3 className="font-medium text-gray-900">Non-Proportional</h3>
                              <p className="text-sm text-gray-500">Manage non-proportional facultative cases</p>
                            </button>
                            <button
                              onClick={() => handleFacultativeSelect('proportional')}
                              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"
                            >
                              <h3 className="font-medium text-gray-900">Proportional</h3>
                              <p className="text-sm text-gray-500">Handle proportional facultative arrangements</p>
                            </button>
                            <button
                              onClick={() => handleFacultativeSelect('auto-fac')}
                              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"
                            >
                              <h3 className="font-medium text-gray-900">Auto Fac</h3>
                              <p className="text-sm text-gray-500">Manage automatic facultative cases</p>
                            </button>
                          </>
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