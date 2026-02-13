'use client'

import { useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import CurrencySelector from '@/components/CurrencySelector'

const tabs = [
  { name: 'Profile', href: '#profile', current: true },
  { name: 'Notifications', href: '#notifications', current: false },
  { name: 'Security', href: '#security', current: false },
  { name: 'Preferences', href: '#preferences', current: false },
]

const notificationSettings = [
  {
    id: 'treaty-updates',
    name: 'Treaty Updates',
    description: 'Get notified when a treaty is updated or requires attention.',
  },
  {
    id: 'claims-notifications',
    name: 'Claims Notifications',
    description: 'Receive notifications for new claims and status changes.',
  },
  {
    id: 'renewal-reminders',
    name: 'Renewal Reminders',
    description: 'Get reminded before treaty renewals are due.',
  },
  {
    id: 'market-updates',
    name: 'Market Updates',
    description: 'Receive updates about market trends and industry news.',
  },
]

// Define the type for notifications state
type NotificationState = {
  [key: string]: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState<NotificationState>(
    notificationSettings.reduce((acc, setting) => ({ ...acc, [setting.id]: true }), {})
  )

  const handleNotificationChange = (settingId: string) => {
    setNotifications((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-x-3">
          <Cog6ToothIcon className="h-8 w-8 text-indigo-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.href.slice(1)}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.href.slice(1))}
                className={classNames(
                  tab.href.slice(1) === activeTab
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
              <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose what notifications you want to receive.
              </p>
            </div>

            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id={setting.id}
                      name={setting.id}
                      type="checkbox"
                      checked={notifications[setting.id]}
                      onChange={() => handleNotificationChange(setting.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor={setting.id} className="text-sm font-medium text-gray-700">
                      {setting.name}
                    </label>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your account security.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current-password"
                  id="current-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preferences Settings */}
        {activeTab === 'preferences' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Display Preferences</h3>
              <p className="mt-1 text-sm text-gray-500">Customize your experience.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Currency</label>
                <div className="mt-1 w-48">
                  <CurrencySelector />
                </div>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
} 