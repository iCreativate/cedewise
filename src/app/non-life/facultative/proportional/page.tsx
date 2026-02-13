'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import DocumentUpload from '@/components/DocumentUpload'
import Chat from '@/components/Chat'

interface DocumentUploadProps {
  submissionId: string;
}

interface ChatProps {
  submissionId: string;
  userRole: string;
  userName: string | null;
}

export default function ProportionalFacultativePage() {
  const router = useRouter()
  const { userRole, userName } = useUser()
  const [activeTab, setActiveTab] = useState('details')
  const [submissionId] = useState('sub_654321')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#3366FF] rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Proportional Facultative Reinsurance
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">Submission from:</span>
                <span className="text-white font-medium">Ceding Company</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">Insured Name:</span>
                <span className="text-white font-medium">Vulcan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">Reference:</span>
                <span className="text-white font-medium">PRO-PR-456789-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">Underwriter:</span>
                <span className="text-white font-medium">Insurer Demo</span>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                Pending Review
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'text-[#3366FF] border-b-2 border-[#3366FF]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              } whitespace-nowrap py-4 px-1 text-sm font-medium`}
            >
              Submission Details
            </button>
            <button
              onClick={() => setActiveTab('quote')}
              className={`${
                activeTab === 'quote'
                  ? 'text-[#3366FF] border-b-2 border-[#3366FF]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              } whitespace-nowrap py-4 px-1 text-sm font-medium`}
            >
              My Quote
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? 'text-[#3366FF] border-b-2 border-[#3366FF]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              } whitespace-nowrap py-4 px-1 text-sm font-medium`}
            >
              My Documents
            </button>
            <button
              onClick={() => setActiveTab('risk-address')}
              className={`${
                activeTab === 'risk-address'
                  ? 'text-[#3366FF] border-b-2 border-[#3366FF]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              } whitespace-nowrap py-4 px-1 text-sm font-medium`}
            >
              Risk Address
            </button>
            <button
              onClick={() => setActiveTab('currency-calculator')}
              className={`${
                activeTab === 'currency-calculator'
                  ? 'text-[#3366FF] border-b-2 border-[#3366FF]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              } whitespace-nowrap py-4 px-1 text-sm font-medium`}
            >
              Currency Calculator
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`${
                activeTab === 'submissions'
                  ? 'text-[#3366FF] border-b-2 border-[#3366FF]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              } whitespace-nowrap py-4 px-1 text-sm font-medium`}
            >
              Submissions
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Submission Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Ceding Company
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    Santam
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Insured
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    Vulcan
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Policy Reference Number
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    PR-456789-1234
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Broker
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    AON
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Class of Business
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    Property
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Business Occupation
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    Mining
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Risk Country
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    Mozambique
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Quote Required (%)
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    75
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Physical Damage
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    R 120000000
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Business Interruption
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    R 47000000
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Sum Insured
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    R 167000000
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Premium Rate (%)
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    2.5
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Premium Amount
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    R 4175000
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Deductions (%)
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200 flex items-center">
                    <span>Total: 30.00%</span>
                    <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Start Date
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    01 Jan 2024
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End Date
                  </label>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                    31 Dec 2024
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <div className="bg-gray-100 p-3 rounded-md text-gray-500 border border-gray-200">
                  Mining facility with state-of-the-art equipment and safety measures.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quote' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">My Quote</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Written Line (%)
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter percentage"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Signed Line (%)
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter percentage"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Premium Rate (%)
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter rate"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter commission"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-[#3366FF] text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Submit Quote
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">My Documents</h2>
              <DocumentUpload 
                bucketName="cedewise-documents"
                folderPath={`submissions/${submissionId}`}
                onFileUploaded={(fileData) => {
                  console.log('File uploaded:', fileData);
                  // Handle the uploaded file data
                }}
              />
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {/* Placeholder for document list */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-900">Policy Document.pdf</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk-address' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                      placeholder="Enter state/province"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'currency-calculator' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Currency Calculator</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    From Currency
                  </label>
                  <select className="bg-gray-50 p-3 rounded-md text-gray-900 w-full">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    To Currency
                  </label>
                  <select className="bg-gray-50 p-3 rounded-md text-gray-900 w-full">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Converted Amount
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md text-gray-900">
                    0.00
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-[#3366FF] text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Calculate
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Submissions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insured
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        PR-456789-1234
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Vulcan
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2024-01-01
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-blue-600 hover:text-blue-800">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Communication with Broker Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Communication with Broker</h2>
              <Chat 
                submissionId={submissionId}
                className="h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 