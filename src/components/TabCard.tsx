'use client'

import { ReactNode, memo } from 'react'
import { clsx } from 'clsx'

interface TabCardProps {
  title: string
  description?: string
  icon?: ReactNode
  color?: 'blue' | 'green' | 'purple' | 'amber'
  children: ReactNode
  className?: string
}

// Using React.memo to prevent unnecessary re-renders
const TabCard = memo(function TabCard({
  title,
  description,
  icon,
  color = 'blue',
  children,
  className = '',
}: TabCardProps) {
  const colorClasses = {
    blue: {
      header: 'from-blue-600 to-blue-700',
      ring: 'ring-blue-500/20',
      iconBg: 'bg-blue-500'
    },
    green: {
      header: 'from-emerald-600 to-emerald-700',
      ring: 'ring-emerald-500/20',
      iconBg: 'bg-emerald-500'
    },
    purple: {
      header: 'from-purple-600 to-purple-700',
      ring: 'ring-purple-500/20',
      iconBg: 'bg-purple-500'
    },
    amber: {
      header: 'from-amber-500 to-amber-600',
      ring: 'ring-amber-500/20',
      iconBg: 'bg-amber-500'
    }
  }

  return (
    <div className={clsx(
      'bg-white rounded-xl shadow-md overflow-hidden ring-1 ring-gray-200',
      colorClasses[color].ring,
      className
    )}>
      <div className={clsx(
        'px-6 py-5 bg-gradient-to-r text-white',
        colorClasses[color].header
      )}>
        <div className="flex items-center">
          {icon && (
            <div className={clsx(
              'mr-4 p-2 rounded-lg',
              colorClasses[color].iconBg
            )}>
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-white/80">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
});

export default TabCard; 