'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ClockIcon, 
  UserCircleIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Define the Submission type for better type checking
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'In Review' | 'Quoted' | 'Submitted' | 'Under Review'
type SubmissionType = 'Treaty' | 'Facultative' | 'Proportional' | 'Non-Proportional'

// Define subtype interfaces for different submission types
interface ProportionalDetails {
  reinsured: string
  insured: string
  classOfBusiness: string
  businessOccupation: string
  riskCountry: string
  quoteRequiredPercentage: string
  sumInsured: string
  reinsurer_rating: string
  startDate: string
  endDate: string
  documentTypes: {
    lossHistory: boolean
    surveyReport: boolean
    rationalFireDesign: boolean
    complianceLetter: boolean
    sumInsuredCalculations: boolean
  }
}

interface NonProportionalDetails {
  reinsured: string
  insured: string
  classOfBusiness: string
  businessOccupation: string
  riskCountry: string
  sumInsured: string
  reinsuranceLayer: string
  primaryLayer: string
  reinsurer_rating: string
  startDate: string
  endDate: string
  documentTypes: {
    lossHistory: boolean
    surveyReport: boolean
    rationalFireDesign: boolean
    complianceLetter: boolean
    sumInsuredCalculations: boolean
  }
}

interface TreatyDetails {
  name: string
  client: string
  type: string
  premium: string
  startDate: string
  endDate: string
  description: string
  layers?: number
  territory?: string
}

interface Submission {
  id: string
  name: string
  type: SubmissionType
  status: SubmissionStatus
  submittedDate: string
  dueDate: string
  client: string
  reference: string
  premium: string
  description: string
  documents: {
    name: string
    type: string
    size: string
    uploadedAt: string
  }[]
  messages: {
    sender: string
    content: string
    timestamp: string
  }[]
  history: {
    action: string
    user: string
    timestamp: string
    notes?: string
  }[]
  // Optional type-specific details
  proportionalDetails?: ProportionalDetails
  nonProportionalDetails?: NonProportionalDetails
  treatyDetails?: TreatyDetails
}

// Mock data for proportional submission
const mockProportionalSubmission: Submission = {
  id: '123457',
  name: 'Manufacturing Plant Insurance',
  type: 'Proportional',
  status: 'In Review',
  submittedDate: '2023-10-20',
  dueDate: '2023-11-20',
  client: 'XYZ Manufacturing',
  reference: 'REF-2023-002',
  premium: '$280,000',
  description: 'Quota share arrangement for the manufacturing plant covering machinery breakdown, business interruption, and property damage. The arrangement includes multiple locations across three states.',
  documents: [
    { name: 'Plant Risk Assessment.pdf', type: 'PDF', size: '3.1 MB', uploadedAt: '2023-10-20' },
    { name: 'Machinery Schedule.xlsx', type: 'XLSX', size: '2.2 MB', uploadedAt: '2023-10-20' },
    { name: 'Claims History.pdf', type: 'PDF', size: '1.7 MB', uploadedAt: '2023-10-19' },
    { name: 'Business Continuity Plan.pdf', type: 'PDF', size: '4.3 MB', uploadedAt: '2023-10-18' }
  ],
  messages: [
    { sender: 'Jane Broker', content: 'Submitted the quota share arrangement for review.', timestamp: '2023-10-20 11:15' },
    { sender: 'Robert Underwriter', content: 'Looking at the submission now. The machinery schedule looks comprehensive.', timestamp: '2023-10-21 09:45' },
    { sender: 'Robert Underwriter', content: 'Can you provide more information about the loss prevention measures at the main facility?', timestamp: '2023-10-22 14:30' },
    { sender: 'Jane Broker', content: 'I\'ve added the fire suppression system documentation to the documents section.', timestamp: '2023-10-23 10:05' }
  ],
  history: [
    { action: 'Submission Created', user: 'Jane Broker', timestamp: '2023-10-18 13:45' },
    { action: 'Documents Uploaded', user: 'Jane Broker', timestamp: '2023-10-19 14:30' },
    { action: 'Submission Sent', user: 'Jane Broker', timestamp: '2023-10-20 11:15' },
    { action: 'Under Review', user: 'Robert Underwriter', timestamp: '2023-10-21 09:45', notes: 'Initial review started' }
  ],
  proportionalDetails: {
    reinsured: 'XYZ Manufacturing',
    insured: 'XYZ Manufacturing Corp.',
    classOfBusiness: 'Property',
    businessOccupation: 'Manufacturing - Automotive Parts',
    riskCountry: 'United States',
    quoteRequiredPercentage: '40%',
    sumInsured: '10,000,000',
    reinsurer_rating: 'A+',
    startDate: '2023-11-01',
    endDate: '2024-10-31',
    documentTypes: {
      lossHistory: true,
      surveyReport: true,
      rationalFireDesign: false,
      complianceLetter: true,
      sumInsuredCalculations: true
    }
  }
}

