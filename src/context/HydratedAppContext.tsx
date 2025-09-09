'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Simple types for hydration-safe context
type UserRole = 'alumni' | 'student' | 'admin'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  totalPoints?: number
  achievements?: any[]
  challenges?: any[]
  loginStreak?: number
  lastLoginDate?: string
}

interface HydratedAppContextType {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  login: (email: string, password: string) => { success: boolean }
  logout: () => void
}

const HydratedAppContext = createContext<HydratedAppContextType | undefined>(undefined)

// Test users for authentication
const testUsers = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@alumni.edu',
    password: 'admin123',
    role: 'admin' as UserRole,
    totalPoints: 0,
    achievements: [],
    challenges: [],
    loginStreak: 0,
    lastLoginDate: new Date().toISOString()
  },
  {
    id: 'alumni1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'alumni' as UserRole,
    totalPoints: 150,
    achievements: [],
    challenges: [],
    loginStreak: 3,
    lastLoginDate: new Date().toISOString()
  },
  {
    id: 'student1',
    name: 'Jane Smith',
    email: 'jane@student.edu',
    password: 'student123',
    role: 'student' as UserRole,
    totalPoints: 80,
    achievements: [],
    challenges: [],
    loginStreak: 1,
    lastLoginDate: new Date().toISOString()
  }
]

export function HydratedAppProvider({ children }: { children: ReactNode }) {
  // Initialize with minimal state to prevent hydration issues
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration and localStorage access safely
  useEffect(() => {
    let mounted = true
    
    const hydrateApp = async () => {
      try {
        // Mark as hydrated first
        if (mounted) {
          setIsHydrated(true)
        }
        
        // Only access localStorage after marking as hydrated
        if (typeof window !== 'undefined' && mounted) {
          const savedUser = localStorage.getItem('currentUser')
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser)
              if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
                if (mounted) {
                  setUser(parsedUser)
                }
              } else {
                localStorage.removeItem('currentUser')
              }
            } catch (error) {
              console.error('Failed to parse saved user:', error)
              localStorage.removeItem('currentUser')
            }
          }
        }
      } catch (error) {
        console.error('Hydration error:', error)
      }
    }

    hydrateApp()

    return () => {
      mounted = false
    }
  }, [])

  const login = (email: string, password: string) => {
    try {
      const foundUser = testUsers.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          totalPoints: foundUser.totalPoints,
          achievements: foundUser.achievements,
          challenges: foundUser.challenges,
          loginStreak: foundUser.loginStreak,
          lastLoginDate: foundUser.lastLoginDate
        }
        
        setUser(userWithoutPassword)
        
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
          } catch (error) {
            console.error('Failed to save user to localStorage:', error)
          }
        }
        
        return { success: true }
      }
      
      return { success: false }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false }
    }
  }

  const logout = () => {
    try {
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const contextValue: HydratedAppContextType = {
    user,
    isAuthenticated: !!user,
    isHydrated,
    login,
    logout
  }

  return (
    <HydratedAppContext.Provider value={contextValue}>
      {children}
    </HydratedAppContext.Provider>
  )
}

export function useHydratedAppContext() {
  const context = useContext(HydratedAppContext)
  if (context === undefined) {
    throw new Error('useHydratedAppContext must be used within a HydratedAppProvider')
  }
  return context
}
