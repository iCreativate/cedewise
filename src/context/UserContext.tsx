'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

type UserRole = 'broker' | 'insurer' | 'reinsurer' | null

interface UserContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  userName: string | null
  brokerCompany: string | null
  brokerEmail: string | null
  brokerPhone: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [brokerCompany, setBrokerCompany] = useState<string | null>(null)
  const [brokerEmail, setBrokerEmail] = useState<string | null>(null)
  const [brokerPhone, setBrokerPhone] = useState<string | null>(null)

  // Restore session without blocking the app tree — gating children caused infinite
  // "Loading Cedewise" when hydration was slow, failed, or SSR never flipped client state.
  useEffect(() => {
    const initializeUser = () => {
      try {
        const cookieRole = Cookies.get('userRole') as UserRole | undefined
        const cookieName = Cookies.get('userName')
        const cookieBrokerCompany = Cookies.get('brokerCompany')
        const cookieBrokerEmail = Cookies.get('brokerEmail')
        const cookieBrokerPhone = Cookies.get('brokerPhone')

        let storedRole: string | null = null
        let storedName: string | null = null
        let storedBrokerCompany: string | null = null
        let storedBrokerEmail: string | null = null
        let storedBrokerPhone: string | null = null
        try {
          storedRole = localStorage.getItem('userRole')
          storedName = localStorage.getItem('userName')
          storedBrokerCompany = localStorage.getItem('brokerCompany')
          storedBrokerEmail = localStorage.getItem('brokerEmail')
          storedBrokerPhone = localStorage.getItem('brokerPhone')
        } catch {
          /* private mode / storage disabled */
        }

        const role = cookieRole || (storedRole as UserRole) || null
        const name = cookieName || storedName
        const company = cookieBrokerCompany || storedBrokerCompany
        const email = cookieBrokerEmail || storedBrokerEmail
        const phone = cookieBrokerPhone || storedBrokerPhone

        if (role) {
          setUserRole(role)
          setUserName(name)
          setBrokerCompany(company)
          setBrokerEmail(email)
          setBrokerPhone(phone)
          setIsAuthenticated(true)

          try {
            localStorage.setItem('userRole', role)
            localStorage.setItem('userName', name || '')
            if (role === 'broker') {
              localStorage.setItem('brokerCompany', company || 'Marsh Insurance Brokers')
              localStorage.setItem('brokerEmail', email || 'contact@marshbrokers.com')
              localStorage.setItem('brokerPhone', phone || '+27 11 123 4567')
              Cookies.set('brokerCompany', company || 'Marsh Insurance Brokers', { path: '/' })
              Cookies.set('brokerEmail', email || 'contact@marshbrokers.com', { path: '/' })
              Cookies.set('brokerPhone', phone || '+27 11 123 4567', { path: '/' })
            }
            Cookies.set('userRole', role, { path: '/' })
            Cookies.set('userName', name || '', { path: '/' })
          } catch {
            /* persistence optional */
          }
        } else {
          setIsAuthenticated(false)
          setUserRole(null)
          setUserName(null)
          setBrokerCompany(null)
          setBrokerEmail(null)
          setBrokerPhone(null)
        }
      } catch (error) {
        console.error('Error initializing user context:', error)
      }
    }

    initializeUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    
    // For demo, extract role from email
    let role: UserRole = null
    let name = 'Demo User'
    let company = ''
    let brokerEmail = ''
    let phone = ''
    
    if (email.includes('broker')) {
      role = 'broker'
      name = 'Broker Demo'
      company = 'Marsh Insurance Brokers'
      brokerEmail = 'broker@marshbrokers.com'
      phone = '+27 11 123 4567'
    } else if (email.includes('insurer')) {
      role = 'insurer'
      name = 'Insurer Demo'
    } else if (email.includes('reinsurer')) {
      role = 'reinsurer'
      name = 'Smith Mangena'
    } else if (email && password.length >= 6) {
      // Default to broker for other valid logins
      role = 'broker'
      name = 'Default Broker'
      company = 'ABC Brokers'
      brokerEmail = 'contact@abcbrokers.com'
      phone = '+27 11 987 6543'
    }
    
    if (role) {
      setUserRole(role)
      setUserName(name)
      setIsAuthenticated(true)
      
      if (role === 'broker') {
        setBrokerCompany(company)
        setBrokerEmail(brokerEmail)
        setBrokerPhone(phone)
        
        // Store broker info
        localStorage.setItem('brokerCompany', company)
        localStorage.setItem('brokerEmail', brokerEmail)
        localStorage.setItem('brokerPhone', phone)
        Cookies.set('brokerCompany', company, { path: '/', expires: 7 })
        Cookies.set('brokerEmail', brokerEmail, { path: '/', expires: 7 })
        Cookies.set('brokerPhone', phone, { path: '/', expires: 7 })
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('userRole', role)
      localStorage.setItem('userName', name)
      
      // Also store in cookies for middleware access
      Cookies.set('userRole', role, { path: '/', expires: 7 }) // 7 day expiry
      Cookies.set('userName', name, { path: '/', expires: 7 })
      
      console.log('Login successful, role set to:', role)
      console.log('Cookie set:', Cookies.get('userRole'))
      
      return true
    }
    
    return false
  }
  
  const logout = () => {
    setUserRole(null)
    setIsAuthenticated(false)
    setUserName(null)
    setBrokerCompany(null)
    setBrokerEmail(null)
    setBrokerPhone(null)
    
    // Clear from localStorage
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('brokerCompany')
    localStorage.removeItem('brokerEmail')
    localStorage.removeItem('brokerPhone')
    
    // Clear from cookies
    Cookies.remove('userRole', { path: '/' })
    Cookies.remove('userName', { path: '/' })
    Cookies.remove('brokerCompany', { path: '/' })
    Cookies.remove('brokerEmail', { path: '/' })
    Cookies.remove('brokerPhone', { path: '/' })
    
    console.log('Logged out, cookies cleared')
  }

  return (
    <UserContext.Provider value={{ 
      userRole, 
      setUserRole,
      isAuthenticated,
      login,
      logout,
      userName,
      brokerCompany,
      brokerEmail,
      brokerPhone
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 