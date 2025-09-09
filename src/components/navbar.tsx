'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAppContext()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    try {
      console.log('Navbar logout initiated')
      logout()
      // Immediately redirect to avoid rendering issues during state transition
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      // Still try to redirect even if logout fails
      router.push('/')
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-blue-600">RIMAAP</h1>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/directory" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Directory
                </Link>
                <Link href="/events" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Events
                </Link>
                <Link href="/mentorship" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Mentorship
                </Link>
                <Link href="/donations" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Donations
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-purple-50 border border-purple-200">
                    🛡️ Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Desktop User Info */}
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                
                {/* Profile Picture */}
                <Link href={`/profile/${user?.id}`}>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                    <span className="text-sm font-medium text-blue-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Link>

                {/* Desktop Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-gray-900 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {/* Mobile User Info */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              
              {/* Mobile Navigation Links */}
              <Link 
                href="/directory" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Directory
              </Link>
              <Link 
                href="/events" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Events
              </Link>
              <Link 
                href="/mentorship" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Mentorship
              </Link>
              <Link 
                href="/donations" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Donations
              </Link>
              
              {user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="block px-3 py-2 text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={closeMobileMenu}
                >
                  🛡️ Admin Dashboard
                </Link>
              )}
              
              {/* Mobile Logout Button */}
              <button
                onClick={() => {
                  handleLogout()
                  closeMobileMenu()
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
