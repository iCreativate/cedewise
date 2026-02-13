'use client'

import { useUser } from '@/context/UserContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  DocumentTextIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'

const StatCard = ({ title, value, icon: Icon, color }: { 
  title: string, 
  value: string, 
  icon: any,
  color: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
  >
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
)

const NavigationCard = ({ href, title, description, icon: Icon, color }: {
  href: string,
  title: string,
  description: string,
  icon: any,
  color: string
}) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer`}
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </motion.div>
  </Link>
)

export default function DashboardPage() {
  const { userRole, userName } = useUser()
  
  // Placeholder stats - these should be replaced with real data
  const stats = [
    { title: 'Active Policies', value: '24', icon: DocumentCheckIcon, color: 'bg-blue-500' },
    { title: 'Monthly Revenue', value: '$45.2k', icon: ArrowTrendingUpIcon, color: 'bg-green-500' },
    { title: 'Pending Reviews', value: '12', icon: ClockIcon, color: 'bg-amber-500' },
  ]
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName || 'User'}
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your {userRole || 'account'} today.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavigationCard
            href="/non-life"
            title="Non-Life Section"
            description="Access and manage non-life reinsurance operations"
            icon={ChartBarIcon}
            color="bg-blue-500"
          />

          {userRole === 'reinsurer' && (
            <>
              <NavigationCard
                href="/non-life/reinsurer"
                title="Reinsurer Dashboard"
                description="View and manage reinsurance operations"
                icon={UserGroupIcon}
                color="bg-purple-500"
              />
              <NavigationCard
                href="/non-life/reinsurer/treaty"
                title="Treaty Management"
                description="Manage treaty arrangements and policies"
                icon={DocumentTextIcon}
                color="bg-green-500"
              />
            </>
          )}

          {userRole === 'broker' && (
            <NavigationCard
              href="/non-life/broker"
              title="Broker Dashboard"
              description="Manage client placements and submissions"
              icon={UserGroupIcon}
              color="bg-indigo-500"
            />
          )}

          {userRole === 'insurer' && (
            <NavigationCard
              href="/non-life/insurer"
              title="Insurer Dashboard"
              description="Manage reinsurance programs and policies"
              icon={UserGroupIcon}
              color="bg-rose-500"
            />
          )}
        </div>
      </div>
      
      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-700">
          If you're having trouble finding what you need, check out our help section or contact support.
          We're here to ensure you have the best experience possible.
        </p>
        <div className="mt-4 flex gap-4">
          <Link
            href="/help"
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors"
          >
            View Help Center
          </Link>
            <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Contact Support
            </Link>
        </div>
      </motion.div>
    </div>
  )
} 