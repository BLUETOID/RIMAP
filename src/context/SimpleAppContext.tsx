'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserRole = 'alumni' | 'student' | 'admin'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  isVerified: boolean
  totalPoints: number
  loginStreak: number
  lastLoginDate: string
}

type SimpleAppContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>
  logout: () => void
  isAuthenticated: boolean
}

const SimpleAppContext = createContext<SimpleAppContextType | undefined>(undefined)

export function SimpleAppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true)
    
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('currentUser')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentUser')
        }
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    // Simple test user
    if (email === 'admin@test.com' && password === 'admin') {
      const testUser: User = {
        id: '1',
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
        isVerified: true,
        totalPoints: 100,
        loginStreak: 1,
        lastLoginDate: new Date().toISOString()
      }
      
      setUser(testUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(testUser))
      }
      
      return { success: true, user: testUser }
    }
    
    return { success: false }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
  }

  const value: SimpleAppContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user && isHydrated
  }

  return <SimpleAppContext.Provider value={value}>{children}</SimpleAppContext.Provider>
}

export function useSimpleAppContext() {
  const context = useContext(SimpleAppContext)
  if (context === undefined) {
    throw new Error('useSimpleAppContext must be used within a SimpleAppProvider')
  }
  return context
}
