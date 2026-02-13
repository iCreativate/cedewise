import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the user role from cookies
  const userRole = request.cookies.get('userRole')?.value

  // Get the requested path
  const path = request.nextUrl.pathname
  
  // For the root path ('/'), we always want to show the landing page
  // regardless of authentication status
  if (path === '/') {
    return NextResponse.next()
  }

  // If trying to access protected routes without being logged in
  if (path.startsWith('/non-life') && !userRole) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Ensure pages requiring specific roles are protected
  if (path.startsWith('/non-life/reinsurer') && userRole !== 'reinsurer' && userRole !== 'insurer') {
    // Redirect to dashboard if role is not appropriate
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is accessing dashboard but is not authenticated, redirect to landing page
  if (path.startsWith('/dashboard') && !userRole) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue with the request for all other paths
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/',
    '/non-life/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
} 