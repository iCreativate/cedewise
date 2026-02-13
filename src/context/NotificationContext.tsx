'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface NotificationType {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface AlertType {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationContextType {
  notifications: NotificationType[];
  alerts: AlertType[];
  addNotification: (message: string) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  addAlert: (message: string, type: AlertType['type']) => void;
  dismissAlert: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([
    { 
      id: '1', 
      message: 'New facultative submission from ABC Insurance', 
      time: '10 minutes ago', 
      read: false 
    },
    { 
      id: '2', 
      message: 'Reinsurer accepted your quote for XYZ Property', 
      time: '2 hours ago', 
      read: false 
    },
    { 
      id: '3', 
      message: 'Document uploaded: Loss history for Smith Manufacturing', 
      time: '4 hours ago', 
      read: true 
    },
    { 
      id: '4', 
      message: 'Premium payment received for Policy #12345', 
      time: '1 day ago', 
      read: true 
    }
  ])
  
  const [alerts, setAlerts] = useState<AlertType[]>([
    {
      id: 'system-maintenance',
      message: 'System maintenance scheduled for June 15, 2023 at 02:00 UTC. Expect brief service interruptions.',
      type: 'info'
    },
    {
      id: 'new-feature',
      message: 'New feature: Facultative reinsurance workflows now available in your dashboard.',
      type: 'success'
    },
    {
      id: 'renewal-alert',
      message: 'You have 5 policies approaching renewal in the next 30 days. Please review them soon.',
      type: 'warning'
    }
  ])

  const addNotification = useCallback((message: string) => {
    const newNotification: NotificationType = {
      id: Date.now().toString(),
      message,
      time: 'Just now',
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const addAlert = useCallback((message: string, type: AlertType['type']) => {
    const newAlert: AlertType = {
      id: Date.now().toString(),
      message,
      type
    }
    
    setAlerts(prev => [newAlert, ...prev])
  }, [])

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        alerts,
        addNotification,
        markNotificationAsRead,
        removeNotification,
        addAlert,
        dismissAlert
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 