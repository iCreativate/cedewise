'use client';

import React, { useState } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MagnifyingGlassIcon, 
  DocumentArrowDownIcon, 
  TableCellsIcon,
  FunnelIcon,
  XMarkIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { formatLargeCurrency } from '@/utils/currency';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ClassOfBusinessChart from '@/components/Analytics/ClassOfBusinessChart';
import { Menu, Transition, Tab, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import BrokerSubmissionRow from '@/components/BrokerSubmissionRow';
import ReinsurerSubmissionForm from '@/components/ReinsurerSubmissionForm';
import DocumentUpload from '@/components/DocumentUpload';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#E5E7EB',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

// Chart data
const monthlySubmissions = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Submissions',
      data: [42, 35, 48, 65, 53, 47],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.3,
      fill: true,
    },
  ],
};

// Add these types before the component definition

interface SearchFilters {
  cedingCoBroker: string;
  insuredName: string;
  refNo: string;
  classOfBusiness: string;
  riskCountry: string;
  remainingShare: string;
  periodOfInsurance: string;
}

interface Submission {
  id: number;
  company: string;
  insured: string;
  brokerName: string;
  policyNo: string;
  riskCountry: string;
  classOfBusiness: string;
  businessOccupation: string;
  sumInsured: number;
  status: string;
  remainingShare: number;
  premiumRate: string;
  premiumAmount: string;
  commission: string;
  reinsurer_rating: string;
  startDate: string;
  endDate: string;
  description: string;
  reinsurers: {
    name: string;
    quotedShare: number;
    premium: number;
  }[];
  documents: string[];
}

