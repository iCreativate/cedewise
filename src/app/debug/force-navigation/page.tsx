'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DocumentTextIcon,
  BeakerIcon,
  ScaleIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
  CloudIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  BoltIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'

export default function ForceNavigationPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Initializing...')
  
  // Function to create a new menu component that doesn't depend on any context
  useEffect(() => {
    async function forceNavigation() {
      try {
        if (typeof window !== 'undefined') {
          // Force role to reinsurer
          localStorage.setItem('userRole', 'reinsurer')
          localStorage.setItem('userName', 'Force Navigation Test')
          
          // Set cookies too for completeness
          document.cookie = `userRole=reinsurer; path=/; max-age=${60*60*24*7}`
          document.cookie = `userName=Force Navigation Test; path=/; max-age=${60*60*24*7}`
          
          setStatus('User role set to reinsurer!')
          
          // Force clear any navigation cache
          const navCacheItems = [
            'navigationState',
            'lastPathname',
            'nav_debug_timestamp',
            'nav_cache',
            'lastNavUpdate',
            'menuState',
            'debug_navigation'
          ]
          
          navCacheItems.forEach(item => {
            try {
              localStorage.removeItem(item)
              setStatus(prev => prev + `\nCleared ${item} from localStorage`)
            } catch (e) {
              console.error(`Failed to clear ${item}:`, e)
              setStatus(prev => prev + `\nFailed to clear ${item}: ${e}`)
            }
          })
          
          setStatus(prev => prev + '\nNavigation cache cleared!')
        }
      } catch (e) {
        console.error('Error in force navigation:', e)
        setStatus(`Error: ${e.message}`)
      }
    }
    
    forceNavigation()
  }, [])
  
  // Create a direct representation of the navigation items
  const navItems = [
    { 
      name: 'Treaty', 
      href: '/non-life/reinsurer/treaty', 
      icon: DocumentTextIcon,
      children: [
        { name: 'Proportional', href: '/non-life/reinsurer/treaty/proportional', icon: ScaleIcon },
        { name: 'Surplus', href: '/non-life/reinsurer/treaty/surplus', icon: BanknotesIcon },
        { name: 'Quota share', href: '/non-life/reinsurer/treaty/quota-share', icon: ArrowsPointingOutIcon },
        { name: 'Non-Proportional', href: '/non-life/reinsurer/treaty/non-proportional', icon: ChartBarIcon },
        { name: 'Risk XoL', href: '/non-life/reinsurer/treaty/risk-xol', icon: ShieldExclamationIcon },
        { name: 'Cat/Event XoL', href: '/non-life/reinsurer/treaty/cat-xol', icon: CloudIcon },
        { name: 'Aggregate XoL', href: '/non-life/reinsurer/treaty/aggregate-xol', icon: ArrowTrendingDownIcon },
        { name: 'Stop Loss', href: '/non-life/reinsurer/treaty/stop-loss', icon: FireIcon }
      ]
    },
    {
      name: 'Facultative',
      href: '/non-life/reinsurer/facultative',
      icon: BeakerIcon,
      children: [
        { name: 'Proportional', href: '/non-life/reinsurer/facultative/proportional', icon: ScaleIcon },
        { name: 'Non-Proportional', href: '/non-life/reinsurer/facultative/non-proportional', icon: ChartBarIcon },
        { name: 'Fac Facility', href: '/non-life/reinsurer/facultative/fac-facility', icon: BoltIcon }
      ]
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Force Navigation Test</h1>
          <p className="text-sm text-gray-500">Direct rendering of navigation without using SharedLayout</p>
        </div>
        
        <div className="px-6 py-5">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Status</h2>
            <div className="p-4 bg-gray-100 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{status}</pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Direct Navigation Rendering</h2>
            <p className="text-sm text-gray-500 mb-4">
              Below is a direct rendering of the navigation structure that should appear in the 
              sidebar. This bypasses any issues with the SharedLayout component.
            </p>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Navigation Menu</h3>
              <nav>
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item.name} className="text-white">
                      <div className="flex items-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-md p-2">
                        <item.icon className="h-6 w-6 mr-3" />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      {item.children && (
                        <ul className="mt-2 ml-8 space-y-2">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link 
                                href={child.href}
                                className="flex items-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-md py-2 px-4"
                              >
                                <child.icon className="h-5 w-5 mr-2" />
                                <span>{child.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/dashboard" 
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-block"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/non-life/reinsurer/treaty" 
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-block"
              >
                Go to Treaty Page
              </Link>
              <Link 
                href="/non-life/reinsurer/facultative" 
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded inline-block"
              >
                Go to Facultative Page
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Refresh Page
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800">
              <strong>Troubleshooting:</strong> If the navigation still isn't showing in the main application:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-amber-800">
              <li>Check browser console for any errors</li>
              <li>Try a hard refresh of the application (Ctrl+F5 or Cmd+Shift+R)</li>
              <li>Verify the SharedLayout component is being used by all pages</li>
              <li>Check that the userRole is correctly set by looking in localStorage and cookies</li>
              <li>Try using a different browser</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
} 