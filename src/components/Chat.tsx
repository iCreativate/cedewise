'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'broker' | 'reinsurer' | 'insurer'
  timestamp: Date
}

interface ChatProps {
  submissionId: string
  className?: string
}

export default function Chat({ submissionId, className = '' }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { userRole, userName } = useUser()

  // Auto-scroll to the most recent message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Load initial messages
  useEffect(() => {
    // TODO: Replace with actual API call to load messages
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hello, I have some questions about this submission.',
        sender: 'reinsurer',
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        text: 'Sure, what would you like to know?',
        sender: 'broker',
        timestamp: new Date(Date.now() - 75600000)
      }
    ]
    setMessages(mockMessages)
  }, [submissionId])

  const handleSendMessage = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text: newMessage.trim(),
      sender: userRole as 'broker' | 'reinsurer' | 'insurer',
      timestamp: new Date()
    }

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call to send message
      setMessages(prev => [...prev, message])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex flex-col h-[400px] border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="bg-green-600 text-white px-4 py-2 font-medium">
        Chat
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === userRole ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === userRole
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div 
                className={`text-xs mt-1 ${
                  message.sender === userRole ? 'text-green-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
            placeholder="Type your message..."
            className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            disabled={isLoading || !newMessage.trim()}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 