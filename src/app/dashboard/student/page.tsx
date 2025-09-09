'use client'

import { useAppContext } from '../../../context/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import GamificationDashboard from '../../../components/GamificationDashboard'
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BookOpenIcon,
  SparklesIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function StudentDashboard() {
  const { user, isAuthenticated, mentorshipRequests, events, alumni } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (user?.role !== 'student') {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'admin') {
        router.push('/admin')
      } else if (user?.role === 'alumni') {
        router.push('/dashboard/alumni')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Get user-specific data
  const userMentorshipRequests = mentorshipRequests.filter(req => req.menteeId === user.id)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .slice(0, 3)
  const featuredAlumni = alumni
    .filter(alum => alum.isVerified)
    .slice(0, 3)

  const quickActions = [
    {
      title: 'Find a Mentor',
      description: 'Connect with experienced alumni',
      icon: UserGroupIcon,
      href: '/mentorship',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'Browse Alumni',
      description: 'Explore alumni directory',
      icon: AcademicCapIcon,
      href: '/directory',
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700'
    },
    {
      title: 'Join Events',
      description: 'Attend workshops & meetups',
      icon: CalendarIcon,
      href: '/events',
      color: 'from-purple-500 to-violet-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700'
    },
    {
      title: 'Career Resources',
      description: 'Access learning materials',
      icon: BookOpenIcon,
      href: '/resources',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    }
  ]

  const learningResources = [
    {
      title: 'Interview Preparation',
      description: 'Tips and practice questions from alumni',
      icon: LightBulbIcon,
      progress: 75,
      color: 'text-blue-500'
    },
    {
      title: 'Resume Building',
      description: 'Create a compelling professional profile',
      icon: BookOpenIcon,
      progress: 45,
      color: 'text-green-500'
    },
    {
      title: 'Networking Skills',
      description: 'Learn to build professional relationships',
      icon: UserGroupIcon,
      progress: 20,
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}! 🌟</h1>
              <p className="text-green-100 text-lg">
                Your journey to success starts here. Connect, learn, and grow!
              </p>
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4" />
                  <span>Student</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>Currently Enrolled</span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
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
          {/* My Mentorship */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
                <span>My Mentorship</span>
              </h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                {userMentorshipRequests.length}
              </span>
            </div>
            {userMentorshipRequests.length > 0 ? (
              <div className="space-y-3">
                {userMentorshipRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.mentorName}
                      </p>
                      <p className="text-xs text-gray-500">{request.subject}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
                <Link 
                  href="/mentorship"
                  className="block text-center text-sm text-green-600 hover:text-green-700 font-medium mt-4"
                >
                  Manage Mentorship →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-3">No mentorship connections yet</p>
                <Link 
                  href="/mentorship"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Find a Mentor →
                </Link>
              </div>
            )}
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrophyIcon className="h-5 w-5 text-orange-500" />
                <span>Learning Progress</span>
              </h3>
            </div>
            <div className="space-y-4">
              {learningResources.map((resource, index) => {
                const Icon = resource.icon
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`h-5 w-5 ${resource.color}`} />
                      <h4 className="font-medium text-gray-900 text-sm flex-1">{resource.title}</h4>
                      <span className="text-xs text-gray-500 font-medium">{resource.progress}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{resource.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${resource.progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Featured Alumni */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <UserGroupIcon className="h-5 w-5 text-blue-500" />
                <span>Featured Alumni</span>
              </h3>
            </div>
            {featuredAlumni.length > 0 ? (
              <div className="space-y-3">
                {featuredAlumni.map((alum) => (
                  <div key={alum.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {alum.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{alum.name}</p>
                      <p className="text-xs text-gray-500">{alum.position} at {alum.currentCompany}</p>
                      <p className="text-xs text-blue-600">Class of {alum.graduationYear}</p>
                    </div>
                  </div>
                ))}
                <Link 
                  href="/directory"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
                >
                  Browse All Alumni →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No featured alumni</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.type === 'webinar' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'networking' ? 'bg-green-100 text-green-800' :
                      event.type === 'hackathon' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.type}
                    </span>
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.location}</span>
                  </div>
                  <Link 
                    href="/events"
                    className="mt-4 block text-center bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 text-sm font-medium"
                  >
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
