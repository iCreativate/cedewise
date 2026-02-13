'use client'

import { ScaleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProportionalTreatyPage() {
  const router = useRouter()
  const [isLoadingBrokerSubmissions, setIsLoadingBrokerSubmissions] = useState(false)
  const [proportionalFacData, setProportionalFacData] = useState([
    {
      id: 1,
      company: 'Santam',
      policyReferenceNumber: 'PR-2024-001',
      brokerName: 'AON',
      insured: 'ABC Corporation',
      classOfBusiness: 'Property',
      businessOccupation: 'Manufacturing',
      riskCountry: 'South Africa',
      quoteRequiredPercentage: '25%',
      remainingShare: '75%',
      status: 'Pending Review',
      sumInsured: 'R 850,000,000',
      currency: 'ZAR',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premiumRate: '0.5',
      premiumAmount: 'R 4,250,000',
      commission: '5',
      brokerage: '2.5',
      overriderCommission: '1',
      description: 'Property risk for manufacturing facility in Johannesburg',
      documents: ['Risk Survey.pdf', 'Financials.xlsx']
    },
    // Add more mock data as needed
  ])

  const handleViewSubmission = (id: number) => {
    // Store the selected submission in sessionStorage
    const submission = proportionalFacData.find(sub => sub.id === id)
    if (submission) {
      sessionStorage.setItem('selectedSubmission', JSON.stringify(submission))
      router.push(`/non-life/reinsurer/submissions/proportional/${id}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <ScaleIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Proportional Treaty Reinsurance
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Manage your proportional treaty reinsurance arrangements
        </p>
      </div>
      
      <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Test Page</h2>
          <p className="mt-2 text-sm text-gray-500">
            This is a test page for the Proportional Treaty navigation. If you're seeing this page, 
            the navigation menu is working correctly!
          </p>
        </div>
      </div>

      {/* Proportional Submissions Table */}
      <div className="mt-8 bg-white rounded-xl shadow-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Proportional Submissions</h2>
        </div>
        
        <div className="overflow-x-auto">
          {isLoadingBrokerSubmissions ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              <span className="ml-4 text-gray-700">Loading submissions...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Company</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reference Number</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Broker</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Insured</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Class of Business</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Risk Country</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quote Required %</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Remaining Share</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {proportionalFacData.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {submission.company}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.policyReferenceNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.brokerName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.insured}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.classOfBusiness}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.riskCountry}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.quoteRequiredPercentage}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {submission.remainingShare}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'Bound' ? 'bg-green-100 text-green-800' :
                        submission.status === 'Quoted' ? 'bg-blue-100 text-blue-800' :
                        submission.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleViewSubmission(submission.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
} 