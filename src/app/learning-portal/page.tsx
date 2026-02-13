'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid'

const courses = [
  {
    id: 1,
    title: 'Introduction to Reinsurance',
    description: 'Learn the fundamentals of reinsurance and its role in risk management',
    duration: '2 hours',
    modules: 5,
    progress: 100,
    lastAccessed: '2024-04-10',
    lastModule: 'Final Assessment',
  },
  {
    id: 2,
    title: 'Treaty Reinsurance',
    description: 'Understanding treaty reinsurance arrangements and their applications',
    duration: '3 hours',
    modules: 8,
    progress: 60,
    lastAccessed: '2024-04-14',
    lastModule: 'Treaty Pricing',
  },
  {
    id: 3,
    title: 'Facultative Reinsurance',
    description: 'Deep dive into facultative reinsurance and case-by-case risk assessment',
    duration: '2.5 hours',
    modules: 6,
    progress: 0,
    lastAccessed: null,
    lastModule: null,
  },
  {
    id: 4,
    title: 'Risk Assessment',
    description: 'Advanced techniques in risk assessment and portfolio management',
    duration: '4 hours',
    modules: 10,
    progress: 30,
    lastAccessed: '2024-04-05',
    lastModule: 'Risk Scoring',
  },
]

const resources = [
  {
    title: 'Reinsurance Handbook',
    description: 'Comprehensive guide to reinsurance principles and practices',
    type: 'PDF',
    size: '2.5 MB',
  },
  {
    title: 'Case Studies Collection',
    description: 'Real-world examples of reinsurance applications',
    type: 'PDF',
    size: '1.8 MB',
  },
  {
    title: 'Industry Reports',
    description: 'Latest trends and analysis in the reinsurance market',
    type: 'PDF',
    size: '3.2 MB',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function LearningPortal() {
  const [activeTab, setActiveTab] = useState('courses')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Learning Portal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Access courses and resources to enhance your knowledge of reinsurance
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('courses')}
              className={classNames(
                activeTab === 'courses'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={classNames(
                activeTab === 'resources'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
            >
              Resources
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'courses' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/learning-portal/courses/${course.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-500 hover:shadow-sm"
                >
                  <div className="flex items-center gap-x-3">
                    <div className="rounded-lg bg-indigo-50 p-3">
                      <AcademicCapIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{course.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-x-4 text-sm">
                    <div className="flex items-center gap-x-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <BookOpenIcon className="h-4 w-4 text-gray-400" />
                      <span>{course.modules} modules</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-indigo-600 font-medium">{course.progress}% complete</span>
                      <span className="text-gray-500">{course.progress === 100 ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  {course.lastAccessed && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Last accessed: {course.lastAccessed}</p>
                      {course.lastModule && <p>Last module: {course.lastModule}</p>}
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-end">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
                      {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                      <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-center gap-x-3">
                    <div className="rounded-lg bg-indigo-50 p-3">
                      <BookOpenIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-x-4 text-sm text-gray-500">
                    <span>{resource.type}</span>
                    <span>{resource.size}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 