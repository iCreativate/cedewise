'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'

// This would typically come from an API or database
const coursesData = {
  1: {
    id: 1,
    title: 'Introduction to Reinsurance',
    description: 'Learn the fundamentals of reinsurance and its role in risk management',
    duration: '2 hours',
    modules: [
      { id: 1, title: 'Introduction to Reinsurance', duration: '15 min', completed: true },
      { id: 2, title: 'Types of Reinsurance', duration: '20 min', completed: true },
      { id: 3, title: 'Reinsurance vs Insurance', duration: '25 min', completed: true },
      { id: 4, title: 'Reinsurance Market', duration: '30 min', completed: true },
      { id: 5, title: 'Final Assessment', duration: '30 min', completed: true },
    ],
    progress: 100,
    lastAccessed: '2024-04-10',
    lastModule: 5,
  },
  2: {
    id: 2,
    title: 'Treaty Reinsurance',
    description: 'Understanding treaty reinsurance arrangements and their applications',
    duration: '3 hours',
    modules: [
      { id: 1, title: 'Introduction to Treaty Reinsurance', duration: '20 min', completed: true },
      { id: 2, title: 'Proportional vs Non-Proportional', duration: '25 min', completed: true },
      { id: 3, title: 'Quota Share Treaties', duration: '30 min', completed: true },
      { id: 4, title: 'Surplus Treaties', duration: '35 min', completed: true },
      { id: 5, title: 'Treaty Pricing', duration: '40 min', completed: false },
      { id: 6, title: 'Excess of Loss Treaties', duration: '30 min', completed: false },
      { id: 7, title: 'Catastrophe Reinsurance', duration: '25 min', completed: false },
      { id: 8, title: 'Final Assessment', duration: '35 min', completed: false },
    ],
    progress: 60,
    lastAccessed: '2024-04-14',
    lastModule: 5,
  },
  3: {
    id: 3,
    title: 'Facultative Reinsurance',
    description: 'Deep dive into facultative reinsurance and case-by-case risk assessment',
    duration: '2.5 hours',
    modules: [
      { id: 1, title: 'Introduction to Facultative Reinsurance', duration: '20 min', completed: false },
      { id: 2, title: 'Facultative vs Treaty', duration: '25 min', completed: false },
      { id: 3, title: 'Underwriting Process', duration: '30 min', completed: false },
      { id: 4, title: 'Pricing Considerations', duration: '35 min', completed: false },
      { id: 5, title: 'Case Studies', duration: '40 min', completed: false },
      { id: 6, title: 'Final Assessment', duration: '30 min', completed: false },
    ],
    progress: 0,
    lastAccessed: null,
    lastModule: null,
  },
  4: {
    id: 4,
    title: 'Risk Assessment',
    description: 'Advanced techniques in risk assessment and portfolio management',
    duration: '4 hours',
    modules: [
      { id: 1, title: 'Introduction to Risk Assessment', duration: '20 min', completed: true },
      { id: 2, title: 'Risk Identification', duration: '25 min', completed: true },
      { id: 3, title: 'Risk Scoring', duration: '30 min', completed: false },
      { id: 4, title: 'Risk Mitigation Strategies', duration: '35 min', completed: false },
      { id: 5, title: 'Portfolio Analysis', duration: '40 min', completed: false },
      { id: 6, title: 'Catastrophe Modeling', duration: '30 min', completed: false },
      { id: 7, title: 'Risk-Based Capital', duration: '25 min', completed: false },
      { id: 8, title: 'Stress Testing', duration: '30 min', completed: false },
      { id: 9, title: 'Regulatory Requirements', duration: '25 min', completed: false },
      { id: 10, title: 'Final Assessment', duration: '35 min', completed: false },
    ],
    progress: 30,
    lastAccessed: '2024-04-05',
    lastModule: 3,
  },
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const courseId = Number(params.id)
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setCourse(coursesData[courseId as keyof typeof coursesData])
    setLoading(false)
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
          <Link
            href="/learning-portal"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            Back to Learning Portal
          </Link>
        </div>
      </div>
    )
  }

  // Find the next incomplete module
  const nextModule = course.modules.find((module: any) => !module.completed)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/learning-portal"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" aria-hidden="true" />
          Back to Learning Portal
        </Link>
      </div>

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center gap-x-3">
          <div className="rounded-lg bg-indigo-50 p-3">
            <AcademicCapIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{course.title}</h1>
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
            <span>{course.modules.length} modules</span>
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
      </div>

      {/* Continue Learning Section */}
      {nextModule && course.progress < 100 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next module:</p>
              <p className="text-base font-medium text-gray-900">{nextModule.title}</p>
              <p className="text-xs text-gray-500 mt-1">{nextModule.duration}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlayCircleIcon className="mr-1 h-5 w-5" aria-hidden="true" />
              Start Module
            </button>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Course Modules</h2>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {course.modules.map((module: any) => (
            <li key={module.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {module.completed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" />
                  ) : module.id <= (course.lastModule || 0) ? (
                    <PlayCircleIcon className="h-5 w-5 text-indigo-500 mr-3" aria-hidden="true" />
                  ) : (
                    <LockClosedIcon className="h-5 w-5 text-gray-400 mr-3" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{module.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{module.duration}</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={module.id > (course.lastModule || 0) + 1}
                  className={classNames(
                    'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold',
                    module.completed
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : module.id <= (course.lastModule || 0)
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {module.completed ? 'Completed' : module.id <= (course.lastModule || 0) ? 'Start' : 'Locked'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 