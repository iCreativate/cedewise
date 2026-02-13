'use client'

import { useUser } from '@/context/UserContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UserGroupIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import RoleGuard from '@/components/RoleGuard'

const reinsuranceTypes = [
  {
    name: "Treaty Reinsurance",
    description: "Comprehensive coverage for groups of risks",
    icon: DocumentTextIcon,
    href: "/non-life/broker/treaty",
    stats: {
      activeTreaties: "12",
      totalPremium: "$24.5M",
      growth: "+8.1%",
      positivity: true
    }
  },
  {
    name: "Facultative Reinsurance",
    description: "Coverage for individual, specific risks",
    icon: UserGroupIcon,
    href: "/non-life/broker/facultative",
    stats: {
      activeCases: "32",
      totalPremium: "$16.2M",
      growth: "+12.4%",
      positivity: true
    }
  }
]

const quickActions = [
  { 
    name: "Create New Treaty", 
    description: "Setup a new treaty reinsurance contract", 
    href: "/non-life/broker/treaty" 
  },
  { 
    name: "Submit Proportional Facultative", 
    description: "Submit a new proportional facultative case", 
    href: "/non-life/broker/facultative/proportional" 
  },
  { 
    name: "Submit Non-Proportional Facultative", 
    description: "Submit a new non-proportional facultative case", 
    href: "/non-life/broker/facultative/non-proportional" 
  },
  { 
    name: "Submit Auto-Fac", 
    description: "Submit a new auto-facultative case", 
    href: "/non-life/broker/facultative/auto-fac" 
  },
]

const recentActivity = [
  { id: 1, type: "Facultative", name: "Property Fire", insured: "ABC Company", status: "Submitted", date: "2 hours ago", premium: 4250000 },
  { id: 2, type: "Treaty", name: "Property Quota Share Renewal", insured: "Multiple", status: "Approved", date: "1 day ago", premium: 12500000 },
  { id: 3, type: "Facultative", name: "Marine Cargo", insured: "XYZ Shipping", status: "Rejected", date: "2 days ago", premium: 3750000 },
  { id: 4, type: "Treaty", name: "Catastrophe XL Layer 1", insured: "Multiple", status: "Pending", date: "3 days ago", premium: 7250000 },
  { id: 5, type: "Facultative", name: "Office Complex", insured: "Prime Properties", status: "Quoted", date: "3 days ago", premium: 5250000 },
  { id: 6, type: "Facultative", name: "Manufacturing Plant", insured: "Industrial Co", status: "Submitted", date: "4 days ago", premium: 8250000 },
]

const pendingSubmissions = [
  { id: 1, name: "Offshore Oil Platform", insured: "Energy Corp", premium: 23000000, status: "Quoted", type: "Facultative", subtype: "Non-Proportional" },
  { id: 2, name: "Mining Operations", insured: "GoldEx Mining", premium: 18000000, status: "Pending Review", type: "Facultative", subtype: "Proportional" },
  { id: 3, name: "Manufacturing Plant", insured: "Industrial Bros", premium: 14500000, status: "Quoted", type: "Facultative", subtype: "Proportional" },
  { id: 4, name: "Shopping Mall Complex", insured: "Retail Group", premium: 19500000, status: "Pending Review", type: "Facultative", subtype: "Non-Proportional" },
  { id: 5, name: "Cargo Fleet", insured: "Ocean Transport", premium: 8700000, status: "Quoted", type: "Facultative", subtype: "Non-Proportional" },
]

function formatLargeCurrency(amount: number) {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  } else {
    return `$${amount}`;
  }
}

function BrokerPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeRiskTab, setActiveRiskTab] = useState('facultative')
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null)
  const [dashboardError, setDashboardError] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    console.log("BrokerPage mounted")
    
    // Cleanup function will run when component unmounts
    return () => {
      console.log("BrokerPage unmounted")
    }
  }, [])
  
  // Handle viewing treaty details
  const handleViewTreaty = (activityId: number) => {
    setSelectedActivity(activityId)
    router.push(`/non-life/broker/treaty/${activityId}`)
  }
  
  console.log("BrokerPage rendering with activeTab:", activeTab)

  // Safe rendering of dashboard content
  try {
  return (
      <div className="p-6 bg-gray-50">
        {/* Improved header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white p-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Broker Dashboard</h1>
          <p className="mt-2 text-blue-100 max-w-2xl">
            Manage your reinsurance portfolio and track performance metrics
          </p>
        </div>
        
        {/* Redesigned Tabs with better spacing and styling */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              className={`py-4 px-6 text-sm font-medium transition-colors flex items-center ${activeTab === 'dashboard' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Dashboard Overview
            </button>

            {/* New Analytics Tab */}
            <button
              className={`py-4 px-6 text-sm font-medium transition-colors flex items-center ${
                activeTab === 'analytics' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Analytics
            </button>

            {/* Broker/Insurer Submissions Section */}
            <div className="relative group">
              <button
                className={`py-4 px-6 text-sm font-medium transition-colors flex items-center ${
                  activeTab === 'submissions' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('submissions')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Broker/Insurer Submissions
              </button>
            </div>

            <button
              className={`py-4 px-6 text-sm font-medium transition-colors flex items-center ${activeTab === 'clients' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
              onClick={() => setActiveTab('clients')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Client Management
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && !dashboardError && (
          <>
            {/* Enhanced Key Metrics with better card styling */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Total Premium</h3>
                  <div className="p-2 bg-blue-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
        </div>
      </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold text-gray-900">{formatLargeCurrency(40700000)}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-green-600 font-medium">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      10.5% YTD
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Facultative</p>
                    <p className="text-sm font-semibold">{formatLargeCurrency(16200000)}</p>
                        </div>
                  <div>
                    <p className="text-xs text-gray-500">Treaty</p>
                    <p className="text-sm font-semibold">{formatLargeCurrency(24500000)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
                  <div className="p-2 bg-green-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold text-gray-900">76.4%</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-green-600 font-medium">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      4.2% vs last quarter
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Facultative</p>
                    <p className="text-sm font-semibold">72.8%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Treaty</p>
                    <p className="text-sm font-semibold">84.5%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Active Submissions</h3>
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold text-gray-900">44</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-blue-600 font-medium">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      8 new this month
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Facultative</p>
                    <p className="text-sm font-semibold">32</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Treaty</p>
                    <p className="text-sm font-semibold">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Pending Quotes</h3>
                  <div className="p-2 bg-amber-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-5a1 1 0 01-1 1H8a1 1 0 110-2h2V6a1 1 0 012 0v5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold text-gray-900">18</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-amber-600 font-medium">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      5 awaiting review
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Facultative</p>
                    <p className="text-sm font-semibold">13</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Treaty</p>
                    <p className="text-sm font-semibold">5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Section with Improved Card Design */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">4 actions available</span>
        </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="group flex flex-col justify-between h-full bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="w-12 h-12 mb-4 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="text-md font-semibold text-gray-900 mb-2 group-hover:text-blue-700">{action.name}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-blue-600 group-hover:text-blue-700 font-medium text-sm flex items-center">
                      Get started
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/non-life/broker/facultative"
                  className="group flex flex-col justify-between h-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-xl hover:shadow-md transition-all duration-200"
                >
        <div>
                    <div className="w-12 h-12 mb-4 rounded-full bg-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-md font-semibold text-blue-900 mb-2">Manage All Submissions</h3>
                    <p className="text-sm text-blue-700">View and manage all facultative submissions including FOC status</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-100 text-blue-700 font-medium text-sm flex items-center">
                    View all submissions
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activities Table with Modern Design */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveRiskTab('facultative')}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeRiskTab === 'facultative' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      Facultative
                    </button>
                    <button 
                      onClick={() => setActiveRiskTab('treaty')}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeRiskTab === 'treaty' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      Treaty
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Insured
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Premium
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentActivity
                        .filter(activity => 
                          (activeRiskTab === 'facultative' && activity.type === 'Facultative') || 
                          (activeRiskTab === 'treaty' && activity.type === 'Treaty')
                        )
                        .map((activity) => (
                          <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  activity.type === 'Facultative' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {activity.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{activity.insured}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatLargeCurrency(activity.premium)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                activity.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                activity.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                activity.status === 'Quoted' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'}`}>
                        {activity.status}
                      </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewTreaty(activity.id)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                          title="View details"
                        >
                                  <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                                  className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50 transition-colors"
                          title="Edit"
                        >
                                  <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <Link
                  href={activeRiskTab === 'facultative' ? "/non-life/broker/facultative" : "/non-life/broker/treaty"}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  View All {activeRiskTab === 'facultative' ? 'Facultative' : 'Treaty'} Submissions
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                    </div>
                  </div>
          </>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-8">
            {/* Broker/Insurer Submissions Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Broker/Insurer Submissions</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveRiskTab('facultative')}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeRiskTab === 'facultative' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      Facultative
                    </button>
                    <button 
                      onClick={() => setActiveRiskTab('treaty')}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeRiskTab === 'treaty' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      Treaty
                    </button>
                  </div>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingSubmissions
                      .filter(submission => 
                        (activeRiskTab === 'facultative' && submission.type === 'Facultative') || 
                        (activeRiskTab === 'treaty' && submission.type === 'Treaty')
                      )
                      .map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.insured}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatLargeCurrency(submission.premium)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              submission.status === 'Quoted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.subtype}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                                title="View details"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button 
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50 transition-colors"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Action Buttons */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Link
                      href="/non-life/broker/facultative/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      New Submission
                    </Link>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Filter:</span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search submissions..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && dashboardError && (
          <div className="p-6 bg-red-50 rounded-lg">
            <h2 className="text-lg font-medium text-red-800">Error in Dashboard</h2>
            <p className="mt-2 text-sm text-red-700">
              There was a problem rendering the dashboard content.
            </p>
            <button 
              onClick={() => {
                setDashboardError(false)
                setActiveTab('facultative')
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Switch to Facultative View
            </button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering broker dashboard:", error);
    if (!dashboardError) {
      setDashboardError(true);
    }
    return (
      <div className="p-6">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Broker Dashboard</h1>
        </div>
        <div className="p-6 bg-red-50 rounded-lg mt-4">
          <h2 className="text-lg font-medium text-red-800">Error in Dashboard</h2>
          <p className="mt-2 text-sm text-red-700">
            There was a problem rendering the dashboard content.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

export default function ProtectedBrokerPage() {
  const { userRole, isAuthenticated } = useUser()
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    console.log("ProtectedBrokerPage: Current auth state:", { userRole, isAuthenticated })
    
    // Set a timeout to ensure we've given authentication enough time to initialize
    setIsLoading(false)
    console.log("ProtectedBrokerPage: Finished loading, auth state:", { userRole, isAuthenticated })
  }, [userRole, isAuthenticated])
  
  // Error boundary
  useEffect(() => {
    // Error handler function
    const handleError = (error: ErrorEvent) => {
      console.error("Broker Page Error:", error)
      setHasError(true)
      setErrorMessage(error.error?.message || "An unknown error occurred")
    }
    
    // Add global error handler
    window.addEventListener('error', handleError)
    
    // Cleanup
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])
  
  // Show a loading state while the authentication state initializes
  if (isLoading) {
    console.log("ProtectedBrokerPage: Showing loading state")
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">Loading Broker Dashboard...</h1>
          <p className="mt-2 text-gray-600">Please wait while we prepare your data.</p>
        </div>
      </div>
    )
  }
  
  // Show error state if we caught an error
  if (hasError) {
    console.log("ProtectedBrokerPage: Showing error state:", errorMessage)
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-lg font-medium text-red-800">Error Loading Dashboard</h2>
        <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        <p className="mt-4 text-sm text-gray-700">
          Try refreshing the page or logging out and back in.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    )
  }
  
  // Direct access check - if not authenticated or wrong role, show a message instead of redirecting
  if (!isAuthenticated) {
    console.log("ProtectedBrokerPage: User not authenticated")
    return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-medium text-yellow-800">Authentication Required</h2>
        <p className="mt-2 text-sm text-yellow-700">
          You need to log in to access the Broker Dashboard.
        </p>
        <Link href="/auth/login" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Login
        </Link>
    </div>
  )
}

  if (userRole !== 'broker') {
    console.log("ProtectedBrokerPage: User has wrong role:", userRole)
  return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-medium text-yellow-800">Access Restricted</h2>
        <p className="mt-2 text-sm text-yellow-700">
          This dashboard is only accessible to broker users. Your current role is: {userRole || 'not set'}.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Main Dashboard
        </Link>
      </div>
    )
  }
  
  // If we get here, the user is authenticated and has the broker role
  console.log("ProtectedBrokerPage: Rendering BrokerPage component")
  try {
    return <BrokerPage />
  } catch (error) {
    console.error("Error rendering BrokerPage:", error)
    setHasError(true)
    setErrorMessage(error instanceof Error ? error.message : "An error occurred rendering the broker dashboard")
    return null
  }
} 