'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, EyeIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { formatLargeCurrency } from '@/utils/currency';
import { useRouter } from 'next/navigation';
import { Popover } from '@headlessui/react';
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

// Company logos and colors for major companies
const companyLogos: { [key: string]: string } = {
  'AON': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Aon_Corporation_logo.svg/2560px-Aon_Corporation_logo.svg.png',
  'Willis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Willis_Towers_Watson_logo.svg/2560px-Willis_Towers_Watson_logo.svg.png',
  'Marsh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Marsh_McLennan_logo.svg/2560px-Marsh_McLennan_logo.svg.png',
  'Gallagher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Arthur_J._Gallagher_%26_Co._logo.svg/2560px-Arthur_J._Gallagher_%26_Co._logo.svg.png'
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string) => {
  const colors = [
    '1d4ed8', // blue-700
    'b91c1c', // red-700
    '047857', // green-700
    '7c3aed', // violet-600
    'c2410c', // orange-700
    '0369a1', // sky-700
    '6d28d9', // purple-700
    '0f766e', // teal-700
  ];
  
  // Use the name to consistently get the same color
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

interface Submission {
  id: number;
  company: string;
  insured: string;
  brokerName: string;
  brokerEmail?: string;
  brokerPhone?: string;
  policyNo: string;
  riskCountry: string;
  classOfBusiness: string;
  businessOccupation: string;
  sumInsured: number;
  status: string;
  remainingShare: number;
  premiumRate: string;
  premiumAmount: string;
  commission: string;
  reinsurer_rating: string;
  startDate: string;
  endDate: string;
  description: string;
  reinsurers: {
    name: string;
    quotedShare: number;
    premium: number;
  }[];
  documents: string[];
}

interface BrokerSubmissionRowProps {
  submission: Submission;
  type: 'proportional' | 'nonProportional';
}

const BrokerSubmissionRow: React.FC<BrokerSubmissionRowProps> = ({ submission, type }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Generate policy reference number once and store it
  const policyRefNumber = useRef(submission.policyNo || (() => {
    const prefix = type === 'proportional' ? 'PRO' : 'NPF';
    const year = new Date().getFullYear() + 1; // Using next year as per example
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${timestamp}-${randomNum}`;
  })());

  // Handle hover start
  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row hover effect
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  // Handle hover end with delay
  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row hover effect
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay before closing
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleRowClick = () => {
    router.push(`/non-life/reinsurer/submission/${submission.id}`);
  };

  const getBrokerAvatar = () => {
    const initials = getInitials(submission.brokerName);
    const color = getRandomColor(submission.brokerName);
    return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&bold=true&size=128&rounded=true`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'bound':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr 
      className="hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0"
      onClick={handleRowClick}
    >
      {/* Broker (avatar + name) */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 sticky left-0 bg-white z-10 align-middle">
        <div className="relative flex items-center">
          <div 
            ref={profileRef}
            className="flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="h-10 w-10 flex-shrink-0 relative rounded-full overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all duration-200">
              <img
                className="h-10 w-10 object-cover"
                src={getBrokerAvatar()}
                alt={`${submission.brokerName}'s avatar`}
                onError={() => setImageError(true)}
              />
            </div>
            <div className="ml-4 font-medium text-gray-900">
              {submission.brokerName}
            </div>
          </div>

          {/* Profile Card */}
          <Transition
            show={isHovered}
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div 
              className="fixed transform -translate-x-1/2 z-[9999]"
              style={{
                left: profileRef.current ? profileRef.current.getBoundingClientRect().left + (profileRef.current.getBoundingClientRect().width / 2) : 0,
                top: profileRef.current ? profileRef.current.getBoundingClientRect().top - 10 : 0,
                filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 -translate-y-full">
                <div className="relative bg-white p-6">
                  {/* Arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-r border-b border-black/5"></div>

                  {/* Content */}
                  <div className="relative">
                    {/* Header Section */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-full ring-2 ring-blue-50"
                          src={getBrokerAvatar()}
                          alt={`${submission.brokerName}'s avatar`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {submission.brokerName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-700">Broker:</span>
                          <span className="ml-1">{submission.brokerName}</span>
                        </div>
                        <p className="text-sm font-medium text-blue-600">
                          {submission.businessOccupation}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex flex-col space-y-3">
                        {submission.brokerEmail && (
                          <a href={`mailto:${submission.brokerEmail}`} 
                             onClick={(e) => e.stopPropagation()}
                             className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                            {submission.brokerEmail}
                          </a>
                        )}
                        {submission.brokerPhone && (
                          <a href={`tel:${submission.brokerPhone}`}
                             onClick={(e) => e.stopPropagation()}
                             className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                            {submission.brokerPhone}
                          </a>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                          {submission.brokerName}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          {submission.company}
                        </div>
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-900">Recent Activity</h4>
                      <dl className="mt-2 grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <dt className="text-sm text-gray-500">Submissions</dt>
                          <dd className="text-lg font-semibold text-blue-600">23</dd>
                        </div>
                        <div className="flex flex-col">
                          <dt className="text-sm text-gray-500">Quotes</dt>
                          <dd className="text-lg font-semibold text-green-600">15</dd>
                        </div>
                        <div className="flex flex-col">
                          <dt className="text-sm text-gray-500">Bound</dt>
                          <dd className="text-lg font-semibold text-indigo-600">8</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick();
                          }}
                          className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle message action
                          }}
                          className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </td>

      {/* Ceding Company */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 align-middle">
        {submission.company}
      </td>

      {/* Type */}
      <td className="whitespace-nowrap px-6 py-4 text-sm align-middle">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          type === 'proportional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {type === 'proportional' ? 'Proportional' : 'Non-Proportional'}
        </span>
      </td>

      {/* Policy Reference */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 align-middle">
        {policyRefNumber.current}
      </td>

      {/* Insured */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 align-middle">
        <div className="font-medium text-gray-900">{submission.insured}</div>
      </td>

      {/* Class of Business */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.classOfBusiness}
      </td>

      {/* Business Occupation */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.businessOccupation}
      </td>

      {/* Start Date */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {new Date(submission.startDate).toLocaleDateString()}
      </td>

      {/* End Date */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {new Date(submission.endDate).toLocaleDateString()}
      </td>

      {/* Risk Country */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.riskCountry}
      </td>

      {/* Sum Insured */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {formatLargeCurrency(submission.sumInsured)}
      </td>

      {/* Premium Amount */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.premiumAmount}
      </td>

      {/* Premium Rate */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.premiumRate}%
      </td>

      {/* Commission */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.commission}%
      </td>

      {/* Reinsurer Rating */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 align-middle">
        {submission.reinsurer_rating}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-6 py-4 text-sm align-middle">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
          {submission.status}
        </span>
      </td>

      {/* Actions - Sticky Right */}
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 sticky right-0 bg-white z-10 align-middle">
        <div className="flex space-x-3 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick();
            }}
            className="text-gray-400 hover:text-gray-500"
            title="View Details"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit action
            }}
            className="text-gray-400 hover:text-gray-500"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete action
            }}
            className="text-gray-400 hover:text-gray-500"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BrokerSubmissionRow; 