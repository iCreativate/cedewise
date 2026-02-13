'use client'

import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { formatLargeCurrency } from '@/utils/currency'
import CommissionBadge from '@/components/CommissionBadge'
import ClassOfBusinessChart from '@/components/Analytics/ClassOfBusinessChart'
import StatisticsCards from '@/components/Analytics/StatisticsCards'
import SubmissionsByPeriod from '@/components/Analytics/SubmissionsByPeriod'

// Function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export default function FacultativeSubmissionsPage() {
  // States for tab selection, search, filtering and data
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCommissionType, setSelectedCommissionType] = useState<string>('all');
  const [submissions, setSubmissions] = useState<{
    proportional: any[];
    nonProportional: any[];
  }>({
    proportional: [],
    nonProportional: []
  });
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Fetch submissions data
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call to fetch data from the backend
        // For demo purposes, we'll simulate the API call with sample data
        
        // Simulating an API delay
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProportionalData = [
          {
            id: 1,
            policyReferenceNumber: 'PRO-456789-1234',
            company: 'Santam',
            insured: 'Vulcan',
            brokerName: 'AON',
            classOfBusiness: 'Property',
            businessOccupation: 'Mining',
            riskCountry: 'Mozambique',
            quoteRequiredPercentage: '75%',
            reinsurerOfferPercentage: '25%',
            remainingShare: '50%',
            premiumRate: '2.5',
            premiumAmount: 'R 41,750,000',
            sumInsured: 'R 1,670,000,000',
            commission: '10%',
            commissionDisplay: '10%',
            isFOC: false,
            reinsurer_rating: 'A+',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'Pending Review',
            feedbackFromReinsurer: 'Reviewing the submission, will provide quote soon.',
            documents: ['Loss History', 'Survey Report', 'Rational Fire Design']
          },
          {
            id: 2,
            policyReferenceNumber: 'PRO-456790-5678',
            company: 'Discovery Insure',
            insured: 'Metro Rail',
            brokerName: 'Willis Towers',
            classOfBusiness: 'Engineering',
            businessOccupation: 'Rail Transport',
            riskCountry: 'South Africa',
            quoteRequiredPercentage: '60%',
            reinsurerOfferPercentage: '30%',
            remainingShare: '30%',
            premiumRate: '3.8',
            premiumAmount: 'R 95,000,000',
            sumInsured: 'R 2,500,000,000',
            commission: 'FOC',
            commissionDisplay: 'FOC',
            isFOC: true,
            reinsurer_rating: 'A',
            startDate: '2024-02-01',
            endDate: '2025-01-31',
            status: 'Quoted',
            feedbackFromReinsurer: 'Quote provided, awaiting your response.',
            documents: ['Compliance Letter', 'Sum Insured Calculations', 'Loss History']
          },
          {
            id: 3,
            policyReferenceNumber: 'PRO-456791-9012',
            company: 'Old Mutual',
            insured: 'Coastal Properties',
            brokerName: 'Marsh',
            classOfBusiness: 'Property',
            businessOccupation: 'Real Estate',
            riskCountry: 'Namibia',
            quoteRequiredPercentage: '70%',
            reinsurerOfferPercentage: '40%',
            remainingShare: '30%',
            premiumRate: '1.8',
            premiumAmount: 'R 14,040,000',
            sumInsured: 'R 780,000,000',
            commission: '7.5%',
            commissionDisplay: '7.5%',
            isFOC: false,
            reinsurer_rating: 'A++',
            startDate: '2024-01-01',
            endDate: '2025-01-01',
            status: 'Bound',
            feedbackFromReinsurer: 'Terms accepted, contract bound.',
            documents: ['Flood Risk Assessment', 'Property Valuation', 'Claims History']
          }
        ];

        const mockNonProportionalData = [
  {
    id: 1,
            policyReferenceNumber: 'NON-456789-1234',
            reinsured: 'Old Mutual',
            insured: 'Commercial Tower',
            brokerName: 'Marsh',
            classOfBusiness: 'Property',
            businessOccupation: 'Commercial Real Estate',
            riskCountry: 'Botswana',
            sumInsured: 'R 1,800,000,000',
            reinsuranceLayer: 'R 1,200,000,000',
            primaryLayer: 'R 600,000,000',
            premiumAmount: 'R 36,000,000',
            commission: 'FOC',
            commissionDisplay: 'FOC',
            isFOC: true,
            reinsurer_rating: 'A+',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
            status: 'Bound',
            feedbackFromReinsurer: 'Terms accepted, contract bound.',
            documents: ['Loss History', 'Rational Fire Design', 'Survey Report']
  },
  {
    id: 2,
            policyReferenceNumber: 'NON-456790-5678',
            reinsured: 'Hollard',
            insured: 'Manufacturing Plant',
            brokerName: 'AON',
            classOfBusiness: 'Property',
            businessOccupation: 'Manufacturing',
            riskCountry: 'South Africa',
            sumInsured: 'R 1,450,000,000',
            reinsuranceLayer: 'R 950,000,000',
            primaryLayer: 'R 500,000,000',
            premiumAmount: 'R 28,500,000',
            commission: '5.5%',
            commissionDisplay: '5.5%',
            isFOC: false,
            reinsurer_rating: 'A',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
            status: 'Pending Review',
            feedbackFromReinsurer: 'Under technical review. Will provide feedback within 48 hours.',
            documents: ['Survey Report', 'Compliance Letter', 'Sum Insured Calculations']
  },
  {
    id: 3,
            policyReferenceNumber: 'NON-456791-9012',
            reinsured: 'Santam',
            insured: 'Logistics Center',
            brokerName: 'Willis Towers',
            classOfBusiness: 'Engineering',
            businessOccupation: 'Logistics',
            riskCountry: 'Zimbabwe',
            sumInsured: 'R 950,000,000',
            reinsuranceLayer: 'R 650,000,000',
            primaryLayer: 'R 300,000,000',
            premiumAmount: 'R 19,000,000',
            commission: 'FOC',
            commissionDisplay: 'FOC',
            isFOC: true,
            reinsurer_rating: 'A-',
            startDate: '2024-02-15',
            endDate: '2025-02-14',
            status: 'Quoted',
            feedbackFromReinsurer: 'Offered terms with FOC, awaiting your response.',
            documents: ['Engineering Survey', 'Risk Assessment', 'Claims History']
          }
        ];

        setSubmissions({
          proportional: mockProportionalData,
          nonProportional: mockNonProportionalData
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Filter submissions based on search query, status and commission type
  const filteredSubmissions = {
    proportional: submissions.proportional.filter(submission => {
      // Filter by search query
      const matchesSearch = 
        submission.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.insured?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.classOfBusiness?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.riskCountry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.status?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        selectedStatus === 'all' || 
        submission.status?.toLowerCase() === selectedStatus.toLowerCase();
      
      // Filter by commission type
      const matchesCommissionType = 
        selectedCommissionType === 'all' || 
        (selectedCommissionType === 'foc' && submission.isFOC) ||
        (selectedCommissionType === 'standard' && !submission.isFOC);
      
      return matchesSearch && matchesStatus && matchesCommissionType;
    }),
    nonProportional: submissions.nonProportional.filter(submission => {
      // Filter by search query
      const matchesSearch = 
        submission.reinsured?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.insured?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.classOfBusiness?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.riskCountry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.status?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        selectedStatus === 'all' || 
        submission.status?.toLowerCase() === selectedStatus.toLowerCase();
      
      // Filter by commission type
      const matchesCommissionType = 
        selectedCommissionType === 'all' || 
        (selectedCommissionType === 'foc' && submission.isFOC) ||
        (selectedCommissionType === 'standard' && !submission.isFOC);
      
      return matchesSearch && matchesStatus && matchesCommissionType;
    })
  };
  
  // For combined "all" view
  const allFilteredSubmissions = [
    ...filteredSubmissions.proportional.map(item => ({ ...item, type: 'proportional' })),
    ...filteredSubmissions.nonProportional.map(item => ({ ...item, type: 'non-proportional' }))
  ];

  // Always return all submissions
  const getSubmissionsToDisplay = () => {
    return allFilteredSubmissions;
  };

  // Calculate class of business distribution
  const calculateClassDistribution = () => {
    const allSubmissions = [...submissions.proportional, ...submissions.nonProportional]
    const classCounts: Record<string, number> = {}
    
    allSubmissions.forEach(sub => {
      const classOfBusiness = sub.classOfBusiness
      classCounts[classOfBusiness] = (classCounts[classOfBusiness] || 0) + 1
    })

    const total = Object.values(classCounts).reduce((a, b) => a + b, 0)
    
    return Object.entries(classCounts).map(([classOfBusiness, count]) => ({
      classOfBusiness,
      count,
      percentage: (count / total) * 100
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Improved header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
        <h1 className="text-3xl font-bold tracking-tight">Facultative Submissions Dashboard</h1>
        <p className="mt-2 text-blue-100 max-w-2xl">
          View and manage all your facultative reinsurance submissions
        </p>
            </div>
            <Link
              href="/non-life/broker"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-white/30 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="max-w-lg flex-grow">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter Button */}
          <div className="flex gap-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              Filters
            </button>
            
            {/* Create New Submission Buttons */}
            <div className="flex gap-2">
              <Link
                href="/non-life/broker/facultative/proportional"
                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Proportional
              </Link>
              <Link
                href="/non-life/broker/facultative/non-proportional"
                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Non-Proportional
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filtersOpen && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Submissions</h3>
            <button 
              onClick={() => setFiltersOpen(false)}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
              >
                <option value="all">All Statuses</option>
                <option value="pending review">Pending Review</option>
                <option value="quoted">Quoted</option>
                <option value="bound">Bound</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            
            {/* Commission Type Filter */}
            <div>
              <label htmlFor="commission-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Type
              </label>
              <select
                id="commission-filter"
                value={selectedCommissionType}
                onChange={(e) => setSelectedCommissionType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
              >
                <option value="all">All Commission Types</option>
                <option value="standard">Standard Commission</option>
                <option value="foc">Free of Commission (FOC)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submission Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-medium text-gray-900">
                All Facultative Submissions
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                A complete list of all your facultative submissions and their current status.
              </p>
            </div>
            </div>
          </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference #
                        </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company/Reinsured
                        </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class of Business</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Country</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sum Insured</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Amount</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                {getSubmissionsToDisplay().map((submission: any) => (
                  <tr key={`${submission.type}-${submission.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.type === 'proportional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {submission.type === 'proportional' ? 'Proportional' : 'Non-Proportional'}
                            </span>
                          </td>
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-blue-600">
                      {submission.policyReferenceNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      {submission.company || submission.reinsured}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{submission.insured}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{submission.classOfBusiness}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{submission.riskCountry}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{submission.sumInsured}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{submission.premiumAmount}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <CommissionBadge
                        commissionValue={submission.commission}
                        isFOC={submission.isFOC}
                        size="sm"
                      />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(submission.startDate)} - {formatDate(submission.endDate)}
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
        )}
        
        {/* No Results Message */}
        {!loading && getSubmissionsToDisplay().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No submissions found. Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-gray-900">
              {submissions.proportional.length + submissions.nonProportional.length}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Proportional</p>
              <p className="text-sm font-semibold">{submissions.proportional.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Non-Proportional</p>
              <p className="text-sm font-semibold">{submissions.nonProportional.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">FOC Submissions</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-gray-900">
              {submissions.proportional.filter(s => s.isFOC).length + submissions.nonProportional.filter(s => s.isFOC).length}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Proportional</p>
              <p className="text-sm font-semibold">{submissions.proportional.filter(s => s.isFOC).length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Non-Proportional</p>
              <p className="text-sm font-semibold">{submissions.nonProportional.filter(s => s.isFOC).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <div className="p-2 bg-amber-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm1-5a1 1 0 01-1 1H8a1 1 0 110-2h2V6a1 1 0 012 0v5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-gray-900">
              {submissions.proportional.filter(s => s.status === 'Pending Review').length + 
               submissions.nonProportional.filter(s => s.status === 'Pending Review').length}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Proportional</p>
              <p className="text-sm font-semibold">{submissions.proportional.filter(s => s.status === 'Pending Review').length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Non-Prop</p>
              <p className="text-sm font-semibold">{submissions.nonProportional.filter(s => s.status === 'Pending Review').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Bound Contracts</h3>
            <div className="p-2 bg-indigo-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-gray-900">
              {submissions.proportional.filter(s => s.status === 'Bound').length + 
               submissions.nonProportional.filter(s => s.status === 'Bound').length}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Proportional</p>
              <p className="text-sm font-semibold">{submissions.proportional.filter(s => s.status === 'Bound').length}</p>
              </div>
            <div>
              <p className="text-xs text-gray-500">Non-Prop</p>
              <p className="text-sm font-semibold">{submissions.nonProportional.filter(s => s.status === 'Bound').length}</p>
            </div>
          </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-8 bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">View insights about your submissions</p>
            </div>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                transition-colors duration-200
                ${showAnalytics 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
              `}
            >
              <span className="text-sm font-medium">
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${showAnalytics ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {showAnalytics && (
            <div className="space-y-6">
              <StatisticsCards
                newSubmissions={{
                  count: 7,
                  change: 4
                }}
                pendingRenewals={{
                  count: 1,
                  urgent: 2
                }}
                activePolicies={{
                  count: 4,
                  totalPremium: 25000000
                }}
                totalPremium={{
                  amount: 25000000,
                  averagePerPolicy: 6000000
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 overflow-hidden">
                  <ClassOfBusinessChart data={calculateClassDistribution()} />
                </div>

                <SubmissionsByPeriod
                  data={[
                    { period: '0-15 days', count: 0, type: 'Recent' },
                    { period: '15-30 days', count: 0, type: 'Medium' },
                    { period: 'Over 30 days', count: 12, type: 'Older' }
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 