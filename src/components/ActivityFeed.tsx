'use client';

import React from 'react';
import { 
  DocumentTextIcon, 
  ArrowUpIcon, 
  UserGroupIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const activities = [
  {
    id: 1,
    type: 'submission',
    title: 'New Submission',
    description: 'Property Insurance for Tech Manufacturing Co.',
    timestamp: '2 hours ago',
    icon: DocumentTextIcon,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
  },
  {
    id: 2,
    type: 'renewal',
    title: 'Renewal Due',
    description: 'Marine Insurance for Ocean Shipping Inc.',
    timestamp: '4 hours ago',
    icon: ArrowUpIcon,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100',
  },
  {
    id: 3,
    type: 'broker',
    title: 'New Broker',
    description: 'ABC Insurance Brokers registered',
    timestamp: '1 day ago',
    icon: UserGroupIcon,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100',
  },
  {
    id: 4,
    type: 'analytics',
    title: 'Portfolio Update',
    description: 'Monthly risk assessment completed',
    timestamp: '2 days ago',
    icon: ChartBarIcon,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100',
  },
];

const ActivityFeed: React.FC = () => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className={`relative ${activity.iconBg} p-2 rounded-full`}>
                  <activity.icon
                    className={`h-5 w-5 ${activity.iconColor}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed; 