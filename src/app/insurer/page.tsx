'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function InsurerRedirectPage() {
  const router = useRouter()
  const { userRole } = useUser()

  useEffect(() => {
    // If user is not an insurer, redirect to dashboard
    if (userRole !== 'insurer') {
      router.replace('/dashboard')
    } else {
      // If they are an insurer, redirect to the proper insurer dashboard
      router.replace('/non-life/insurer')
    }
  }, [userRole, router])

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800">Redirecting...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you to the appropriate page.</p>
      </div>
    </div>
  )
} 