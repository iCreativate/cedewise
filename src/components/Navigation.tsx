'use client'

import { Fragment, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import SubmitPlacementDrawer from './SubmitPlacementDrawer'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Broker', href: '/broker', icon: ChartBarIcon },
  { name: 'Clients', href: '/broker/clients', icon: UsersIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation() {
  const pathname = usePathname()
  const [isSubmitPlacementOpen, setIsSubmitPlacementOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/" className="text-white font-bold text-xl">
                      Cedewise
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            pathname === item.href
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => setIsSubmitPlacementOpen(true)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Submit a Placement
                      </button>
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => setIsSubmitPlacementOpen(true)}
                  className="flex w-full items-center rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Submit a Placement
                </button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <SubmitPlacementDrawer
        isOpen={isSubmitPlacementOpen}
        onClose={() => setIsSubmitPlacementOpen(false)}
      />
    </div>
  )
} 