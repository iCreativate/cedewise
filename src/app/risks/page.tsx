import Link from 'next/link'
import { FunnelIcon, PlusIcon } from '@heroicons/react/20/solid'

const risks = [
  {
    id: 1,
    name: 'Property Cat Risk - California',
    type: 'Property',
    premium: '$500,000',
    status: 'Pending Review',
    submittedBy: 'John Smith',
    submittedDate: '2024-04-10',
  },
  {
    id: 2,
    name: 'Marine Cargo - Atlantic Route',
    type: 'Marine',
    premium: '$750,000',
    status: 'Under Review',
    submittedBy: 'Sarah Johnson',
    submittedDate: '2024-04-09',
  },
  {
    id: 3,
    name: 'Aviation Fleet Coverage',
    type: 'Aviation',
    premium: '$1,200,000',
    status: 'Bound',
    submittedBy: 'Michael Brown',
    submittedDate: '2024-04-08',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Risks() {
  return (
    <div className="py-6">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Risks</h1>
            <Link
              href="/risks/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Risk
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <div className="flex items-center justify-between bg-white px-6 py-3">
                    <div className="flex-1 sm:hidden" />
                    <div className="flex flex-1 items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900"
                      >
                        <FunnelIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Risk Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Premium
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Submitted By
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {risks.map((risk) => (
                        <tr key={risk.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {risk.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{risk.type}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{risk.premium}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={classNames(
                                risk.status === 'Bound'
                                  ? 'bg-green-50 text-green-700'
                                  : risk.status === 'Under Review'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-gray-50 text-gray-700',
                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                              )}
                            >
                              {risk.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{risk.submittedBy}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{risk.submittedDate}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link href={`/risks/${risk.id}`} className="text-indigo-600 hover:text-indigo-900">
                              View
                            </Link>
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
      </main>
    </div>
  )
} 