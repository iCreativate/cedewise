'use client'

import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { formatLargeCurrency } from '@/utils/currency'

export default function ReinsurancePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reinsurance Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Gross Written Premium</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{formatLargeCurrency(245800000)}</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              12.5%
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Loss Ratio</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">64.2%</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
              <ArrowDownIcon className="h-4 w-4" />
              2.1%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Combined Ratio</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">96.8%</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              1.4%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Treaties</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">156</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              8
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Treaties */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Active Treaties</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: 'Property Catastrophe XL', type: 'Non-proportional', renewal: '2024-06-30', status: 'Active' },
                { name: 'Marine Cargo QS', type: 'Proportional', renewal: '2024-03-31', status: 'Active' },
                { name: 'Engineering Risk XL', type: 'Non-proportional', renewal: '2024-09-30', status: 'Active' },
                { name: 'Fire & Allied Perils', type: 'Proportional', renewal: '2024-12-31', status: 'Active' },
              ].map((treaty, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{treaty.name}</p>
                    <p className="text-sm text-gray-500">{treaty.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">Renewal: {treaty.renewal}</p>
                    <p className="text-sm text-green-600">{treaty.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Claims</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { id: 'CLM-2024-001', type: 'Property', amount: 1200000, status: 'Under Review' },
                { id: 'CLM-2024-002', type: 'Marine', amount: 450000, status: 'Approved' },
                { id: 'CLM-2024-003', type: 'Engineering', amount: 2500000, status: 'Pending' },
                { id: 'CLM-2024-004', type: 'Fire', amount: 800000, status: 'Settled' },
              ].map((claim, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{claim.id}</p>
                    <p className="text-sm text-gray-500">{claim.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatLargeCurrency(claim.amount)}</p>
                    <p className={`text-sm ${
                      claim.status === 'Approved' ? 'text-green-600' :
                      claim.status === 'Pending' ? 'text-yellow-600' :
                      claim.status === 'Settled' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>{claim.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 