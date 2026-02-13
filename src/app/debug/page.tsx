'use client'

import { useUser } from '@/context/UserContext'
import { useState, useEffect } from 'react'

export default function DebugPage() {
  const { userRole } = useUser()
  const [navigation, setNavigation] = useState<any>(null)
  
  useEffect(() => {
    // Force clear any cache that might be affecting the navigation
    if (typeof window !== 'undefined') {
      localStorage.setItem('nav_debug_timestamp', Date.now().toString())
      
      // Log the user role for debugging
      console.log('Current user role:', userRole)
      
      // Attempt to extract navigation from localStorage if available
      const navData = localStorage.getItem('debug_navigation')
      if (navData) {
        try {
          setNavigation(JSON.parse(navData))
        } catch (e) {
          console.error('Failed to parse navigation data:', e)
        }
      }
    }
  }, [userRole])
  
  // Function to force reload the page
  const forceReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
  
  // Force a relogin as reinsurer
  const loginAsReinsurer = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', 'reinsurer')
      localStorage.setItem('userName', 'Reinsurer Debug')
      
      // Also set cookies for consistency
      document.cookie = `userRole=reinsurer; path=/; max-age=${60*60*24*7}`
      document.cookie = `userName=Reinsurer Debug; path=/; max-age=${60*60*24*7}`
      
      // Force reload
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Navigation Debugger</h1>
        </div>
        
        <div className="px-6 py-5">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Current User Role</h2>
            <div className="p-4 bg-gray-100 rounded-md">
              <code>{userRole || 'Not logged in'}</code>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={forceReload}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Force Reload Page
            </button>
            
            <button
              onClick={loginAsReinsurer}
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
            >
              Force Login as Reinsurer
            </button>
            
            <a
              href="/login"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-flex items-center"
            >
              Go to Login Page
            </a>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Navigation Structure Test</h2>
            <p className="mb-4">
              Expected structure for reinsurer: Treaty (with children: Proportional, Non-Proportional, etc.) and 
              Facultative (with children: Proportional, Non-Proportional, Fac Facility)
            </p>
            
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{JSON.stringify({
                userRole,
                pathToTest: '/non-life/reinsurer/treaty/proportional',
                expectedToWork: userRole === 'reinsurer',
                currentTime: new Date().toISOString(),
                navigation: navigation || 'Navigation data not available',
              }, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 