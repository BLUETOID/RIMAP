'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '../../context/AppContext'

type Mentor = {
  id: string
  name: string
  company: string
  department: string
  skills: string[]
  mentoringAreas: string[]
  available: boolean
}

type MentorshipRequest = {
  id: string
  mentorName: string
  mentorCompany: string
  studentName: string
  subject: string
  timeSlots: string[]
  status: 'pending' | 'accepted' | 'declined'
  requestDate: string
}

// Mock data
const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Google',
    department: 'CSE',
    skills: ['JavaScript', 'React', 'Node.js'],
    mentoringAreas: ['Web Development', 'Career Guidance', 'Interview Prep'],
    available: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Microsoft',
    department: 'CSE',
    skills: ['Python', 'AI/ML', 'TensorFlow'],
    mentoringAreas: ['Machine Learning', 'Data Science', 'Research'],
    available: true
  }
]

const mockRequests: MentorshipRequest[] = [
  {
    id: '1',
    mentorName: 'John Doe',
    mentorCompany: 'Google',
    studentName: 'Alice Johnson',
    subject: 'Career guidance in web development',
    timeSlots: ['Monday 6PM-7PM', 'Wednesday 7PM-8PM'],
    status: 'pending',
    requestDate: '2024-01-15'
  }
]

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<'find' | 'requests'>('find')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [requestForm, setRequestForm] = useState({
    subject: '',
    message: '',
    timeSlots: [] as string[]
  })

  const timeSlotOptions = [
    'Monday 6PM-7PM',
    'Monday 7PM-8PM',
    'Tuesday 6PM-7PM',
    'Tuesday 7PM-8PM',
    'Wednesday 6PM-7PM',
    'Wednesday 7PM-8PM',
    'Thursday 6PM-7PM',
    'Thursday 7PM-8PM',
    'Friday 6PM-7PM',
    'Friday 7PM-8PM',
    'Saturday 10AM-11AM',
    'Saturday 11AM-12PM',
    'Sunday 10AM-11AM',
    'Sunday 11AM-12PM'
  ]

  const handleRequestMentorship = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setShowRequestModal(true)
  }

  const toggleTimeSlot = (slot: string) => {
    setRequestForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(slot)
        ? prev.timeSlots.filter(s => s !== slot)
        : [...prev.timeSlots, slot]
    }))
  }

  const submitRequest = () => {
    // Handle form submission
    alert('Mentorship request sent!')
    setShowRequestModal(false)
    setRequestForm({ subject: '', message: '', timeSlots: [] })
    setSelectedMentor(null)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mentorship</h1>
        <p className="text-gray-600">Connect with experienced alumni for guidance and career advice</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('find')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'find'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Find Mentors
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Requests
          </button>
        </nav>
      </div>

      {/* Find Mentors Tab */}
      {activeTab === 'find' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.company}</p>
                  <p className="text-xs text-gray-500">{mentor.department}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mentoring Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.mentoringAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  mentor.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {mentor.available ? '● Available' : '● Unavailable'}
                </span>
                <button
                  onClick={() => handleRequestMentorship(mentor)}
                  disabled={!mentor.available}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    mentor.available
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Request Mentorship
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {mockRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No mentorship requests</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't requested any mentorship yet.</p>
            </div>
          ) : (
            mockRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.mentorName}</h3>
                    <p className="text-sm text-gray-600">{request.mentorCompany}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Subject</h4>
                  <p className="text-sm text-gray-600">{request.subject}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Requested Time Slots</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.timeSlots.map((slot: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Requested on {new Date(request.requestDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Request Mentorship from {selectedMentor.name}
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={requestForm.subject}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="What would you like guidance on?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={requestForm.message}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Tell them about your background and what specific help you're looking for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots (select multiple)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {timeSlotOptions.map((slot) => (
                    <label key={slot} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={requestForm.timeSlots.includes(slot)}
                        onChange={() => toggleTimeSlot(slot)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitRequest}
                  disabled={!requestForm.subject || requestForm.timeSlots.length === 0}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
