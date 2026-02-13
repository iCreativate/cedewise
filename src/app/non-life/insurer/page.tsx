'use client'

import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { formatLargeCurrency } from '@/utils/currency'
import RoleGuard from '@/components/RoleGuard'

function InsurerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Insurer Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Net Written Premium</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{formatLargeCurrency(892500000)}</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              15.3%
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Claims Ratio</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">58.7%</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowDownIcon className="h-4 w-4" />
              3.2%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Risk Retention</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">72.4%</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
              <ArrowUpIcon className="h-4 w-4" />
              0.8%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Policies</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">15,842</p>
            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              426
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Portfolio Distribution</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { type: 'Property', premium: 320000000, share: '36%', risk: 'Medium' },
                { type: 'Casualty', premium: 280000000, share: '31%', risk: 'High' },
                { type: 'Marine', premium: 180000000, share: '20%', risk: 'Medium' },
                { type: 'Engineering', premium: 112500000, share: '13%', risk: 'Low' },
              ].map((line, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{line.type}</p>
                    <p className="text-sm text-gray-500">Share: {line.share}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatLargeCurrency(line.premium)}</p>
                    <p className={`text-sm ${
                      line.risk === 'Low' ? 'text-green-600' :
                      line.risk === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>Risk: {line.risk}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Claims Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Claims Overview</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { status: 'New Claims', count: 234, amount: 45200000, change: '+12%' },
                { status: 'In Progress', count: 567, amount: 128500000, change: '-5%' },
                { status: 'Settled', count: 1893, amount: 342800000, change: '+8%' },
                { status: 'Rejected', count: 142, amount: 28400000, change: '-15%' },
              ].map((claims, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{claims.status}</p>
                    <p className="text-sm text-gray-500">{claims.count} Claims</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatLargeCurrency(claims.amount)}</p>
                    <p className={`text-sm ${
                      claims.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>{claims.change}</p>
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

// Wrap the component with RoleGuard for role-based access control
export default function ProtectedInsurerPage() {
  return (
    <RoleGuard allowedRoles={['insurer']}>
      <InsurerPage />
    </RoleGuard>
  )
} 