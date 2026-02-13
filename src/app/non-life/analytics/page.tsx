'use client'

import { ArrowUpIcon, ArrowDownIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import { formatLargeCurrency } from '@/utils/currency'

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Market Share</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">12.8%</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              1.2%
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Growth Rate</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">15.4%</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              2.3%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Customer Satisfaction</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">4.6/5</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              0.3
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">82/100</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              5
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Trends */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Market Trends</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { segment: 'Property', growth: '+8.5%', outlook: 'Positive', trend: 'up' },
                { segment: 'Marine', growth: '+12.3%', outlook: 'Very Positive', trend: 'up' },
                { segment: 'Liability', growth: '-2.1%', outlook: 'Neutral', trend: 'down' },
                { segment: 'Engineering', growth: '+5.7%', outlook: 'Positive', trend: 'up' },
              ].map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trend.segment}</p>
                    <p className="text-sm text-gray-500">Growth: {trend.growth}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{trend.outlook}</p>
                    <p className={`text-sm flex items-center justify-end ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.trend === 'up' ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                      Trend
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Risk Analysis</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { category: 'Natural Catastrophe', level: 'High', exposure: 2800000000, change: '+15%' },
                { category: 'Cyber Risk', level: 'Medium', exposure: 850000000, change: '+28%' },
                { category: 'Political Risk', level: 'Low', exposure: 420000000, change: '-5%' },
                { category: 'Financial Risk', level: 'Medium', exposure: 1200000000, change: '+8%' },
              ].map((risk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{risk.category}</p>
                    <p className={`text-sm ${
                      risk.level === 'Low' ? 'text-green-600' :
                      risk.level === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>Level: {risk.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatLargeCurrency(risk.exposure)}</p>
                    <p className={`text-sm ${
                      risk.change.startsWith('+') ? 'text-red-600' : 'text-green-600'
                    }`}>{risk.change}</p>
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