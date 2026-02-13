'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function LearningPortal() {
  const [searchQuery, setSearchQuery] = useState('')

  const courses = [
    {
      id: 1,
      title: 'Introduction to Reinsurance',
      description: 'Learn the fundamentals of reinsurance and its importance in risk management.',
      duration: '2 hours',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Risk Assessment Techniques',
      description: 'Master the methods of evaluating and assessing insurance risks.',
      duration: '3 hours',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Treaty Reinsurance',
      description: 'Understand treaty reinsurance contracts and their applications.',
      duration: '2.5 hours',
      level: 'Advanced'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Learning Portal</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select className="border rounded-lg px-4 py-2 bg-white">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                {course.level}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{course.duration}</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Start Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 