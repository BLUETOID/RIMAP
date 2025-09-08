'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '../../context/AppContext'

export default function MentorshipPage() {
  const { isAuthenticated, alumni, mentorshipRequests, sendMentorshipRequest, user } = useAppContext()
  const [activeTab, setActiveTab] = useState<'find' | 'requests'>('find')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [requestForm, setRequestForm] = useState({
    subject: '',
    message: '',
    expertise: ''
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Please log in to access mentorship features.</p>
          <Link
            href="/auth/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  // Convert alumni to mentors (filter verified alumni excluding current user)
  const mentors = alumni.filter(person => 
    person.isVerified && 
    person.id !== user?.id && 
    person.skills.length > 0
  )

  const handleRequestMentorship = (mentor: any) => {
    setSelectedMentor(mentor)
    setShowRequestModal(true)
  }

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMentor) return

    sendMentorshipRequest(selectedMentor.id, requestForm.subject, requestForm.message, requestForm.expertise)
    setShowRequestModal(false)
    setSelectedMentor(null)
    setRequestForm({ subject: '', message: '', expertise: '' })
    alert('Mentorship request sent successfully!')
  }

  const userRequests = mentorshipRequests.filter(req => 
    req.menteeId === user?.id || req.mentorId === user?.id
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentorship Program</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced alumni for guidance, or share your expertise with current students.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'find'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Find Mentors
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Requests ({userRequests.length})
            </button>
          </div>
        </div>

        {/* Find Mentors Tab */}
        {activeTab === 'find' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Mentor Header */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.currentCompany}</p>
                    <p className="text-xs text-gray-500">{mentor.department} • Class of {mentor.graduationYear}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{mentor.bio}</p>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{mentor.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Request Button */}
                <button
                  onClick={() => handleRequestMentorship(mentor)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {userRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🤝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                <p className="text-gray-600">Start by requesting mentorship from experienced alumni.</p>
              </div>
            ) : (
              userRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {request.menteeId === user?.id ? `To: ${request.mentorName}` : `From: ${request.menteeName}`}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{request.message}</p>
                  <div className="text-sm text-gray-500">
                    <p>Expertise: {request.expertise}</p>
                    <p>Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && selectedMentor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Request Mentorship from {selectedMentor.name}
              </h2>
              
              <form onSubmit={handleRequestSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.subject}
                    onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief subject of your request"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area of Expertise
                  </label>
                  <select
                    required
                    value={requestForm.expertise}
                    onChange={(e) => setRequestForm({ ...requestForm, expertise: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select expertise area</option>
                    {selectedMentor.skills.map((skill: string) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe what you're looking for and why you'd like this person as a mentor..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
