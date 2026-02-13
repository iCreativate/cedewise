'use client'

import { useUser } from '@/context/UserContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { userName, userRole } = useUser()

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex items-center gap-4">
        <div className="bg-gray-100 rounded-full p-2">
          <UserCircleIcon className="h-12 w-12 text-gray-500" />
        </div>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and role information</p>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userName || 'Not available'}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{userRole || 'Not set'}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{`${userRole}@demo.com` || 'Not available'}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Account status</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Permissions</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userRole === 'broker' && 'Broker dashboard, Risk placement, Client management, Submission tracking, Analytics'}
              {userRole === 'insurer' && 'Insurer dashboard, Risk assessment, Underwriting, Analytics, Policy management'}
              {userRole === 'reinsurer' && 'Reinsurance dashboard, Treaty management, Facultative underwriting, Analytics'}
              {!userRole && 'Not available'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
} 