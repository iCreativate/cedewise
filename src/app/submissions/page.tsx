'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const statusIcons: Record<string, any> = {
  Submitted: ClockIcon,
  'Under Review': ArrowPathIcon,
  Approved: CheckCircleIcon,
  Rejected: XCircleIcon,
}

const statusColors: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
}

// Define the types for our submission data
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'Approved' | 'Rejected' | 'Pending' | 'In Review' | 'Quoted' | 'Submitted' | 'Under Review'

interface Submission {
  id: string
  type: string
  name: string
  submittedDate: string
  dueDate: string
  status: SubmissionStatus
  client: string
  reference: string
  premium: string
  underwriter?: string
  dateSubmitted?: string // Add this field to match the sort field
}

// Mock data for submissions
const submissions: Submission[] = [
  {
    id: '123456',
    type: 'Non-Proportional',
    name: 'Property Insurance - Office Building',
    submittedDate: '2023-10-15',
    dueDate: '2023-11-15',
    status: 'pending',
    client: 'ABC Corporation',
    reference: 'REF-2023-001',
    premium: '$125,000',
    underwriter: 'Sarah Underwriter'
  },
  {
    id: '123457',
    type: 'Proportional',
    name: 'Manufacturing Plant Insurance',
    submittedDate: '2023-10-20',
    dueDate: '2023-11-20',
    status: 'In Review',
    client: 'XYZ Manufacturing',
    reference: 'REF-2023-002',
    premium: '$280,000',
    underwriter: 'Robert Underwriter'
  },
  {
    id: '123458',
    type: 'Treaty',
    name: 'Property Catastrophe XL Treaty',
    submittedDate: '2023-10-12',
    dueDate: '2023-11-10',
    status: 'Quoted',
    client: 'Regional Insurance Group',
    reference: 'REF-2023-003',
    premium: '$1,200,000',
    underwriter: 'Lisa Underwriter'
  },
  {
    id: '4',
    type: 'Facultative',
    name: 'Energy Platform Cover',
    submittedDate: '2023-10-10',
    dueDate: '2023-10-25',
    status: 'pending',
    client: 'PowerGen Industries',
    reference: 'SUB-2023-004',
    premium: '$2,000,000',
  },
  {
    id: '5',
    type: 'Treaty',
    name: 'Aviation Fleet Program',
    submittedDate: '2023-10-05',
    dueDate: '2023-10-20',
    status: 'approved',
    client: 'Sky Airlines',
    reference: 'SUB-2023-005',
    premium: '$1,850,000',
    underwriter: 'Emily Thompson'
  }
]

// Helper function to get the status icon
function getStatusIcon(status: SubmissionStatus) {
  switch (status) {
    case 'pending':
      return <ClockIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
    case 'approved':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
    case 'rejected':
      return <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
    default:
      return null
  }
}

// Status badge component
const StatusBadge = ({ status }: { status: Submission['status'] }) => {
  let color, icon;
  
  switch (status) {
    case 'Approved':
      color = 'bg-green-100 text-green-800';
      icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
      break;
    case 'Rejected':
      color = 'bg-red-100 text-red-800';
      icon = <XCircleIcon className="h-4 w-4 mr-1" />;
      break;
    case 'Pending':
      color = 'bg-yellow-100 text-yellow-800';
      icon = <ClockIcon className="h-4 w-4 mr-1" />;
      break;
    case 'In Review':
      color = 'bg-blue-100 text-blue-800';
      icon = <ArrowPathIcon className="h-4 w-4 mr-1" />;
      break;
    case 'Quoted':
      color = 'bg-purple-100 text-purple-800';
      icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      icon = null;
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {icon}
      {status}
    </span>
  );
};

export default function SubmissionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'All'>('All')
  const [typeFilter, setTypeFilter] = useState<Submission['type'] | 'All'>('All')
  const [sortField, setSortField] = useState<keyof Submission>('submittedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState('all')

  // Function to filter and sort the submissions
  const filteredAndSortedSubmissions = submissions
    .filter(submission => {
      // Filter by search query
      const matchesSearch = submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.reference.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by status
      const matchesStatus = statusFilter === 'All' || 
        submission.status.toLowerCase() === statusFilter.toLowerCase()

      // Filter by type
      const matchesType = typeFilter === 'All' || submission.type === typeFilter

      // Active tab filter
      const matchesTab = 
        (activeTab === 'all') ||
        (activeTab === 'pending' && submission.status.toLowerCase() === 'pending') ||
        (activeTab === 'approved' && submission.status.toLowerCase() === 'approved') ||
        (activeTab === 'rejected' && submission.status.toLowerCase() === 'rejected')

      return matchesSearch && matchesStatus && matchesType && matchesTab
    })
    .sort((a, b) => {
      // Handle sort fields
      const fieldA = a[sortField]
      const fieldB = b[sortField]

      if (fieldA === undefined || fieldB === undefined) return 0

      // String comparison
      const comparison = String(fieldA).localeCompare(String(fieldB))
      return sortDirection === 'asc' ? comparison : -comparison
    })

  // Function to handle sorting when a column header is clicked
  const handleSort = (field: keyof Submission) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // If sorting by a new field, default to descending
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Function to handle submission click
  const handleSubmissionClick = (id: string) => {
    router.push(`/submissions/${id}`)
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Submissions</h1>
          <Link 
            href="/non-life/broker"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            New Submission
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'all' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'pending' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'approved' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'rejected' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Rejected
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <div>
              <label htmlFor="status-filter" className="sr-only">
                Filter by Status
              </label>
              <select
                id="status-filter"
                name="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as SubmissionStatus | 'All')
                  // Update active tab if needed
                  if (e.target.value === 'pending') setActiveTab('pending')
                  else if (e.target.value === 'approved') setActiveTab('approved')
                  else if (e.target.value === 'rejected') setActiveTab('rejected')
                  else if (e.target.value === 'All') setActiveTab('all')
                }}
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="In Review">In Review</option>
                <option value="Quoted">Quoted</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="type-filter" className="sr-only">
                Filter by Type
              </label>
              <select
                id="type-filter"
                name="type-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as Submission['type'] | 'All')}
              >
                <option value="All">All Types</option>
                <option value="Treaty">Treaty</option>
                <option value="Facultative">Facultative</option>
                <option value="Proportional">Proportional</option>
                <option value="Non-Proportional">Non-Proportional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Submission Name
                          {sortField === 'name' && (
                            sortDirection === 'asc' 
                              ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                              : <ArrowDownIcon className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center">
                          Type
                          {sortField === 'type' && (
                            sortDirection === 'asc' 
                              ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                              : <ArrowDownIcon className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('client')}
                      >
                        <div className="flex items-center">
                          Client
                          {sortField === 'client' && (
                            sortDirection === 'asc' 
                              ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                              : <ArrowDownIcon className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('submittedDate')}
                      >
                        <div className="flex items-center">
                          Submitted Date
                          {sortField === 'submittedDate' && (
                            sortDirection === 'asc' 
                              ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                              : <ArrowDownIcon className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('dueDate')}
                      >
                        <div className="flex items-center">
                          Due Date
                          {sortField === 'dueDate' && (
                            sortDirection === 'asc' 
                              ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                              : <ArrowDownIcon className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {sortField === 'status' && (
                            sortDirection === 'asc' 
                              ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                              : <ArrowDownIcon className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No submissions found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedSubmissions.map((submission) => (
                        <tr 
                          key={submission.id}
                          onClick={() => handleSubmissionClick(submission.id)}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                            {submission.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.submittedDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.dueDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(submission.status)}
                              <span className="ml-1.5 text-sm text-gray-900">
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 