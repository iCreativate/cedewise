'use client'

import Link from 'next/link'
import { useUser } from '@/context/UserContext'

export default function TreatyPage() {
  const { userRole } = useUser()

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Treaty Reinsurance</h1>
        <p className="text-gray-600 mb-6">
          Treaty reinsurance is a comprehensive agreement between an insurer and a reinsurer, covering an entire portfolio of risks. Select from the treaty types below.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/non-life/reinsurer/treaty/proportional" className="block p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
            <h3 className="font-medium text-blue-700 mb-1">Proportional</h3>
            <p className="text-sm text-gray-500">Premiums and losses shared proportionally</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/surplus" className="block p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
            <h3 className="font-medium text-green-700 mb-1">Surplus</h3>
            <p className="text-sm text-gray-500">Cedes risks above retention limit</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/quota-share" className="block p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors">
            <h3 className="font-medium text-purple-700 mb-1">Quota Share</h3>
            <p className="text-sm text-gray-500">Fixed percentage of every risk transferred</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/non-proportional" className="block p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors">
            <h3 className="font-medium text-amber-700 mb-1">Non-Proportional</h3>
            <p className="text-sm text-gray-500">Coverage for losses exceeding retention</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/risk-xol" className="block p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
            <h3 className="font-medium text-red-700 mb-1">Risk XoL</h3>
            <p className="text-sm text-gray-500">Excess of loss on individual risks</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/cat-xol" className="block p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors">
            <h3 className="font-medium text-indigo-700 mb-1">Cat/Event XoL</h3>
            <p className="text-sm text-gray-500">Coverage for catastrophic events</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/aggregate-xol" className="block p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">
            <h3 className="font-medium text-teal-700 mb-1">Aggregate XoL</h3>
            <p className="text-sm text-gray-500">Coverage for accumulated losses</p>
          </Link>
          
          <Link href="/non-life/reinsurer/treaty/stop-loss" className="block p-4 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg transition-colors">
            <h3 className="font-medium text-pink-700 mb-1">Stop Loss</h3>
            <p className="text-sm text-gray-500">Protection against excessive loss ratios</p>
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Recent Treaty Programs</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cedant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ABC Insurance Property Treaty</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Quota Share</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ABC Insurance</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 1, 2023</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">XYZ Casualty Excess</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Risk XoL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">XYZ Mutual</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 1, 2023</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Global Re Cat Treaty</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cat XoL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Global Insurance</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 1, 2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Navigation Help</h2>
        <p className="text-sm text-gray-600 mb-4">
          You should see all Treaty options in the left sidebar navigation menu. If the navigation isn't showing correctly:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mb-4">
          <li>Verify you're logged in as a reinsurer</li>
          <li>Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)</li>
          <li>Check the browser console for errors</li>
        </ul>
        <Link href="/debug/force-navigation" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Go to Navigation Debugger →
        </Link>
      </div>
    </div>
  )
} 