'use client'

import { useAppContext } from '../../context/AppContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
    mentorshipRequests,
    // Gamification data
    achievements,
    allChallenges,
    leaderboards,
    pointTransactions,
    getGamificationStats
  } = useAppContext()
  
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (user?.role !== 'admin') {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'alumni') {
        router.push('/dashboard/alumni')
      } else if (user?.role === 'student') {
        router.push('/dashboard/student')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Mock students data for admin management
  const [students] = useState([
    {
      id: 'student1',
      name: 'Rahul Sharma',
      email: 'rahul@student.edu',
      department: 'Computer Science',
      currentYear: 3,
      enrollmentYear: 2022,
      cgpa: 8.5,
      isActive: true,
      mentorshipRequests: 2,
      eventsAttended: 5,
      lastLogin: '2024-01-10'
    },
    {
      id: 'student2',
      name: 'Priya Patel',
      email: 'priya@student.edu',
      department: 'Electronics',
      currentYear: 2,
      enrollmentYear: 2023,
      cgpa: 9.1,
      isActive: true,
      mentorshipRequests: 1,
      eventsAttended: 3,
      lastLogin: '2024-01-15'
    },
    {
      id: 'student3',
      name: 'Amit Kumar',
      email: 'amit@student.edu',
      department: 'Mechanical',
      currentYear: 4,
      enrollmentYear: 2021,
      cgpa: 7.8,
      isActive: false,
      mentorshipRequests: 0,
      eventsAttended: 2,
      lastLogin: '2023-12-20'
    },
    {
      id: 'student4',
      name: 'Sneha Gupta',
      email: 'sneha@student.edu',
      department: 'Computer Science',
      currentYear: 1,
      enrollmentYear: 2024,
      cgpa: 9.5,
      isActive: true,
      mentorshipRequests: 3,
      eventsAttended: 8,
      lastLogin: '2024-01-18'
    }
  ])

  // Enhanced alumni data with more details
  const enhancedAlumni = alumni.map(alum => ({
    ...alum,
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    profileCompleteness: Math.floor(Math.random() * 40) + 60,
    mentorshipCount: Math.floor(Math.random() * 5),
    eventParticipation: Math.floor(Math.random() * 10),
    donations: Math.floor(Math.random() * 50000)
  }))

  // Filter functions
  const filteredAlumni = enhancedAlumni.filter(alum => {
    const matchesSearch = alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alum.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alum.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || alum.department === selectedDepartment
    const matchesYear = !selectedYear || alum.graduationYear.toString() === selectedYear
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'verified' && alum.isVerified) ||
                         (selectedStatus === 'pending' && !alum.isVerified)
    
    return matchesSearch && matchesDept && matchesYear && matchesStatus
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !selectedDepartment || student.department === selectedDepartment
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'active' && student.isActive) ||
                         (selectedStatus === 'inactive' && !student.isActive)
    
    return matchesSearch && matchesDept && matchesStatus
  })

  // Statistics calculations
  const totalAlumni = alumni.length
  const verifiedAlumni = alumni.filter(a => a.isVerified).length
  const pendingVerification = totalAlumni - verifiedAlumni
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.isActive).length
  const totalEvents = events.length
  const totalDonations = donationRecords.reduce((sum, donation) => sum + donation.amount, 0)

  const handleApproveAlumni = (id: string) => {
    alert(`Alumni ${id} approved for verification`)
  }

  const handleRejectAlumni = (id: string) => {
    alert(`Alumni ${id} verification rejected`)
  }

  const handleToggleStudentStatus = (id: string) => {
    alert(`Student ${id} status toggled`)
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'gamification', name: 'Gamification', icon: '🎮' },
    { id: 'alumni', name: 'Alumni Management', icon: '🎓' },
    { id: 'students', name: 'Student Management', icon: '👨‍🎓' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'donations', name: 'Donations', icon: '💰' },
    { id: 'mentorship', name: 'Mentorship', icon: '🤝' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage alumni network, students, and platform activities</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                    <p className="text-3xl font-bold text-blue-600">{totalAlumni}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 14a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-green-600">✓ {verifiedAlumni} verified</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-3xl font-bold text-green-600">{activeStudents}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Total: {totalStudents}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-3xl font-bold text-purple-600">{totalEvents}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">This month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donations</p>
                    <p className="text-3xl font-bold text-orange-600">₹{totalDonations.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">All time</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Verifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Pending Verifications</h3>
                </div>
                <div className="p-6">
                  {pendingVerifications.length > 0 ? (
                    <div className="space-y-4">
                      {pendingVerifications.slice(0, 3).map((verification) => (
                        <div key={verification.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {verification.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{verification.name}</p>
                              <p className="text-sm text-gray-500">{verification.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveUser(verification.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectUser(verification.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                      {pendingVerifications.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{pendingVerifications.length - 3} more pending
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pending verifications</p>
                  )}
                </div>
              </div>

              {/* Recent Mentorship Requests */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Mentorship Requests</h3>
                </div>
                <div className="p-6">
                  {mentorshipRequests.length > 0 ? (
                    <div className="space-y-4">
                      {mentorshipRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="border-l-4 border-blue-500 pl-4">
                          <p className="text-sm font-medium text-gray-900">{request.menteeName}</p>
                          <p className="text-sm text-gray-600">{request.subject}</p>
                          <p className="text-xs text-gray-500">Status: {request.status}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent requests</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alumni Management Tab */}
        {activeTab === 'alumni' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search alumni..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alumni List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Alumni ({filteredAlumni.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumni
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAlumni.map((alum) => (
                      <tr key={alum.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {alum.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{alum.name}</div>
                              <div className="text-sm text-gray-500">{alum.email}</div>
                              <div className="text-xs text-gray-400">{alum.department} • {alum.graduationYear}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{alum.currentCompany}</div>
                          <div className="text-sm text-gray-500">{alum.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{alum.profileCompleteness}% complete</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${alum.profileCompleteness}%`}}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Last login: {alum.lastLogin}</div>
                          <div>Mentoring: {alum.mentorshipCount}</div>
                          <div>Events: {alum.eventParticipation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            alum.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alum.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {!alum.isVerified && (
                              <button
                                onClick={() => handleApproveAlumni(alum.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              View
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Gamification Tab */}
        {activeTab === 'gamification' && (
          <div className="space-y-8">
            {/* Gamification Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Points Awarded</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pointTransactions.reduce((sum, t) => sum + t.points, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Challenges</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allChallenges.filter(c => c.isActive).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Achievements Unlocked</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pointTransactions.filter(t => t.action.includes('achievement')).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <span className="text-2xl">🏅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Point Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{pointTransactions.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <span className="text-2xl">💫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">🏆 Top Performers</h3>
                <p className="text-gray-600">Leading users by points</p>
              </div>
              <div className="p-6">
                {leaderboards.length > 0 && leaderboards[0].entries.length > 0 ? (
                  <div className="space-y-4">
                    {leaderboards[0].entries.slice(0, 10).map((entry, index) => (
                      <div key={entry.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{entry.userName}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {entry.userRole} • {entry.department} • {entry.graduationYear}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">{entry.points.toLocaleString()} pts</div>
                          <div className="text-sm text-gray-600">{entry.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No leaderboard data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Point Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">💫 Recent Point Transactions</h3>
                <p className="text-gray-600">Latest point awards and activities</p>
              </div>
              <div className="p-6">
                {pointTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {pointTransactions.slice(-10).reverse().map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {transaction.action.includes('login') ? '🔐' :
                             transaction.action.includes('mentorship') ? '🤝' :
                             transaction.action.includes('event') ? '📅' :
                             transaction.action.includes('donation') ? '💰' : '⭐'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.reason}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                              {new Date(transaction.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="font-bold text-green-600">+{transaction.points} pts</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No point transactions yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievement Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">🏅 Achievement System</h3>
                <p className="text-gray-600">Available achievements and unlock rates</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map(achievement => {
                    const unlockedCount = pointTransactions.filter(t => t.action === 'achievement_unlocked' && t.relatedId === achievement.id).length
                    const totalUsers = alumni.length + 1 // +1 for current user if student
                    const unlockRate = totalUsers > 0 ? (unlockedCount / totalUsers) * 100 : 0
                    
                    return (
                      <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{achievement.points} points</span>
                          <span className="text-green-600">{unlockRate.toFixed(1)}% unlocked</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Management Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Students ({filteredStudents.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.department}</div>
                          <div className="text-sm text-gray-500">Year {student.currentYear} • Enrolled {student.enrollmentYear}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">CGPA: {student.cgpa}</div>
                          <div className={`text-sm ${student.cgpa >= 8.5 ? 'text-green-600' : student.cgpa >= 7.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {student.cgpa >= 8.5 ? 'Excellent' : student.cgpa >= 7.0 ? 'Good' : 'Needs Improvement'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Last login: {student.lastLogin}</div>
                          <div>Mentorship: {student.mentorshipRequests}</div>
                          <div>Events: {student.eventsAttended}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleStudentStatus(student.id)}
                              className={`${student.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {student.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              View
                            </button>
                          </div>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Events Management</h3>
            </div>
            <div className="p-6">
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>📅 {event.date}</span> • <span>📍 {event.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {event.currentAttendees} attendees
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            event.category === 'technical' ? 'bg-blue-100 text-blue-800' :
                            event.category === 'networking' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No events created yet</p>
              )}
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Donations Management</h3>
            </div>
            <div className="p-6">
              {donationRecords.length > 0 ? (
                <div className="space-y-4">
                  {donationRecords.map((donation) => (
                    <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-medium text-gray-900">{donation.donorName}</p>
                          <p className="text-sm text-gray-600">{donation.cause}</p>
                          <p className="text-xs text-gray-500">{donation.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No donations yet</p>
              )}
            </div>
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mentorship Management</h3>
            </div>
            <div className="p-6">
              {mentorshipRequests.length > 0 ? (
                <div className="space-y-4">
                  {mentorshipRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{request.subject}</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Student:</strong> {request.menteeName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Mentor:</strong> {request.mentorName}
                          </p>
                          <p className="text-xs text-gray-500">Requested: {request.createdAt}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No mentorship requests yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
