'use client'

import Link from 'next/link'
import { useUser } from '@/context/UserContext'

export default function FacultativePage() {
  const { userRole } = useUser()

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Facultative Reinsurance</h1>
        <p className="text-gray-600 mb-6">
          Facultative reinsurance covers individual risks that are underwritten separately. Select from the facultative types below.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/non-life/reinsurer/facultative/proportional" className="block p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors">
            <h3 className="font-medium text-purple-700 mb-1">Proportional</h3>
            <p className="text-sm text-gray-500">Shares premiums and losses proportionally on individual risks</p>
          </Link>
          
          <Link href="/non-life/reinsurer/facultative/non-proportional" className="block p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
            <h3 className="font-medium text-blue-700 mb-1">Non-Proportional</h3>
            <p className="text-sm text-gray-500">Covers individual risks above a specified retention</p>
          </Link>
          
          <Link href="/non-life/reinsurer/facultative/fac-facility" className="block p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
            <h3 className="font-medium text-green-700 mb-1">Fac Facility</h3>
            <p className="text-sm text-gray-500">Pre-arranged facility for a class of facultative risks</p>
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Recent Facultative Submissions</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cape Town Office Tower</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Proportional</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marsh</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Quoted</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 15, 2023</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Johannesburg Data Center</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Non-Proportional</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Willis</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Under Review</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 3, 2023</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Durban Port Facility</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Fac Facility</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aon</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Bound</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 22, 2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Navigation Help</h2>
        <p className="text-sm text-gray-600 mb-4">
          You should see all Facultative options in the left sidebar navigation menu. If the navigation isn't showing correctly:
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