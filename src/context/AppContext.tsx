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

type Alumni = {
  id: string
  name: string
  email: string
  graduationYear: number
  department: string
  currentCompany: string
  position: string
  skills: string[]
  bio: string
  isVerified: boolean
  profilePicture: string
  contactPreference: 'email' | 'phone' | 'linkedin'
  location?: string
}

type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: 'reunion' | 'webinar' | 'hackathon' | 'networking'
  category: string
  description: string
  maxAttendees: number
  currentAttendees: number
  rsvpStatus: 'attending' | 'maybe' | 'not-attending' | null
  rsvpList?: string[]
  organizer: string
  agenda?: string[]
}

type Donation = {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  donors: number
  category: 'infrastructure' | 'scholarships' | 'research' | 'events'
  urgent?: boolean
  featured?: boolean
  endDate: string
}

type DonationRecord = {
  id: string
  amount: number
  cause: string
  donorName: string
  date: string
}

type MentorshipRequest = {
  id: string
  mentorId: string
  menteeId: string
  mentorName: string
  menteeName: string
  subject: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  expertise: string
}

type AppContextType = {
  // Auth
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  
  // Alumni
  alumni: Alumni[]
  searchAlumni: (query: string, filters: any) => Alumni[]
  getAlumniById: (id: string) => Alumni | undefined
  
  // Events
  events: Event[]
  updateEventRSVP: (eventId: string, status: 'attending' | 'maybe' | 'not-attending') => void
  rsvpToEvent: (eventId: string) => void
  filterEvents: (type: string) => Event[]
  
  // Donations
  donations: Donation[]
  donationRecords: DonationRecord[]
  processDonation: (donationId: string, amount: number) => Promise<boolean>
  makeDonation: (donation: { amount: number; cause: string; donorName: string }) => void
  filterDonations: (category: string) => Donation[]
  
  // Mentorship
  mentorshipRequests: MentorshipRequest[]
  sendMentorshipRequest: (mentorId: string, subject: string, message: string, expertise: string) => void
  respondToMentorshipRequest: (requestId: string, response: 'accepted' | 'declined') => void
  
  // Admin
  adminStats: any
  pendingVerifications: Alumni[]
  approveUser: (userId: string) => void
  rejectUser: (userId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Test Users Database
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
    department: 'Electronics',
    isVerified: true
  }
]

// Mock Data
const mockAlumni: Alumni[] = [
  {
    id: 'alumni1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    graduationYear: 2019,
    department: 'Computer Science',
    currentCompany: 'Google',
    position: 'Software Engineer',
    skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
    bio: 'Passionate about technology and mentoring. Love to help students navigate their career paths.',
    isVerified: true,
    profilePicture: '/api/placeholder/150/150',
    contactPreference: 'email',
    location: 'Bangalore, India'
  },
  {
    id: 'alumni2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    graduationYear: 2020,
    department: 'Electronics',
    currentCompany: 'Microsoft',
    position: 'Product Manager',
    skills: ['Product Management', 'Strategy', 'Analytics', 'Leadership'],
    bio: 'Building products that users love. Experienced in taking products from 0 to 1.',
    isVerified: true,
    profilePicture: '/api/placeholder/150/150',
    contactPreference: 'linkedin',
    location: 'Seattle, USA'
  },
  {
    id: 'alumni3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    graduationYear: 2018,
    department: 'Mechanical',
    currentCompany: 'Tesla',
    position: 'Design Engineer',
    skills: ['CAD', 'Manufacturing', 'Design', 'Innovation'],
    bio: 'Designing the future of sustainable transport. Open to mentoring aspiring engineers.',
    isVerified: true,
    profilePicture: '/api/placeholder/150/150',
    contactPreference: 'email',
    location: 'San Francisco, USA'
  },
  {
    id: 'alumni4',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    graduationYear: 2021,
    department: 'Computer Science',
    currentCompany: 'Amazon',
    position: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'Statistics', 'AWS'],
    bio: 'Turning data into insights. Passionate about AI and its applications in business.',
    isVerified: false,
    profilePicture: '/api/placeholder/150/150',
    contactPreference: 'email',
    location: 'Hyderabad, India'
  }
]

