'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@/context/UserContext'
import { useNotifications } from '@/context/NotificationContext'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'broker' | 'reinsurer' | 'insurer'
  to?: 'broker' | 'reinsurer' | 'insurer'
  timestamp: Date
}

interface ChatProps {
  submissionId: string
  className?: string
  participantLabels?: Partial<Record<'broker' | 'reinsurer' | 'insurer', string>>
}

export default function Chat({ submissionId, className = '', participantLabels }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const lastSnapshotRef = useRef<string>('')
  const { userRole, userName } = useUser()
  const { addNotification } = useNotifications()
  const me = (userRole || 'broker') as 'broker' | 'reinsurer' | 'insurer'
  const storageKey = `cedewise:messages:${submissionId}`
  const channelName = `cedewise:chat:${submissionId}`

  const labels: Record<'broker' | 'reinsurer' | 'insurer', string> = {
    broker: participantLabels?.broker || 'Broker',
    reinsurer: participantLabels?.reinsurer || 'Reinsurer',
    insurer: participantLabels?.insurer || 'Insurer',
  }

  const defaultRecipients: Array<'broker' | 'reinsurer' | 'insurer'> =
    me === 'broker' ? ['reinsurer', 'insurer'] : ['broker']
  const recipients = defaultRecipients.filter((r) => r !== me)
  const [activeRecipient, setActiveRecipient] = useState<(typeof recipients)[number] | null>(
    recipients[0] ?? null
  )

  const loadMessages = useCallback((): Message[] => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Array<{
        id: string
        text: string
        sender: 'broker' | 'reinsurer' | 'insurer'
        to?: 'broker' | 'reinsurer' | 'insurer'
        timestamp: string
      }>
      if (!Array.isArray(parsed)) return []
      return parsed
        .filter((m) => m && typeof m === 'object' && typeof m.id === 'string')
        .map((m) => ({
          id: m.id,
          text: String(m.text ?? ''),
          sender: m.sender,
          to: m.to,
          timestamp: new Date(m.timestamp),
        }))
        .filter((m) => !Number.isNaN(m.timestamp.getTime()))
    } catch {
      return []
    }
  }, [storageKey])

  const persistMessages = useCallback((next: Message[]) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(
          next.map((m) => ({
            ...m,
            timestamp: m.timestamp.toISOString(),
          }))
        )
      )
    } catch {
      // ignore write failures (e.g. private mode)
    }
  }, [storageKey])

  const applyMessagesIfChanged = useCallback(() => {
    const next = loadMessages()
    const snapshot = JSON.stringify(
      next.map((m) => ({
        id: m.id,
        text: m.text,
        sender: m.sender,
        to: m.to,
        ts: m.timestamp.toISOString(),
      }))
    )
    if (snapshot === lastSnapshotRef.current) return

    // Notification: if there are new messages addressed to me
    try {
      const prevArr = JSON.parse(lastSnapshotRef.current || '[]') as Array<{ id: string }>
      const prevIds = new Set(prevArr.map((x) => x.id))
      const incoming = next.filter((m) => !prevIds.has(m.id) && m.sender !== me && (m.to ? m.to === me : true))
      if (incoming.length > 0) {
        const from = incoming[incoming.length - 1].sender
        addNotification(`New message from ${labels[from]}`)
      }
    } catch {
      // ignore
    }

    lastSnapshotRef.current = snapshot
    setMessages(next)
  }, [loadMessages])

  // Auto-scroll within the chat container only (and only if user is near bottom)
  useEffect(() => {
    if (!shouldAutoScrollRef.current) return
    const el = scrollContainerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  // Load initial messages
  useEffect(() => {
    applyMessagesIfChanged()
  }, [applyMessagesIfChanged])

  // Live updates across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return
      applyMessagesIfChanged()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [applyMessagesIfChanged, storageKey])

  // Live updates within same tab and across tabs (BroadcastChannel)
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return
    const bc = new BroadcastChannel(channelName)
    const onMessage = () => {
      applyMessagesIfChanged()
    }
    bc.addEventListener('message', onMessage)
    return () => {
      bc.removeEventListener('message', onMessage)
      bc.close()
    }
  }, [channelName, applyMessagesIfChanged])

  // Fallback: periodic refresh (covers edge cases where events don't fire)
  useEffect(() => {
    const t = window.setInterval(() => {
      applyMessagesIfChanged()
    }, 1000)
    return () => window.clearInterval(t)
  }, [applyMessagesIfChanged])

  const handleSendMessage = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    if (!activeRecipient) return

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text: newMessage.trim(),
      sender: me,
      to: activeRecipient,
      timestamp: new Date()
    }

    setIsLoading(true)
    try {
      setMessages(prev => {
        const next = [...prev, message]
        persistMessages(next)
        return next
      })
      setNewMessage('')
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel(channelName)
          bc.postMessage({ type: 'messages_updated' })
          bc.close()
        }
      } catch {
        // ignore
      }
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
      <div className="bg-blue-600 text-white px-4 py-2 font-medium">
        <div className="flex items-center justify-between gap-3">
          <div>
            Chat{userName ? ` • ${userName}` : ''}
          </div>
          {activeRecipient ? (
            <select
              id={`chat-recipient-${submissionId}`}
              name="recipient"
              value={activeRecipient}
              onChange={(e) => setActiveRecipient(e.target.value as any)}
              className="bg-blue-700/60 text-white text-xs rounded-md px-2 py-1 border border-blue-400/40"
            >
              {recipients.map((r) => (
                <option key={r} value={r}>
                  {labels[r]}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50"
        onScroll={() => {
          const el = scrollContainerRef.current
          if (!el) return
          const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
          shouldAutoScrollRef.current = distanceFromBottom < 80
        }}
      >
        {messages
          .filter((m) => {
            // Back-compat: if no routing info, show it in all conversations.
            if (!activeRecipient) return true
            if (!m.to) return true
            return (
              (m.sender === me && m.to === activeRecipient) ||
              (m.sender === activeRecipient && m.to === me)
            )
          })
          .map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === userRole ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === userRole
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div 
                className={`text-xs mt-1 ${
                  message.sender === userRole ? 'text-blue-100' : 'text-gray-500'
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
            id={`chat-message-${submissionId}`}
            name="message"
            autoComplete="off"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
            placeholder="Type your message..."
            className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isLoading || !newMessage.trim() || !activeRecipient}
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