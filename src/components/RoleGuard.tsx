'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

type UserRole = 'broker' | 'insurer' | 'reinsurer' | null

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
  redirectTo?: string
}

/**
 * A component that guards routes based on user roles
 * Only renders its children if the user has one of the allowed roles
 * Otherwise redirects to the specified path (default: /dashboard)
 */
export default function RoleGuard({ 
  allowedRoles, 
  children, 
  redirectTo = '/dashboard' 
}: RoleGuardProps) {
  const { userRole, isAuthenticated } = useUser()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectPath, setRedirectPath] = useState('')
  
  // First effect just checks and sets state, but doesn't redirect
  useEffect(() => {
    console.log('RoleGuard: Checking auth...', { userRole, isAuthenticated, allowedRoles })
    
    // Only check once authentication state is confirmed
    if (userRole !== null || isAuthenticated === false) {
      if (!isAuthenticated) {
        console.log('RoleGuard: User not authenticated, should redirect to /')
        setShouldRedirect(true)
        setRedirectPath('/')
      } else if (userRole && !allowedRoles.includes(userRole)) {
        console.log(`RoleGuard: User role ${userRole} not in allowed roles, should redirect to ${redirectTo}`)
        setShouldRedirect(true)
        setRedirectPath(redirectTo)
      } else {
        // User is authenticated and has the correct role
        setShouldRedirect(false)
      }
      
      setIsChecking(false)
    }
  }, [userRole, isAuthenticated, allowedRoles, redirectTo])
  
  // Separate effect for actual redirection to avoid loops
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (shouldRedirect && redirectPath && !isChecking) {
      // Use a timeout to avoid immediate redirects that can cause loops
      redirectTimer = setTimeout(() => {
        console.log(`RoleGuard: Redirecting to ${redirectPath}`)
        router.push(redirectPath)
      }, 300)
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [shouldRedirect, redirectPath, router, isChecking])

  // Show loading while checking auth state
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">Loading...</h1>
          <p className="mt-2 text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    )
  }

  // Show loading if about to redirect
  if (shouldRedirect) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">Redirecting...</h1>
          <p className="mt-2 text-gray-600">Please wait...</p>
        </div>
      </div>
    )
  }

  // Render the protected content
  return <>{children}</>
} 