const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Annual Alumni Reunion 2025',
    date: '2025-03-15',
    time: '10:00 AM',
    location: 'Main Campus Auditorium',
    type: 'reunion',
    category: 'reunion',
    description: 'Join us for our biggest reunion yet! Reconnect with classmates, network with professionals, and celebrate our shared journey.',
    maxAttendees: 500,
    currentAttendees: 245,
    rsvpStatus: null,
    rsvpList: [],
    organizer: 'Alumni Committee',
    agenda: ['Registration & Welcome', 'Keynote Speech', 'Department Meetups', 'Networking Lunch', 'Cultural Program']
  },
  {
    id: 'event2',
    title: 'Tech Career Webinar',
    date: '2025-02-20',
    time: '7:00 PM',
    location: 'Online',
    type: 'webinar',
    category: 'webinar',
    description: 'Learn about the latest trends in technology careers and get insights from industry experts.',
    maxAttendees: 1000,
    currentAttendees: 567,
    rsvpStatus: null,
    rsvpList: [],
    organizer: 'Tech Alumni Group',
    agenda: ['Industry Trends', 'Career Guidance', 'Q&A Session']
  },
  {
    id: 'event3',
    title: 'Innovation Hackathon 2025',
    date: '2025-04-10',
    time: '9:00 AM',
    location: 'Innovation Center',
    type: 'hackathon',
    category: 'networking',
    description: '48-hour hackathon focused on solving real-world problems using cutting-edge technology.',
    maxAttendees: 200,
    currentAttendees: 134,
    rsvpStatus: null,
    rsvpList: [],
    organizer: 'Student Council',
    agenda: ['Problem Statement', 'Team Formation', 'Development', 'Presentation', 'Awards']
  }
]

