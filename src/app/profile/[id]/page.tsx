'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Alumni = {
  id: string
  name: string
  headline: string
  company: string
  department: string
  graduationYear: number
  skills: string[]
  bio: string
  profilePicture: string
  verified: boolean
  contactPreference: 'email' | 'linkedin' | 'both'
  email: string
  linkedin: string
}

// Mock data
const mockAlumniData: { [key: string]: Alumni } = {
  '1': {
    id: '1',
    name: 'John Doe',
    headline: 'Senior Software Engineer at Google',
    company: 'Google',
    department: 'Computer Science & Engineering',
    graduationYear: 2019,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'AWS'],
    bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Love building scalable applications and mentoring students. Always excited to connect with fellow alumni and share knowledge.',
    profilePicture: '/placeholder-avatar.jpg',
    verified: true,
    contactPreference: 'both',
    email: 'john.doe@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe'
  }
}

export default function ProfilePage() {
  const params = useParams()
  const id = params.id as string
  const [showContactModal, setShowContactModal] = useState(false)
  
  const alumni = mockAlumniData[id]

  if (!alumni) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Alumni not found</h1>
          <Link href="/directory" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link href="/directory" className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Directory
      </Link>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-white">{alumni.name}</h1>
                {alumni.verified && (
                  <span className="ml-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    ✅ Verified
                  </span>
                )}
                {!alumni.verified && (
                  <span className="ml-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    ⏳ Pending
                  </span>
                )}
              </div>
              <p className="text-primary-100 text-lg mb-2">{alumni.headline}</p>
              <p className="text-primary-200 text-sm">
                {alumni.department} • Class of {alumni.graduationYear}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Bio Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{alumni.bio}</p>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Card */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
                  >
                    Send Message
                  </button>
                  
                  <Link
                    href="/mentorship"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors text-center block"
                  >
                    Request Mentorship
                  </Link>
                  
                  {alumni.linkedin && (
                    <a
                      href={alumni.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-center block"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Preferred contact method:</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {alumni.contactPreference === 'both' ? 'Email & LinkedIn' : alumni.contactPreference}
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Current Company</p>
                    <p className="text-sm font-medium text-gray-900">{alumni.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="text-sm font-medium text-gray-900">{alumni.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graduation Year</p>
                    <p className="text-sm font-medium text-gray-900">{alumni.graduationYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Message to {alumni.name}</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Write your message..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