// Mock data for non-proportional submission
const mockNonProportionalSubmission: Submission = {
  id: '123456',
  name: 'Property Insurance - Office Building',
  type: 'Non-Proportional',
  status: 'pending',
  submittedDate: '2023-10-15',
  dueDate: '2023-11-15',
  client: 'ABC Corporation',
  reference: 'REF-2023-001',
  premium: '$125,000',
  description: 'Property insurance coverage for the corporate headquarters building, including fire, flood, and earthquake protection. The building is valued at $10M with contents valued at $2M.',
  documents: [
    { name: 'Risk Assessment Report.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2023-10-15' },
    { name: 'Building Valuation.xlsx', type: 'XLSX', size: '1.8 MB', uploadedAt: '2023-10-15' },
    { name: 'Property Photos.zip', type: 'ZIP', size: '15.2 MB', uploadedAt: '2023-10-14' },
    { name: 'Insurance Application.pdf', type: 'PDF', size: '3.1 MB', uploadedAt: '2023-10-13' }
  ],
  messages: [
    { sender: 'John Broker', content: 'Submitted the application for review.', timestamp: '2023-10-15 09:30' },
    { sender: 'Sarah Underwriter', content: 'Received the submission. I\'ll review it and get back to you.', timestamp: '2023-10-16 14:15' },
    { sender: 'Sarah Underwriter', content: 'I need additional information about the fire protection systems. Can you provide more details?', timestamp: '2023-10-17 11:45' },
    { sender: 'John Broker', content: 'I\'ve attached the fire safety report in the documents section.', timestamp: '2023-10-18 10:20' }
  ],
  history: [
    { action: 'Submission Created', user: 'John Broker', timestamp: '2023-10-13 15:30' },
    { action: 'Documents Uploaded', user: 'John Broker', timestamp: '2023-10-14 10:45' },
    { action: 'Submission Sent', user: 'John Broker', timestamp: '2023-10-15 09:30' },
    { action: 'Under Review', user: 'Sarah Underwriter', timestamp: '2023-10-16 14:30', notes: 'Initial review started' }
  ],
  nonProportionalDetails: {
    reinsured: 'ABC Corporation',
    insured: 'ABC Holdings LLC',
    classOfBusiness: 'Property',
    businessOccupation: 'Corporate Office',
    riskCountry: 'United States',
    sumInsured: '12,000,000',
    reinsuranceLayer: '5,000,000',
    primaryLayer: '7,000,000',
    reinsurer_rating: 'A++',
    startDate: '2023-11-01',
    endDate: '2024-10-31',
    documentTypes: {
      lossHistory: true,
      surveyReport: true,
      rationalFireDesign: true,
      complianceLetter: true,
      sumInsuredCalculations: false
    }
  }
}

