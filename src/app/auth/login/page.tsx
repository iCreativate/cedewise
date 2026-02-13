'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

// Demo credentials for testing
const demoCredentials = [
  { role: 'Broker', email: 'broker@demo.com', password: 'broker123' },
  { role: 'Insurer', email: 'insurer@demo.com', password: 'insurer123' },
  { role: 'Reinsurer', email: 'reinsurer@demo.com', password: 'reinsurer123' }
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const success = await login(email, password)
      
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Invalid credentials. Try a demo account or ensure email is valid and password is at least 6 characters.')
      }
    } catch (err) {
      setError('An error occurred during login.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const useDemoCredentials = (demoUser: typeof demoCredentials[0]) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
  }

  return (
    <div>
      <div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">
            <span className="text-gray-900">Cede</span>wise
          </h1>
          <p className="mt-1 text-sm text-gray-500">The Complete Reinsurance Management Platform</p>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            register for a new account
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button 
              type="button" 
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {showDemoCredentials ? 'Hide demo accounts' : 'Show demo accounts'}
            </button>
          </div>
        </div>

        {showDemoCredentials && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">Demo Accounts:</div>
            <ul className="space-y-2 text-sm text-blue-700">
              {demoCredentials.map((cred, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{cred.role}:</span> {cred.email} / {cred.password}
                  </div>
                  <button
                    type="button"
                    onClick={() => useDemoCredentials(cred)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
} 