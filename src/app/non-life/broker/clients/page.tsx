'use client'

import { useState } from 'react'
import { 
  UserGroupIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const clients = [
  {
    id: 1,
    name: 'ABC Insurance',
    type: 'Insurance Company',
    status: 'Active',
    premium: 'R1.2B',
    policies: 15,
    growth: '+12%',
    isPositive: true,
    contact: {
      email: 'contact@abcinsurance.com',
      phone: '+27 11 123 4567',
      address: '123 Main Street, Johannesburg'
    }
  },
  {
    id: 2,
    name: 'XYZ Manufacturing',
    type: 'Corporate',
    status: 'Active',
    premium: 'R800M',
    policies: 8,
    growth: '+8%',
    isPositive: true,
    contact: {
      email: 'risk@xyzmanufacturing.com',
      phone: '+27 11 987 6543',
      address: '456 Industrial Park, Cape Town'
    }
  },
  {
    id: 3,
    name: 'DEF Shipping',
    type: 'Maritime',
    status: 'Pending',
    premium: 'R500M',
    policies: 5,
    growth: '-5%',
    isPositive: false,
    contact: {
      email: 'operations@defshipping.com',
      phone: '+27 11 456 7890',
      address: '789 Port Road, Durban'
    }
  }
]

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your client relationships and view their reinsurance portfolios
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link
                href="/non-life/broker/clients/new"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add New Client
              </Link>
            </div>
          </div>

          {/* Clients List */}
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Client Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Premium
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Policies
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Growth
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {client.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {client.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              client.status === 'Active' ? 'bg-green-100 text-green-800' :
                              client.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {client.premium}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {client.policies}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center ${
                              client.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {client.isPositive ? (
                                <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <ArrowTrendingDownIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                              <span className="ml-1">{client.growth}</span>
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                <a href={`mailto:${client.contact.email}`} className="hover:text-indigo-600">
                                  {client.contact.email}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                <a href={`tel:${client.contact.phone}`} className="hover:text-indigo-600">
                                  {client.contact.phone}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                <span>{client.contact.address}</span>
                              </div>
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
      </div>
    </div>
  )
} 