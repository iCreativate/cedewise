'use client'

import { Fragment, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from 'date-fns'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'

// Define event types
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'meeting' | 'deadline' | 'renewal' | 'payment';
  description?: string;
  participants?: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// Sample calendar events
const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Treaty Renewal Meeting',
    date: '2023-11-15',
    time: '10:00 AM',
    type: 'meeting',
    description: 'Annual treaty renewal discussion with Global Insurance Ltd.',
    participants: ['John Davis', 'Sarah Miller', 'David Thompson']
  },
  {
    id: '2',
    title: 'Premium Payment Due',
    date: '2023-11-20',
    type: 'payment',
    description: 'Continental Reinsurance premium payment deadline.'
  },
  {
    id: '3',
    title: 'Policy Renewal Deadline',
    date: '2023-11-25',
    type: 'deadline',
    description: 'Last date to submit renewal documents for Pacific Marine Co policies.'
  },
  {
    id: '4',
    title: 'Quarterly Review',
    date: '2023-11-10',
    time: '2:00 PM',
    type: 'meeting',
    description: 'Quarterly portfolio review with team leads.',
    participants: ['Michael Brown', 'Emily Thompson', 'Robert Lee', 'Lisa Wong']
  },
  {
    id: '5',
    title: 'Property Treaty Renewal',
    date: '2023-11-30',
    type: 'renewal',
    description: 'European Risk Partners property treaty renewal date.'
  }
]

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Calendar navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Get events for the selected date
  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date)
  }

  // Get events for the currently visible month
  const getEventsForMonth = () => {
    const monthStr = (currentMonth + 1).toString().padStart(2, '0')
    const yearStr = currentYear.toString()
    return events.filter(event => event.date.startsWith(`${yearStr}-${monthStr}`))
  }

  // Get month days array
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="border bg-gray-50"></div>)
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const isToday = dateStr === `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
      const isSelected = dateStr === selectedDate
      const dayEvents = getEventsForDate(dateStr)
      
      days.push(
        <div 
          key={day} 
          className={`border min-h-[100px] p-1 ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-800 rounded-full px-2 py-0.5">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs truncate rounded px-2 py-1 
                  ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 
                    event.type === 'deadline' ? 'bg-red-100 text-red-800' : 
                    event.type === 'renewal' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 pl-2">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  // Render event details for selected date
  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null
    
    const dayEvents = getEventsForDate(selectedDate)
    const displayDate = new Date(selectedDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    if (dayEvents.length === 0) {
      return (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold">{displayDate}</h3>
          <p className="text-gray-500 mt-2">No events scheduled for this day.</p>
          <button className="mt-4 text-indigo-600 hover:text-indigo-800">
            + Add New Event
          </button>
        </div>
      )
    }
    
    return (
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{displayDate}</h3>
          <button className="text-indigo-600 hover:text-indigo-800">
            + Add Event
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {dayEvents.map(event => (
            <div key={event.id} className="border-l-4 pl-4 py-2 
              ${event.type === 'meeting' ? 'border-blue-500' : 
                event.type === 'deadline' ? 'border-red-500' : 
                event.type === 'renewal' ? 'border-green-500' : 
                'border-yellow-500'}"
              style={{
                borderLeftColor: 
                  event.type === 'meeting' ? '#3b82f6' : 
                  event.type === 'deadline' ? '#ef4444' : 
                  event.type === 'renewal' ? '#10b981' : 
                  '#f59e0b'
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  {event.time && (
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                  )}
                </div>
                <span className="capitalize text-xs px-2 py-1 rounded-full
                  ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 
                    event.type === 'deadline' ? 'bg-red-100 text-red-800' : 
                    event.type === 'renewal' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'}"
                  style={{
                    backgroundColor: 
                      event.type === 'meeting' ? '#dbeafe' : 
                      event.type === 'deadline' ? '#fee2e2' : 
                      event.type === 'renewal' ? '#d1fae5' : 
                      '#fef3c7',
                    color: 
                      event.type === 'meeting' ? '#1e40af' : 
                      event.type === 'deadline' ? '#b91c1c' : 
                      event.type === 'renewal' ? '#047857' : 
                      '#92400e'
                  }}
                >
                  {event.type}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
              )}
              {event.participants && event.participants.length > 0 && (
                <div className="mt-2 flex items-start">
                  <UserGroupIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-1" />
                  <div className="text-sm text-gray-500">
                    {event.participants.join(', ')}
                  </div>
                </div>
              )}
              <div className="mt-3 flex space-x-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
                <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Month summary section
  const renderMonthSummary = () => {
    const monthlyEvents = getEventsForMonth()
    const meetings = monthlyEvents.filter(e => e.type === 'meeting').length
    const deadlines = monthlyEvents.filter(e => e.type === 'deadline').length
    const renewals = monthlyEvents.filter(e => e.type === 'renewal').length
    const payments = monthlyEvents.filter(e => e.type === 'payment').length
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Month Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-lg font-medium">{meetings}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">Meetings</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-lg font-medium">{deadlines}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">Deadlines</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-lg font-medium">{renewals}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">Renewals</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <span className="text-lg font-medium">{payments}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">Payments</div>
          </div>
        </div>
      </div>
    )
  }

  // Function to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Function to get day of week (0-6) for first day of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your meetings, deadlines, renewals and payment schedules.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Event
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          {/* Calendar navigation */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => {
                  setCurrentMonth(today.getMonth())
                  setCurrentYear(today.getFullYear())
                }}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {renderCalendarDays()}
            </div>
          </div>
          
          {/* Selected date events */}
          {selectedDate && (
            <div className="mt-6">
              {renderSelectedDateEvents()}
            </div>
          )}
        </div>
        
        <div className="md:w-1/4">
          {renderMonthSummary()}
          
          {/* Upcoming events */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.date) >= today)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="border-l-4 pl-3 py-2" style={{
                    borderLeftColor: 
                      event.type === 'meeting' ? '#3b82f6' : 
                      event.type === 'deadline' ? '#ef4444' : 
                      event.type === 'renewal' ? '#10b981' : 
                      '#f59e0b'
                  }}>
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                      {event.time && ` at ${event.time}`}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 