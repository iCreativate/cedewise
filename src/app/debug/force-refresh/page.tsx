'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ForceRefreshPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Try to clear any possible cache
    if (typeof window !== 'undefined') {
      // Force clear navigation-related items
      const navCacheItems = [
        'navigationState',
        'lastPathname',
        'nav_debug_timestamp',
        'nav_cache',
        'lastNavUpdate',
        'menuState'
      ]
      
      // Clear these specific items
      navCacheItems.forEach(item => {
        try {
          localStorage.removeItem(item)
        } catch (e) {
          console.error(`Failed to remove ${item}:`, e)
        }
      })
      
      // Set a timestamp to indicate we've refreshed
      localStorage.setItem('force_refresh_timestamp', Date.now().toString())
      
      // Tell the user what's happening
      alert('Navigation cache has been cleared. Redirecting to dashboard...')
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Refreshing Navigation</h1>
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-center text-gray-600 mb-2">Clearing navigation cache...</p>
        <p className="text-center text-sm text-gray-500">You will be redirected automatically</p>
      </div>
    </div>
  )
} 