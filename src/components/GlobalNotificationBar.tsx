'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useNotifications } from '@/context/NotificationContext'

export default function GlobalNotificationBar() {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0)
  const { alerts, dismissAlert } = useNotifications()

  // Rotate through alerts every 10 seconds if there are multiple
  useEffect(() => {
    if (alerts.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentAlertIndex(prev => (prev + 1) % alerts.length)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [alerts.length])

  // If no alerts, don't render anything
  if (alerts.length === 0) {
    return null
  }

  const currentAlert = alerts[currentAlertIndex]

  // Background color based on alert type
  const getBgColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  // Text color based on alert type
  const getTextColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-blue-800'
      case 'warning':
        return 'text-yellow-800'
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div className={`border-t border-b ${getBgColor(currentAlert.type)} px-4 py-2`}>
      <div className="flex justify-between items-center">
        <p className={`text-sm font-medium ${getTextColor(currentAlert.type)}`}>
          {currentAlert.message}
        </p>
        <button
          type="button"
          className={`ml-auto flex-shrink-0 ${getTextColor(currentAlert.type)} hover:opacity-75`}
          onClick={() => dismissAlert(currentAlert.id)}
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {alerts.length > 1 && (
        <div className="mt-1 text-xs text-gray-500">
          {alerts.length - 1} more notification{alerts.length - 1 > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
} 