// Mock data for treaty submission
const mockTreatySubmission: Submission = {
  id: '123458',
  name: 'Property Catastrophe XL Treaty',
  type: 'Treaty',
  status: 'Quoted',
  submittedDate: '2023-10-12',
  dueDate: '2023-11-10',
  client: 'Regional Insurance Group',
  reference: 'REF-2023-003',
  premium: '$1,200,000',
  description: 'Property catastrophe excess of loss treaty covering wind, flood, and earthquake perils. The treaty has three layers with varying attachment points and limits.',
  documents: [
    { name: 'Treaty Slip.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: '2023-10-12' },
    { name: 'Exposure Analysis.xlsx', type: 'XLSX', size: '3.6 MB', uploadedAt: '2023-10-11' },
    { name: 'Claims Experience.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2023-10-10' },
    { name: 'Catastrophe Modeling.pdf', type: 'PDF', size: '8.2 MB', uploadedAt: '2023-10-09' }
  ],
  messages: [
    { sender: 'Mark Broker', content: 'Submitted the treaty proposal for review.', timestamp: '2023-10-12 14:20' },
    { sender: 'Lisa Underwriter', content: 'I\'ve started reviewing the catastrophe modeling results.', timestamp: '2023-10-13 10:30' },
    { sender: 'Lisa Underwriter', content: 'The modeling looks good, but I need more information about historical losses in Zone 3.', timestamp: '2023-10-15 11:45' },
    { sender: 'Mark Broker', content: 'I\'ve provided the additional loss data for Zone 3 in the documents section.', timestamp: '2023-10-16 09:15' },
    { sender: 'Lisa Underwriter', content: 'Thank you. I\'ve prepared a quote for the treaty based on the revised analysis.', timestamp: '2023-10-18 15:30' }
  ],
  history: [
    { action: 'Submission Created', user: 'Mark Broker', timestamp: '2023-10-09 11:20' },
    { action: 'Documents Uploaded', user: 'Mark Broker', timestamp: '2023-10-10 16:15' },
    { action: 'Submission Sent', user: 'Mark Broker', timestamp: '2023-10-12 14:20' },
    { action: 'Under Review', user: 'Lisa Underwriter', timestamp: '2023-10-13 10:30', notes: 'Initial review started' },
    { action: 'Additional Information Requested', user: 'Lisa Underwriter', timestamp: '2023-10-15 11:45' },
    { action: 'Information Provided', user: 'Mark Broker', timestamp: '2023-10-16 09:15' },
    { action: 'Quote Provided', user: 'Lisa Underwriter', timestamp: '2023-10-18 15:30' }
  ],
  treatyDetails: {
    name: 'Property Catastrophe XL Treaty',
    client: 'Regional Insurance Group',
    type: 'Property',
    premium: '$1,200,000',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: 'Property catastrophe excess of loss treaty covering wind, flood, and earthquake perils.',
    layers: 3,
    territory: 'Eastern United States'
  }
}

function getStatusIcon(status: string) {
  switch(status.toLowerCase()) {
    case 'approved':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
    case 'rejected':
      return <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
    case 'pending':
    case 'submitted':
      return <ClockIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
    case 'in review':
    case 'under review':
      return <ArrowPathIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
    default:
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
  }
}

export default function SubmissionDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  
  useEffect(() => {
    // In a real application, you would fetch the submission data from an API
    // For this demo, we'll use the mock data based on the ID
    if (params.id === '123456') {
      setSubmission(mockNonProportionalSubmission)
    } else if (params.id === '123457') {
      setSubmission(mockProportionalSubmission)
    } else if (params.id === '123458') {
      setSubmission(mockTreatySubmission)
    } else {
      // Default to non-proportional if ID is not recognized
      setSubmission(mockNonProportionalSubmission)
    }
    setLoading(false)
  }, [params.id])

  // Button action handlers
  const handleProcessSubmission = () => {
    if (!submission) return
    const updatedSubmission = { ...submission, status: 'In Review' as SubmissionStatus }
    setSubmission(updatedSubmission)
    
    // Add to history
    const historyEntry = {
      action: 'Processing Started',
      user: 'Current User',
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5)
    }
    updatedSubmission.history = [historyEntry, ...updatedSubmission.history]
    
    // In a real app, you would make an API call here
    alert('Submission is now being processed')
  }
  
  const handleProvideQuote = () => {
    if (!submission) return
    const updatedSubmission = { ...submission, status: 'Quoted' as SubmissionStatus }
    setSubmission(updatedSubmission)
    
    // Add to history
    const historyEntry = {
      action: 'Quote Provided',
      user: 'Current User',
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5)
    }
    updatedSubmission.history = [historyEntry, ...updatedSubmission.history]
    
    // In a real app, you would make an API call here
    alert('Quote has been provided')
  }
  
  const handleUpdateSubmission = () => {
    setShowUpdateModal(true)
    // In a real app, this would open a form to update the submission
    alert('Update submission functionality would open a form here')
  }
  
  const handleDownloadDocuments = () => {
    // In a real app, this would trigger downloads of all documents
    alert('Downloading all documents...')
  }
  
  const handleGenerateReport = () => {
    // In a real app, this would generate a PDF report
    alert('Generating submission report...')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-900">Submission Not Found</h1>
        <p className="mt-2 text-gray-600">The submission you're looking for doesn't exist or has been removed.</p>
        <Link 
          href="/submissions" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Submissions
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            href="/submissions" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Submissions
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{submission.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Reference:</span>
                  <span className="font-medium text-gray-900">{submission.reference}</span>
                </div>
                <div className="mx-2 text-gray-300">|</div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Type:</span>
                  <span className="font-medium text-gray-900">{submission.type}</span>
                </div>
                <div className="mx-2 text-gray-300">|</div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Status:</span>
                  <div className="flex items-center">
                    {getStatusIcon(submission.status)}
                    <span className="ml-1 font-medium text-gray-900">{submission.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {submission.status === 'pending' && (
                <button
                  type="button"
                  onClick={handleProcessSubmission}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Process Submission
                </button>
              )}
              {submission.status === 'In Review' && (
                <button
                  type="button"
                  onClick={handleProvideQuote}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Provide Quote
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Submission Details</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-gray-700">{submission.description}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Client</div>
                      <div className="text-sm font-medium text-gray-900">{submission.client}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Premium</div>
                      <div className="text-sm font-medium text-gray-900">{submission.premium}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Submitted</div>
                      <div className="text-sm font-medium text-gray-900">{submission.submittedDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Due Date</div>
                      <div className="text-sm font-medium text-gray-900">{submission.dueDate}</div>
                    </div>
                  </div>
                </div>

                {/* Type-specific details */}
                {(submission.proportionalDetails || submission.nonProportionalDetails || submission.treatyDetails) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-base font-medium text-gray-900 mb-4">
                      {submission.type} Details
                    </h4>
                    
                    {submission.proportionalDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                          <div className="text-sm text-gray-500">Reinsured</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.reinsured}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Insured</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.insured}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Class of Business</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.classOfBusiness}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Business Occupation</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.businessOccupation}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Risk Country</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.riskCountry}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Quote Required Percentage</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.quoteRequiredPercentage}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Sum Insured</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.sumInsured}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Reinsurer Rating</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.reinsurer_rating}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.startDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">End Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.endDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Document Types</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.proportionalDetails.documentTypes.lossHistory ? 'Loss History, ' : ''}
                            {submission.proportionalDetails.documentTypes.surveyReport ? 'Survey Report, ' : ''}
                            {submission.proportionalDetails.documentTypes.rationalFireDesign ? 'Rational Fire Design, ' : ''}
                            {submission.proportionalDetails.documentTypes.complianceLetter ? 'Compliance Letter, ' : ''}
                            {submission.proportionalDetails.documentTypes.sumInsuredCalculations ? 'Sum Insured Calculations' : ''}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {submission.nonProportionalDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                          <div className="text-sm text-gray-500">Reinsured</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.reinsured}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Insured</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.insured}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Class of Business</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.classOfBusiness}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Business Occupation</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.businessOccupation}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Risk Country</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.riskCountry}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Sum Insured</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.sumInsured}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Reinsurance Layer</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.reinsuranceLayer}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Primary Layer</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.primaryLayer}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Reinsurer Rating</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.reinsurer_rating}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.startDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">End Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.endDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Document Types</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.nonProportionalDetails.documentTypes.lossHistory ? 'Loss History, ' : ''}
                            {submission.nonProportionalDetails.documentTypes.surveyReport ? 'Survey Report, ' : ''}
                            {submission.nonProportionalDetails.documentTypes.rationalFireDesign ? 'Rational Fire Design, ' : ''}
                            {submission.nonProportionalDetails.documentTypes.complianceLetter ? 'Compliance Letter, ' : ''}
                            {submission.nonProportionalDetails.documentTypes.sumInsuredCalculations ? 'Sum Insured Calculations' : ''}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {submission.treatyDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                          <div className="text-sm text-gray-500">Name</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Client</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.client}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.type}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Premium</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.premium}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.startDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">End Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.endDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Description</div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.treatyDetails.description}
                          </div>
                        </div>
                        {submission.treatyDetails.layers && (
                          <div>
                            <div className="text-sm text-gray-500">Layers</div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.treatyDetails.layers}
                            </div>
                          </div>
                        )}
                        {submission.treatyDetails.territory && (
                          <div>
                            <div className="text-sm text-gray-500">Territory</div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.treatyDetails.territory}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload Document
                </button>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {submission.documents.map((doc, index) => (
                    <li key={index} className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.type} • {doc.size} • Uploaded on {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-xs text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Messages</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {submission.messages.map((message, index) => (
                    <li key={index} className="px-4 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                            <p className="text-xs text-gray-500">{message.timestamp}</p>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-4 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <textarea
                        rows={3}
                        name="message"
                        id="message"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Add a message..."
                      />
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - right 1/3 */}
          <div className="space-y-8">
            {/* Status timeline */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Activity Timeline</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {submission.history.map((event, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== submission.history.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-100">
                                <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900">{event.action}</p>
                                {event.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{event.notes}</p>
                                )}
                              </div>
                              <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                <div>{event.user}</div>
                                <time>{event.timestamp}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleUpdateSubmission}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Submission
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadDocuments}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Download All Documents
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 