interface DashboardProps {
  facultativeData: Submission[];
  proportionalFacData: Submission[];
  nonProportionalFacData: Submission[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleExport: () => void;
}

interface ClassOfBusinessChartProps {
  data: {
    classOfBusiness: string;
    count: number;
    percentage: number;
  }[];
}

interface BrokerSubmissionRowProps {
  submission: Submission;
  type: 'proportional' | 'nonProportional';
}

// Add these helper functions before the component definition

const calculateClassDistribution = (submissions: Submission[]) => {
  const classCount = submissions.reduce((acc, submission) => {
    const classOfBusiness = submission.classOfBusiness;
    acc[classOfBusiness] = (acc[classOfBusiness] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(classCount).reduce((sum, count) => sum + count, 0);

  return Object.entries(classCount).map(([classOfBusiness, count]) => ({
    classOfBusiness,
    count,
    percentage: (count / total) * 100
  }));
};

// Move ActivityFeed component before the main component and export it
export const ActivityFeed: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <p className="mt-1 text-sm text-gray-500">Track your latest interactions and updates</p>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Filter
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                View All
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 bg-white">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">Quote Accepted</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Success
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Your quote for Santam's mining facility was accepted</p>
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Premium:</span> R 10,437,500 | <span className="font-medium">Share:</span> 25%
                </div>
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                  <time dateTime="2023-03-16T13:00">Today at 1:00 PM</time>
                  <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>By John Smith</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">New Submission</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">AON submitted a new proportional FAC risk</p>
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Risk:</span> SA Commercial Properties | <span className="font-medium">Sum Insured:</span> R 850,000,000
                </div>
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                  <time dateTime="2023-03-16T10:30">Today at 10:30 AM</time>
                  <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>By Sarah Johnson</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">Document Uploaded</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Update
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Supporting documents added to Coastal Properties quote</p>
                <div className="mt-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Flood Assessment Report.pdf</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                  <time dateTime="2023-03-15T15:45">Yesterday at 3:45 PM</time>
                  <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>By Michael Chen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Showing recent 3 activities</span>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View Activity Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export const ReinsurerDashboard: React.FC<DashboardProps> = ({
  facultativeData,
  proportionalFacData,
  nonProportionalFacData,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  handleExport,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    cedingCoBroker: '',
    insuredName: '',
    refNo: '',
    classOfBusiness: '',
    riskCountry: '',
    remainingShare: '',
    periodOfInsurance: ''
  });

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setSearchFilters((prev: SearchFilters) => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      cedingCoBroker: '',
      insuredName: '',
      refNo: '',
      classOfBusiness: '',
      riskCountry: '',
      remainingShare: '',
      periodOfInsurance: ''
    });
  };

  // Calculate stats
  const totalSubmissions = proportionalFacData.length + nonProportionalFacData.length;
  const activeSubmissions = facultativeData.filter((item: Submission) => item.status === 'Active').length;
  const pendingRenewals = facultativeData.filter((item: Submission) => item.status === 'Pending Renewal').length;
  
  // Updated totalPremium calculation with null checks
  const totalPremium = facultativeData.reduce((sum: number, item: Submission) => {
    if (!item?.premiumAmount) return sum;
    // Remove currency symbols and spaces, then parse
    const cleanAmount = item.premiumAmount.replace(/[^0-9.-]+/g, '');
    const amount = parseFloat(cleanAmount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleFileUploaded = (fileData: any) => {
    console.log('File uploaded:', fileData);
    if (fileData.error) {
      setUploadError(fileData.error);
    } else {
      setUploadError(null);
      // Here you can handle the uploaded file data
      // For example, update the UI or send to an API
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Document Upload Modal */}
      <Transition appear show={isUploadModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsUploadModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    Upload Documents
                    <button
                      onClick={() => setIsUploadModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  <div className="mt-4">
                    {uploadError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{uploadError}</p>
                      </div>
                    )}
                    <DocumentUpload
                      bucketName="cedewise-documents"
                      folderPath="reinsurer-uploads"
                      multiple={true}
                      onFileUploaded={handleFileUploaded}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Supported file types: PDF, Word, Excel, Images (up to 10MB each)
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Broker/Insurer Submissions</h1>
            <p className="mt-2 text-blue-100">Manage submissions and analyze portfolio performance</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload Documents
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200 bg-gray-50">
            <Tab className={({ selected }) =>
              `py-4 px-6 text-sm font-medium transition-colors flex items-center ${
                selected ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-blue-600'
              }`
            }>
              Analytics
            </Tab>
            <Tab className={({ selected }) =>
              `py-4 px-6 text-sm font-medium transition-colors flex items-center ${
                selected ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-blue-600'
              }`
            }>
              Broker/Insurer Submissions
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Analytics Panel */}
            <Tab.Panel className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* New Submissions */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                  <div className="flex items-center mb-2">
                    <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-lg font-semibold text-gray-800">New Submissions</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">7</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-500">This Week</span>
                    <span className="text-blue-600 font-medium">+4 from last week</span>
                  </div>
                </div>
                {/* Pending Renewals */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                  <div className="flex items-center mb-2">
                    <ClockIcon className="h-6 w-6 text-yellow-500 mr-2" />
                    <span className="text-lg font-semibold text-gray-800">Pending Renewals</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">1</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-500">Due Soon</span>
                    <span className="text-orange-600 font-medium">2 Urgent</span>
                  </div>
                </div>
                {/* Active Policies */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                    <span className="text-lg font-semibold text-gray-800">Active Policies</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">4</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-500">Total Premium</span>
                    <span className="text-green-600 font-medium">R 25M</span>
                  </div>
                </div>
                {/* Country Distribution (replaces Total Premium) */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                  <div className="flex items-center mb-2">
                    <UserGroupIcon className="h-6 w-6 text-indigo-500 mr-2" />
                    <span className="text-lg font-semibold text-gray-800">Country Distribution</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{
                    Array.from(new Set([
                      ...facultativeData,
                      ...proportionalFacData,
                      ...nonProportionalFacData
                    ].map(s => s.riskCountry))).length
                  }</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-500">Active Countries</span>
                    <span className="text-indigo-600 font-medium">Distribution</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Class of Business Distribution */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Class of Business Distribution</h3>
                  <div className="h-64">
                    <ClassOfBusinessChart data={calculateClassDistribution([...facultativeData, ...proportionalFacData, ...nonProportionalFacData])} />
                  </div>
                </div>
                {/* Submissions by Period */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Submissions by Period</h3>
                  <div className="h-64">
                    <Bar options={chartOptions} data={monthlySubmissions} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div>
                      <span className="block text-blue-600 font-bold">0</span>
                      <span className="text-xs text-gray-500">Recent Submissions</span>
                    </div>
                    <div>
                      <span className="block text-yellow-600 font-bold">0</span>
                      <span className="text-xs text-gray-500">Medium Term</span>
                    </div>
                    <div>
                      <span className="block text-red-600 font-bold">12</span>
                      <span className="text-xs text-gray-500">Older Submissions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Upcoming Renewals Row */}
              <div className="space-y-6">
                {/* Recent Activity (full width) */}
                <div>
                  <div className="bg-white rounded-xl shadow p-6">
                    <ActivityFeed />
                  </div>
                </div>
                {/* Upcoming Renewals (full width, below Recent Activity) */}
                <div>
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Renewals</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-yellow-800">Tech Manufacturing Co.</span>
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Urgent</span>
                        </div>
                        <div className="text-xs text-gray-600">Due in 15 days</div>
                        <div className="text-xs text-gray-800">Sum Insured: R 750,000,000</div>
                      </div>
                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-blue-800">Ocean Shipping Inc.</span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Medium</span>
                        </div>
                        <div className="text-xs text-gray-600">Due in 30 days</div>
                        <div className="text-xs text-gray-800">Sum Insured: R 350,000,000</div>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-gray-800">Commercial Properties Ltd</span>
                          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">Standard</span>
                        </div>
                        <div className="text-xs text-gray-600">Due in 60 days</div>
                        <div className="text-xs text-gray-800">Sum Insured: R 850,000,000</div>
                      </div>
                    </div>
                    <button className="mt-4 w-full text-center text-indigo-600 hover:underline font-medium">View All Renewals</button>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Broker/Insurer Submissions Panel */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                {/* Header with Actions */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Broker/Insurer Submissions</h2>
                    <p className="mt-1 text-sm text-gray-500">View and manage all incoming submissions</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Filters
                    </button>
                    <button
                      onClick={handleExport}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="cedingCoBroker" className="block text-sm font-medium text-gray-700">
                          Ceding Co/Broker
                        </label>
                        <input
                          type="text"
                          id="cedingCoBroker"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={searchFilters.cedingCoBroker}
                          onChange={(e) => handleFilterChange('cedingCoBroker', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="classOfBusiness" className="block text-sm font-medium text-gray-700">
                          Class of Business
                        </label>
                        <input
                          type="text"
                          id="classOfBusiness"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={searchFilters.classOfBusiness}
                          onChange={(e) => handleFilterChange('classOfBusiness', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="riskCountry" className="block text-sm font-medium text-gray-700">
                          Risk Country
                        </label>
                        <input
                          type="text"
                          id="riskCountry"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={searchFilters.riskCountry}
                          onChange={(e) => handleFilterChange('riskCountry', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submissions Navigation */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setActiveTab('proportional')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'proportional'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Proportional
                        </button>
                        <button
                          onClick={() => setActiveTab('non-proportional')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'non-proportional'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Non-Proportional
                        </button>
                      </div>
                      <div className="flex items-center w-72">
                        <div className="relative w-full">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search submissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submissions Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-max divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                            Broker
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Ceding Company
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Policy Ref
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Insured
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Class of Business
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Business Occupation
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Start Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            End Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Risk Country
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Sum Insured
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Premium Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Premium Rate
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Commission
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Reinsurer Rating
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-gray-50 z-10">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(activeTab === 'proportional' ? proportionalFacData : nonProportionalFacData)
                          .map((submission) => (
                            <BrokerSubmissionRow 
                              key={submission.id} 
                              submission={submission} 
                              type={activeTab === 'proportional' ? 'proportional' : 'nonProportional'} 
                            />
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                          <span className="font-medium">20</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Previous</span>
                            Previous
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            1
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            2
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            3
                          </button>
                          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Next</span>
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};