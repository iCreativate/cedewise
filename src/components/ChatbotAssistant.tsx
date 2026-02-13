'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { sendMessageToLex } from '@/lib/aws';
import { logger } from '@/lib/logger';
import { useUser } from '@/context/UserContext';
import { Typing } from '@/components/Typing';
import debounce from 'lodash.debounce';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotAssistantProps {
  botId: string;
  botAliasId: string;
  localeId: string;
  initialMessage?: string;
  className?: string;
}

// Amazon Lex configuration
const DEFAULT_LOCALE = 'en_US';

// Generate a unique ID for messages
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export default function ChatbotAssistant({ 
  botId, 
  botAliasId, 
  localeId = DEFAULT_LOCALE,
  initialMessage = 'Hello! I\'m your reinsurance assistant. How can I help you today?',
  className = ''
}: ChatbotAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: generateId(), text: initialMessage, sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userRole, userName } = useUser();
  const sessionIdRef = useRef(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll to the most recent message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Set mounted state after component mounts to enable client-side features
  useEffect(() => {
    setIsMounted(true);
    
    // Clean up resources when component unmounts
    return () => {
      debouncedSendMessage.cancel();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: generateId(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      logger.info('Sending message to Lex', {
        context: 'CHATBOT',
        data: {
          userMessage: input.trim(),
          userRole,
          sessionId: sessionIdRef.current
        }
      });
      
      const response = await sendMessageToLex(
        botId,
        botAliasId,
        localeId,
        sessionIdRef.current,
        userMessage.text
      );
      
      if (response.success && response.messages && response.messages.length > 0) {
        // Add all messages from Lex as bot messages
        const botMessages: Message[] = response.messages
          .filter(message => message && message.content) // Filter out null/undefined messages
          .map(message => ({
          id: generateId(),
          text: message.content || 'Sorry, I couldn\'t process that.',
          sender: 'bot',
          timestamp: new Date()
        }));
        
        if (botMessages.length > 0) {
        setMessages(prev => [...prev, ...botMessages]);
        
        // Log successful interaction
        logger.trackUserAction('CHATBOT_INTERACTION', userName || undefined, {
          intent: response.interpretations?.[0]?.intent?.name || 'unknown'
        });
        } else {
          // No valid messages
          setMessages(prev => [...prev, {
            id: generateId(),
            text: 'I\'m having trouble understanding. Could you try rephrasing?',
            sender: 'bot',
            timestamp: new Date()
          }]);
        }
      } else {
        // Handle error or no messages
        setMessages(prev => [...prev, {
          id: generateId(),
          text: 'I\'m having trouble understanding. Could you try rephrasing?',
          sender: 'bot',
          timestamp: new Date()
        }]);
        
        logger.warn('Empty or error response from Lex', {
          context: 'CHATBOT',
          data: { response }
        });
      }
    } catch (error) {
      // Handle exception
      setMessages(prev => [...prev, {
        id: generateId(),
        text: 'Sorry, I\'m currently experiencing technical difficulties. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      logger.error('Error communicating with Lex', {
        context: 'CHATBOT',
        data: { error }
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a debounced version of sendMessage to prevent multiple rapid requests
  const debouncedSendMessage = useCallback(
    debounce((message: string) => sendMessage(), 300),
    [botId, botAliasId, localeId]
  );
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      debouncedSendMessage(input);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Only render full component after mounting to avoid hydration issues
  if (!isMounted) {
    return <div className="p-4 bg-gray-50 animate-pulse">Loading chat assistant...</div>;
  }

  return (
    <div className={`flex flex-col h-[400px] border border-gray-200 rounded-none shadow-sm overflow-hidden ${className}`}>
      <div className="bg-green-600 text-white px-4 py-2 font-medium">
        Cedewise Assistant
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div 
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="p-2 rounded-lg max-w-[85%] bg-blue-100 text-blue-800 self-start">
            <Typing />
          </div>
        )}
        {error && (
          <div className="p-2 rounded-lg max-w-[85%] bg-red-100 text-red-800 self-start">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center">
          <textarea
            className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Type your message..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            onClick={() => debouncedSendMessage(input)}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 