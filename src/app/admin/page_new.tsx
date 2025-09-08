'use client'

import { useAppContext } from '../../context/AppContext'
import { useState } from 'react'

export default function AdminPage() {
  const { 
    user, 
    isAuthenticated, 
    adminStats, 
    pendingVerifications, 
    approveUser, 
    rejectUser,
    alumni,
    events,
    donationRecords,
    mentorshipRequests
  } = useAppContext()
  
  const [activeTab, setActiveTab] = useState('overview')

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <a
            href="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'donations', name: 'Donations', icon: '💰' },
    { id: 'mentorship', name: 'Mentorship', icon: '🤝' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🛡️ Admin Dashboard</h1>
          <p className="text-gray-600">Manage your alumni platform</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                        <p className="text-2xl font-bold text-blue-600">{adminStats.totalAlumni}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Verified</p>
                        <p className="text-2xl font-bold text-green-600">{adminStats.verifiedAlumni}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Events</p>
                        <p className="text-2xl font-bold text-purple-600">{adminStats.totalEvents}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Donations</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ${donationRecords.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Recent Registrations</h3>
                    <div className="space-y-3">
                      {alumni.slice(0, 5).map((person) => (
                        <div key={person.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.department}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            person.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {person.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Pending Actions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>User Verifications</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full">
                          {pendingVerifications.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mentorship Requests</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                          {mentorshipRequests.filter(r => r.status === 'pending').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">User Management</h3>
                
                {/* Pending Verifications */}
                {pendingVerifications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4">Pending Verifications ({pendingVerifications.length})</h4>
                    <div className="space-y-4">
                      {pendingVerifications.map((person) => (
                        <div key={person.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{person.name}</h5>
                              <p className="text-sm text-gray-600">{person.email}</p>
                              <p className="text-sm text-gray-500">
                                {person.department} • Class of {person.graduationYear}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => approveUser(person.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectUser(person.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Users */}
                <div>
                  <h4 className="font-medium mb-4">All Users ({alumni.length})</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {alumni.slice(0, 10).map((person) => (
                          <tr key={person.id}>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{person.name}</p>
                                <p className="text-sm text-gray-500">{person.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{person.department}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{person.graduationYear}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                person.isVerified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {person.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Event Management</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                    Create Event
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.description.slice(0, 100)}...</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p>👥 {event.currentAttendees}/{event.maxAttendees} attending</p>
                        <p>� {event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Donation Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${donationRecords.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Raised</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{donationRecords.length}</p>
                    <p className="text-sm text-gray-600">Total Donations</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      ${Math.round(donationRecords.reduce((sum, d) => sum + d.amount, 0) / donationRecords.length || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Average Donation</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cause</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {donationRecords.map((donation) => (
                        <tr key={donation.id}>
                          <td className="px-6 py-4 font-medium">{donation.donorName}</td>
                          <td className="px-6 py-4 text-green-600 font-medium">${donation.amount}</td>
                          <td className="px-6 py-4 capitalize">{donation.cause.replace('_', ' ')}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(donation.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mentorship Tab */}
            {activeTab === 'mentorship' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Mentorship Management</h3>
                
                <div className="space-y-4">
                  {mentorshipRequests.map((request) => (
                    <div key={request.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{request.subject}</h4>
                          <p className="text-sm text-gray-600">
                            {request.menteeName} → {request.mentorName}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{request.message}</p>
                      <p className="text-sm text-gray-500">
                        Expertise: {request.expertise} • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {mentorshipRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No mentorship requests yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
