'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { clsx } from 'clsx'
import { 
  ScaleIcon, 
  ChartBarIcon, 
  BoltIcon
} from '@heroicons/react/24/outline'

// Define navigation tabs with icons that will be shown conditionally
const navigation = [
  { 
    name: 'Non-Proportional', 
    href: '/non-life/broker/facultative/non-proportional',
    icon: ChartBarIcon,
    description: 'Excess of loss cover' 
  },
  { 
    name: 'Proportional', 
    href: '/non-life/broker/facultative/proportional',
    icon: ScaleIcon,
    description: 'Quota share arrangements'
  },
  { 
    name: 'Automatic Placements', 
    href: '/non-life/broker/facultative/auto-fac',
    icon: BoltIcon,
    description: 'Auto quoting system'
  },
]

export default function FacultativeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Only show tabs on the form pages that are accessed via the "New" buttons
  const showTabs = pathname === '/non-life/broker/facultative/proportional' || 
                  pathname === '/non-life/broker/facultative/non-proportional' ||
                  pathname === '/non-life/broker/facultative/auto-fac'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showTabs && (
          <div className="mt-4 rounded-lg shadow-sm bg-white border border-gray-200">
            <nav className="flex px-2" aria-label="Tabs">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                      "relative flex-1 group overflow-hidden",
                      isActive 
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <div className={clsx(
                      "flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 ease-in-out",
                      isActive && "transform scale-105"
                    )}>
                      <item.icon 
                        className={clsx(
                          "h-6 w-6 mb-2",
                          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                        )} 
                        aria-hidden="true" 
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs mt-1 text-center hidden sm:block opacity-70">
                        {item.description}
                      </span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
                      )}
                    </div>
                </Link>
                );
              })}
            </nav>
          </div>
        )}
        <div className="py-6">
          {children}
        </div>
      </div>
    </div>
  )
} 