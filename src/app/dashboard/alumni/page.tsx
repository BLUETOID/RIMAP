'use client'

import { useAppContext } from '../../../context/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import GamificationDashboard from '../../../components/GamificationDashboard'
import { 
  UserGroupIcon, 
  CalendarIcon, 
  GiftIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  SparklesIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AlumniDashboard() {
  const { user, isAuthenticated, mentorshipRequests, events, donations } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (user?.role !== 'alumni') {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'admin') {
        router.push('/admin')
      } else if (user?.role === 'student') {
        router.push('/dashboard/student')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'alumni') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Get user-specific data
  const userMentorshipRequests = mentorshipRequests.filter(req => req.mentorId === user.id)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .slice(0, 3)
  const recentDonations = donations
    .filter(donation => donation.featured)
    .slice(0, 2)

  const quickActions = [
    {
      title: 'Browse Directory',
      description: 'Connect with fellow alumni',
      icon: UserGroupIcon,
      href: '/directory',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Upcoming Events',
      description: 'Join alumni gatherings',
      icon: CalendarIcon,
      href: '/events',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'Make a Donation',
      description: 'Support your alma mater',
      icon: GiftIcon,
      href: '/donations',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Mentorship',
      description: 'Guide current students',
      icon: AcademicCapIcon,
      href: '/mentorship',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-blue-100 text-lg">
                Ready to connect, mentor, and make an impact today?
              </p>
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4" />
                  <span>Alumni Member</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Class of {user.graduationYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Dashboard */}
        <div className="mb-8">
          <GamificationDashboard />
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link 
                  key={action.title}
                  href={action.href}
                  className={`group bg-gradient-to-r ${action.color} ${action.hoverColor} p-6 rounded-xl text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-lg">→</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentorship Requests */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-500" />
                <span>Mentorship Requests</span>
              </h3>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                {userMentorshipRequests.length}
              </span>
            </div>
            {userMentorshipRequests.length > 0 ? (
              <div className="space-y-3">
                {userMentorshipRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.menteeName}
                      </p>
                      <p className="text-xs text-gray-500">{request.subject}</p>
                    </div>
                  </div>
                ))}
                <Link 
                  href="/mentorship"
                  className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium mt-4"
                >
                  View All Requests →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No pending requests</p>
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-purple-500" />
                <span>Upcoming Events</span>
              </h3>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{event.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
                <Link 
                  href="/events"
                  className="block text-center text-sm text-purple-600 hover:text-purple-700 font-medium mt-4"
                >
                  View All Events →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No upcoming events</p>
              </div>
            )}
          </div>

          {/* Featured Donations */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HeartIcon className="h-5 w-5 text-green-500" />
                <span>Ways to Give Back</span>
              </h3>
            </div>
            {recentDonations.length > 0 ? (
              <div className="space-y-3">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">{donation.title}</h4>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        ${donation.raised.toLocaleString()} raised
                      </div>
                      <div className="text-xs font-medium text-green-600">
                        {Math.round((donation.raised / donation.goal) * 100)}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (donation.raised / donation.goal) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Link 
                  href="/donations"
                  className="block text-center text-sm text-green-600 hover:text-green-700 font-medium mt-4"
                >
                  Explore Causes →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No active campaigns</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
