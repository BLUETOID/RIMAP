'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserRole = 'alumni' | 'student' | 'admin'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  graduationYear?: number
  department?: string
  currentCompany?: string
  position?: string
  skills?: string[]
  bio?: string
  isVerified: boolean
  profilePicture?: string
}

type AppContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>
  logout: () => void
  isAuthenticated: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const testUsers: (User & { password: string })[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@alumni.edu',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    id: 'alumni1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'alumni',
    graduationYear: 2020,
    department: 'Computer Science',
    currentCompany: 'Google',
    position: 'Software Engineer',
    skills: ['React', 'Node.js', 'Python'],
    bio: 'Passionate about technology and mentoring',
    isVerified: true
  },
  {
    id: 'student1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'student123',
    role: 'student',
    department: 'Computer Science',
    isVerified: true
  }
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load user from localStorage on app start (client-side only)
  useEffect(() => {
    setIsHydrated(true)
    
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('currentUser')
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    const foundUser = testUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      
      setUser(userWithoutPassword)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      }
      
      return { success: true, user: userWithoutPassword }
    }
    return { success: false }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
  }

  const value: AppContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user && isHydrated
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
