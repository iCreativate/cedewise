'use client'

import { useUser } from '@/context/UserContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NavigationDebugPage() {
  const { userRole, userName } = useUser()
  const [navData, setNavData] = useState<any>(null)
  
  useEffect(() => {
    // Capture all relevant state data
    const debugData = {
      userRole,
      userName,
      timestamp: new Date().toISOString(),
      cookieUserRole: typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('userRole='))?.split('=')[1] : null,
      localStorageUserRole: typeof window !== 'undefined' ? localStorage.getItem('userRole') : null,
    }
    
    setNavData(debugData)
    
    // Also log to console for easier inspection
    console.log('Navigation Debug Info:', debugData)
  }, [userRole, userName])
  
  // Force login as different roles for testing
  const loginAs = (role: 'broker' | 'insurer' | 'reinsurer') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role)
      localStorage.setItem('userName', `${role.charAt(0).toUpperCase() + role.slice(1)} Test User`)
      
      // Also set cookies
      document.cookie = `userRole=${role}; path=/; max-age=${60*60*24*7}`
      document.cookie = `userName=${role.charAt(0).toUpperCase() + role.slice(1)} Test User; path=/; max-age=${60*60*24*7}`
      
      // Force page reload
      window.location.reload()
    }
  }
  
  // Clear all browser storage
  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      
      // Clear cookies
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })
      
      // Force page reload
      window.location.reload()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Navigation Debugger</h1>
          <p className="text-sm text-gray-500">Troubleshooting navigation issues</p>
        </div>
        
        <div className="px-6 py-5">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Current User Info</h2>
            <div className="p-4 bg-gray-100 rounded-md">
              <pre className="text-sm overflow-auto">{JSON.stringify(navData, null, 2)}</pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Test Login</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => loginAs('reinsurer')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Login as Reinsurer
              </button>
              <button
                onClick={() => loginAs('broker')}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Login as Broker
              </button>
              <button
                onClick={() => loginAs('insurer')}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
              >
                Login as Insurer
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={clearStorage}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Clear All Storage
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Refresh Page
              </button>
              <Link 
                href="/dashboard" 
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Troubleshooting Tips</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Make sure you're logged in as a <strong>reinsurer</strong> to see the Treaty and Facultative navigation items</li>
              <li>Try clearing your browser cache and local storage</li>
              <li>Check that you have the latest code deployed</li>
              <li>Verify that your browser's developer console doesn't show any errors</li>
              <li>If you recently updated the code, try a hard refresh (Ctrl+F5 or Cmd+Shift+R)</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800">
              <strong>Note:</strong> If you're seeing this page but not the navigation items, it's likely a caching or authentication issue. 
              Try logging out and back in as a reinsurer, or clear your browser cache.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 