const mockDonations: Donation[] = [
  {
    id: 'donation1',
    title: 'New Computer Lab Infrastructure',
    description: 'Help us build a state-of-the-art computer lab with latest hardware and software for our students.',
    goal: 500000,
    raised: 325000,
    donors: 89,
    category: 'infrastructure',
    featured: true,
    endDate: '2025-06-30'
  },
  {
    id: 'donation2',
    title: 'Student Scholarship Fund',
    description: 'Support deserving students from underprivileged backgrounds to pursue their education dreams.',
    goal: 200000,
    raised: 156000,
    donors: 156,
    category: 'scholarships',
    urgent: true,
    endDate: '2025-04-15'
  },
  {
    id: 'donation3',
    title: 'AI Research Initiative',
    description: 'Fund cutting-edge research in artificial intelligence and machine learning.',
    goal: 750000,
    raised: 423000,
    donors: 67,
    category: 'research',
    endDate: '2025-12-31'
  }
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [alumni, setAlumni] = useState<Alumni[]>(mockAlumni)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [donations, setDonations] = useState<Donation[]>(mockDonations)
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([])
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([
    {
      id: '1',
      amount: 500,
      cause: 'scholarship',
      donorName: 'John Doe',
      date: '2024-01-15'
    },
    {
      id: '2',
      amount: 250,
      cause: 'infrastructure',
      donorName: 'Jane Smith',
      date: '2024-01-10'
    },
    {
      id: '3',
      amount: 1000,
      cause: 'research',
      donorName: 'Mike Johnson',
      date: '2024-01-05'
    }
  ])

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = testUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  // Alumni functions
  const searchAlumni = (query: string, filters: any): Alumni[] => {
    return alumni.filter(person => {
      const matchesQuery = !query || 
        person.name.toLowerCase().includes(query.toLowerCase()) ||
        person.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        person.currentCompany.toLowerCase().includes(query.toLowerCase()) ||
        person.department.toLowerCase().includes(query.toLowerCase())
      
      const matchesYear = !filters.year || person.graduationYear.toString() === filters.year
      const matchesDept = !filters.department || person.department === filters.department
      const matchesCompany = !filters.company || person.currentCompany.toLowerCase().includes(filters.company.toLowerCase())
      
      return matchesQuery && matchesYear && matchesDept && matchesCompany
    })
  }

  const getAlumniById = (id: string): Alumni | undefined => {
    return alumni.find(a => a.id === id)
  }

  // Event functions
  const updateEventRSVP = (eventId: string, status: 'attending' | 'maybe' | 'not-attending') => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          const wasAttending = event.rsvpStatus === 'attending'
          const isNowAttending = status === 'attending'
          
          let newAttendeeCount = event.currentAttendees
          
          if (wasAttending && !isNowAttending) {
            newAttendeeCount -= 1
          } else if (!wasAttending && isNowAttending) {
            newAttendeeCount += 1
          }
          
          return {
            ...event,
            rsvpStatus: status,
            currentAttendees: Math.max(0, Math.min(newAttendeeCount, event.maxAttendees))
          }
        }
        return event
      })
    )
  }

  const filterEvents = (type: string): Event[] => {
    if (type === 'all') return events
    return events.filter(event => event.type === type)
  }

  const rsvpToEvent = (eventId: string) => {
    if (!user) return
    
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          const isAlreadyRSVPd = event.rsvpList?.includes(user.id)
          const newRsvpList = isAlreadyRSVPd 
            ? event.rsvpList?.filter(id => id !== user.id) || []
            : [...(event.rsvpList || []), user.id]
          
          return {
            ...event,
            rsvpList: newRsvpList,
            currentAttendees: newRsvpList.length
          }
        }
        return event
      })
    )
  }

  // Donation functions
  const processDonation = async (donationId: string, amount: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDonations(prevDonations =>
          prevDonations.map(donation =>
            donation.id === donationId
              ? { ...donation, raised: donation.raised + amount, donors: donation.donors + 1 }
              : donation
          )
        )
        resolve(true)
      }, 2000)
    })
  }

  const filterDonations = (category: string): Donation[] => {
    if (category === 'all') return donations
    return donations.filter(donation => donation.category === category)
  }

  const makeDonation = (donation: { amount: number; cause: string; donorName: string }) => {
    const newRecord: DonationRecord = {
      id: `donation_${Date.now()}`,
      amount: donation.amount,
      cause: donation.cause,
      donorName: donation.donorName,
      date: new Date().toISOString()
    }
    setDonationRecords(prev => [newRecord, ...prev])
  }

  // Mentorship functions
  const sendMentorshipRequest = (mentorId: string, subject: string, message: string, expertise: string) => {
    const mentor = alumni.find(a => a.id === mentorId)
    if (mentor && user) {
      const newRequest: MentorshipRequest = {
        id: `req_${Date.now()}`,
        mentorId,
        menteeId: user.id,
        mentorName: mentor.name,
        menteeName: user.name,
        subject,
        message,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expertise
      }
      setMentorshipRequests(prev => [...prev, newRequest])
    }
  }

  const respondToMentorshipRequest = (requestId: string, response: 'accepted' | 'declined') => {
    setMentorshipRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: response } : req
      )
    )
  }

  // Admin functions
  const approveUser = (userId: string) => {
    setAlumni(prev =>
      prev.map(alumni =>
        alumni.id === userId ? { ...alumni, isVerified: true } : alumni
      )
    )
  }

  const rejectUser = (userId: string) => {
    setAlumni(prev => prev.filter(alumni => alumni.id !== userId))
  }

  const adminStats = {
    totalAlumni: alumni.length,
    verifiedAlumni: alumni.filter(a => a.isVerified).length,
    pendingVerifications: alumni.filter(a => !a.isVerified).length,
    totalEvents: events.length,
    totalDonations: donations.reduce((sum, d) => sum + d.raised, 0),
    totalDonors: donations.reduce((sum, d) => sum + d.donors, 0)
  }

  const value: AppContextType = {
    // Auth
    user,
    login,
    logout,
    isAuthenticated: !!user,
    
    // Alumni
    alumni,
    searchAlumni,
    getAlumniById,
    
    // Events
    events,
    updateEventRSVP,
    rsvpToEvent,
    filterEvents,
    
    // Donations
    donations,
    donationRecords,
    processDonation,
    makeDonation,
    filterDonations,
    
    // Mentorship
    mentorshipRequests,
    sendMentorshipRequest,
    respondToMentorshipRequest,
    
    // Admin
    adminStats,
    pendingVerifications: alumni.filter(a => !a.isVerified),
    approveUser,
    rejectUser
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
