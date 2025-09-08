'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAppContext } from '../../../context/AppContext'

export default function ProfilePage() {
  const { isAuthenticated, alumni, user } = useAppContext()
  const params = useParams()
  const profileId = params.id as string
  
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'skills'>('about')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Please log in to view profiles.</p>
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  const profileUser = alumni.find(person => person.id === profileId)

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The requested profile could not be found.</p>
          <Link
            href="/directory"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = user?.id === profileId

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profileUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
                    {profileUser.isVerified && (
                      <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-2">{profileUser.position}</p>
                  <p className="text-lg text-gray-500 mb-4">{profileUser.currentCompany}</p>
                  <div className="flex items-center text-gray-500 text-sm space-x-4">
                    <span>🎓 {profileUser.department}</span>
                    <span>📅 Class of {profileUser.graduationYear}</span>
                    <span>📍 {profileUser.location || 'Not specified'}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {!isOwnProfile && (
                    <>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Connect
                      </button>
                      <Link
                        href="/mentorship"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Request Mentorship
                      </Link>
                    </>
                  )}
                  {isOwnProfile && (
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'about', name: 'About', icon: '👤' },
                { id: 'experience', name: 'Experience', icon: '💼' },
                { id: 'skills', name: 'Skills', icon: '🛠️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {profileUser.bio || 'No bio available.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-600 mr-3">📧</span>
                      <span className="text-gray-900">{profileUser.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-3">🔗</span>
                      <span className="text-gray-900">
                        Preferred contact: {profileUser.contactPreference}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Position</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-blue-600 text-xl">💼</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{profileUser.position}</h4>
                        <p className="text-gray-600">{profileUser.currentCompany}</p>
                        <p className="text-sm text-gray-500 mt-1">Current</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-green-600 text-xl">🎓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{profileUser.department}</h4>
                        <p className="text-gray-600">Your University</p>
                        <p className="text-sm text-gray-500 mt-1">Graduated {profileUser.graduationYear}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {profileUser.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentoring Areas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileUser.skills.slice(0, 4).map((skill) => (
                      <div key={skill} className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900">{skill}</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Available for mentoring and guidance
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Directory */}
        <div className="text-center">
          <Link
            href="/directory"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </div>
    </div>
  )
}
