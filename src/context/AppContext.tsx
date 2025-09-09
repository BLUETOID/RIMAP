'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  UserLevel, 
  Achievement, 
  UserAchievement, 
  Challenge, 
  UserChallenge, 
  LeaderboardEntry, 
  Leaderboard, 
  PointTransaction, 
  GamificationStats 
} from '../types'

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
  // Gamification fields
  totalPoints: number
  currentLevel: UserLevel
  achievements: UserAchievement[]
  challenges: UserChallenge[]
  loginStreak: number
  lastLoginDate: string
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
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>
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
  
  // Gamification
  achievements: Achievement[]
  allChallenges: Challenge[]
  leaderboards: Leaderboard[]
  pointTransactions: PointTransaction[]
  addPoints: (points: number, reason: string, action: string, relatedId?: string) => void
  unlockAchievement: (achievementId: string) => void
  joinChallenge: (challengeId: string) => void
  updateChallengeProgress: (challengeId: string, progress: number) => void
  getGamificationStats: () => GamificationStats
  getUserLevel: (points: number) => UserLevel
  getPointsForNextLevel: (currentLevel: UserLevel, currentPoints: number) => number
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
    isVerified: true,
    totalPoints: 0,
    currentLevel: 'Bronze' as UserLevel,
    achievements: [],
    challenges: [],
    loginStreak: 0,
    lastLoginDate: new Date().toISOString()
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
    isVerified: true,
    totalPoints: 450,
    currentLevel: 'Silver' as UserLevel,
    achievements: [],
    challenges: [],
    loginStreak: 5,
    lastLoginDate: new Date().toISOString()
  },
  {
    id: 'student1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'student123',
    role: 'student',
    department: 'Electronics',
    isVerified: true,
    totalPoints: 180,
    currentLevel: 'Bronze' as UserLevel,
    achievements: [],
    challenges: [],
    loginStreak: 3,
    lastLoginDate: new Date().toISOString()
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

// Gamification Mock Data
const mockAchievements: Achievement[] = [
  {
    id: 'welcome',
    title: '🌟 Welcome Aboard',
    description: 'Complete your profile setup',
    icon: '🌟',
    category: 'profile',
    points: 100,
    requiredAction: 'profile_complete',
    requiredCount: 1
  },
  {
    id: 'mentor_master',
    title: '🤝 Mentor Master',
    description: 'Successfully mentor 5 students',
    icon: '🤝',
    category: 'mentorship',
    points: 500,
    requiredAction: 'mentorship_given',
    requiredCount: 5
  },
  {
    id: 'event_enthusiast',
    title: '🎪 Event Enthusiast',
    description: 'Attend 10 events',
    icon: '🎪',
    category: 'events',
    points: 300,
    requiredAction: 'event_attended',
    requiredCount: 10
  },
  {
    id: 'generous_giver',
    title: '💰 Generous Giver',
    description: 'Donate ₹10,000 or more',
    icon: '💰',
    category: 'donations',
    points: 250,
    requiredAction: 'donation_made',
    requiredCount: 10000
  },
  {
    id: 'super_connector',
    title: '🔗 Super Connector',
    description: 'Connect with 50 alumni',
    icon: '🔗',
    category: 'networking',
    points: 200,
    requiredAction: 'alumni_connected',
    requiredCount: 50
  },
  {
    id: 'wisdom_seeker',
    title: '🎓 Wisdom Seeker',
    description: 'Receive mentorship from 3 alumni',
    icon: '🎓',
    category: 'mentorship',
    points: 150,
    requiredAction: 'mentorship_received',
    requiredCount: 3
  }
]

const mockChallenges: Challenge[] = [
  {
    id: 'monthly_mentor',
    title: '🏆 Monthly Mentor Challenge',
    description: 'Mentor 3 students this month',
    icon: '🏆',
    category: 'monthly',
    points: 300,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    targetAction: 'mentorship_given',
    targetCount: 3,
    participants: [],
    isActive: true
  },
  {
    id: 'event_explorer',
    title: '🎊 Event Explorer',
    description: 'Attend 5 different events this month',
    icon: '🎊',
    category: 'monthly',
    points: 200,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    targetAction: 'event_attended',
    targetCount: 5,
    participants: [],
    isActive: true
  },
  {
    id: 'connection_champion',
    title: '🤝 Connection Champion',
    description: 'Connect with 20 new alumni this month',
    icon: '🤝',
    category: 'monthly',
    points: 250,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    targetAction: 'alumni_connected',
    targetCount: 20,
    participants: [],
    isActive: true
  }
]

const mockLeaderboards: Leaderboard[] = [
  {
    id: 'overall',
    title: 'Overall Leaderboard',
    category: 'overall',
    entries: [
      {
        userId: 'alumni1',
        userName: 'John Doe',
        userRole: 'alumni',
        points: 450,
        level: 'Silver' as UserLevel,
        department: 'Computer Science',
        graduationYear: 2020,
        rank: 1
      },
      {
        userId: 'student1',
        userName: 'Jane Smith',
        userRole: 'student',
        points: 180,
        level: 'Bronze' as UserLevel,
        department: 'Electronics',
        rank: 2
      }
    ],
    lastUpdated: new Date().toISOString()
  }
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [alumni, setAlumni] = useState<Alumni[]>(mockAlumni)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [donations, setDonations] = useState<Donation[]>(mockDonations)
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([])
  
  // Gamification State
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [allChallenges, setAllChallenges] = useState<Challenge[]>(mockChallenges)
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>(mockLeaderboards)
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([])
  
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

  // Load user from localStorage on app start (client-side only)
  useEffect(() => {
    // Mark as hydrated on client side
    setIsHydrated(true)
    
    // Only access localStorage after hydration
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('currentUser')
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          
          // Validate required fields
          if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
            // Ensure all required fields have default values
            const validatedUser = {
              ...parsedUser,
              totalPoints: parsedUser.totalPoints || 0,
              achievements: parsedUser.achievements || [],
              challenges: parsedUser.challenges || [],
              loginStreak: parsedUser.loginStreak || 0,
              lastLoginDate: parsedUser.lastLoginDate || new Date().toISOString()
            }
            setUser(validatedUser)
          } else {
            console.warn('Invalid user data in localStorage')
            localStorage.removeItem('currentUser')
          }
        }
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  // Authentication functions
  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    const foundUser = testUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      
      // Calculate login streak with defensive date handling
      const today = new Date().toDateString()
      let lastLoginDate: string
      let yesterday: string
      
      try {
        lastLoginDate = new Date(userWithoutPassword.lastLoginDate || new Date()).toDateString()
        yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      } catch (error) {
        console.error('Date parsing error:', error)
        lastLoginDate = today
        yesterday = today
      }
      
      let newLoginStreak = userWithoutPassword.loginStreak || 0
      
      if (lastLoginDate === yesterday) {
        // Consecutive day login
        newLoginStreak += 1
      } else if (lastLoginDate !== today) {
        // Not a consecutive login, reset streak
        newLoginStreak = 1
      }
      
      const updatedUser = {
        ...userWithoutPassword,
        loginStreak: newLoginStreak,
        lastLoginDate: new Date().toISOString()
      }
      
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
      
      // Award daily login points (only if not logged in today)
      if (lastLoginDate !== today) {
        setTimeout(() => {
          addPoints(5, 'Daily login', 'daily_login')
          
          // Bonus points for streaks
          if (newLoginStreak >= 7) {
            addPoints(15, `${newLoginStreak} day login streak!`, 'weekly_login_streak')
          }
        }, 100) // Small delay to ensure user is set
      }
      
      return { success: true, user: updatedUser }
    }
    return { success: false }
  }

  const logout = () => {
    try {
      console.log('Logout initiated')
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser')
        console.log('User data cleared from localStorage')
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
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
            // Award points for attending event
            addPoints(30, 'RSVP to event', 'event_attended', eventId)
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
    
    // Award points for donation (1 point per ₹100)
    const points = Math.floor(donation.amount / 100)
    addPoints(points, `Donated ₹${donation.amount}`, 'donation_made', newRecord.id)
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
      
      // Award points for requesting mentorship
      addPoints(25, 'Requested mentorship', 'mentorship_requested', newRequest.id)
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

  // Gamification Functions
  const getUserLevel = (points: number): UserLevel => {
    if (points >= 2000) return 'Diamond'
    if (points >= 1000) return 'Platinum'
    if (points >= 500) return 'Gold'
    if (points >= 200) return 'Silver'
    return 'Bronze'
  }

  const getPointsForNextLevel = (currentLevel: UserLevel, currentPoints: number): number => {
    const levelThresholds = {
      'Bronze': 200,
      'Silver': 500,
      'Gold': 1000,
      'Platinum': 2000,
      'Diamond': Infinity
    }
    
    const nextThreshold = levelThresholds[currentLevel]
    return nextThreshold === Infinity ? 0 : nextThreshold - currentPoints
  }

  const addPoints = (points: number, reason: string, action: string, relatedId?: string) => {
    if (!user) return

    // Don't add points or check achievements for achievement-related point transactions to avoid infinite loops
    if (action === 'achievement_unlocked') return

    const transaction: PointTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      points,
      reason,
      action,
      timestamp: new Date().toISOString(),
      relatedId
    }

    setPointTransactions(prev => [...prev, transaction])

    const newTotalPoints = user.totalPoints + points
    const newLevel = getUserLevel(newTotalPoints)

    setUser(prevUser => prevUser ? {
      ...prevUser,
      totalPoints: newTotalPoints,
      currentLevel: newLevel
    } : null)

    // Check for level-up achievement
    if (newLevel !== user.currentLevel) {
      // Show level-up notification (we'll implement this later)
      console.log(`Level up! You are now ${newLevel}!`)
    }

    // Check if any achievements should be unlocked (with a slight delay to avoid infinite loops)
    setTimeout(() => checkAchievements(action, newTotalPoints), 100)
  }

  const checkAchievements = (action: string, totalPoints: number) => {
    if (!user) return

    achievements.forEach(achievement => {
      const userAchievement = user.achievements.find(ua => ua.achievementId === achievement.id)
      
      if (!userAchievement || !userAchievement.unlockedAt) {
        let shouldUnlock = false
        
        // Check based on action type
        if (achievement.requiredAction === action) {
          const actionCount = pointTransactions.filter(
            t => t.userId === user.id && t.action === action
          ).length
          
          shouldUnlock = actionCount >= achievement.requiredCount
        } else if (achievement.requiredAction === 'points_total') {
          shouldUnlock = totalPoints >= achievement.requiredCount
        }
        
        if (shouldUnlock) {
          unlockAchievement(achievement.id)
        }
      }
    })
  }

  const unlockAchievement = (achievementId: string) => {
    if (!user) return

    const existingAchievement = user.achievements.find(ua => ua.achievementId === achievementId)
    if (existingAchievement?.unlockedAt) return // Already unlocked

    const achievement = achievements.find(a => a.id === achievementId)
    if (!achievement) return

    const newUserAchievement: UserAchievement = {
      achievementId,
      unlockedAt: new Date().toISOString(),
      progress: achievement.requiredCount
    }

    // Create point transaction for achievement without triggering checkAchievements again
    const achievementTransaction: PointTransaction = {
      id: Date.now().toString() + '_achievement',
      userId: user.id,
      points: achievement.points,
      reason: `Achievement unlocked: ${achievement.title}`,
      action: 'achievement_unlocked',
      timestamp: new Date().toISOString(),
      relatedId: achievementId
    }

    setPointTransactions(prev => [...prev, achievementTransaction])

    setUser(prevUser => {
      if (!prevUser) return null
      
      const updatedAchievements = prevUser.achievements.filter(ua => ua.achievementId !== achievementId)
      updatedAchievements.push(newUserAchievement)
      
      return {
        ...prevUser,
        achievements: updatedAchievements,
        totalPoints: prevUser.totalPoints + achievement.points,
        currentLevel: getUserLevel(prevUser.totalPoints + achievement.points)
      }
    })

    // Show achievement notification
    console.log(`Achievement unlocked: ${achievement.title}! +${achievement.points} points`)
  }

  const joinChallenge = (challengeId: string) => {
    if (!user) return

    const challenge = allChallenges.find(c => c.id === challengeId)
    if (!challenge || !challenge.isActive) return

    // Add user to challenge participants
    setAllChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, participants: [...c.participants, user.id] }
        : c
    ))

    // Add challenge to user's challenges
    const newUserChallenge: UserChallenge = {
      challengeId,
      progress: 0,
      completed: false
    }

    setUser(prevUser => prevUser ? {
      ...prevUser,
      challenges: [...prevUser.challenges, newUserChallenge]
    } : null)
  }

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    if (!user) return

    setUser(prevUser => {
      if (!prevUser) return null
      
      const updatedChallenges = prevUser.challenges.map(uc => {
        if (uc.challengeId === challengeId) {
          const challenge = allChallenges.find(c => c.id === challengeId)
          const completed = challenge ? progress >= challenge.targetCount : false
          
          if (completed && !uc.completed) {
            // Award challenge points
            if (challenge) {
              addPoints(challenge.points, `Completed challenge: ${challenge.title}`, 'challenge_completed', challengeId)
            }
          }
          
          return {
            ...uc,
            progress,
            completed,
            completedAt: completed && !uc.completed ? new Date().toISOString() : uc.completedAt
          }
        }
        return uc
      })
      
      return { ...prevUser, challenges: updatedChallenges }
    })
  }

  const getGamificationStats = (): GamificationStats => {
    if (!user) {
      return {
        totalPoints: 0,
        currentLevel: 'Bronze' as UserLevel,
        pointsToNextLevel: 200,
        achievementsUnlocked: 0,
        totalAchievements: achievements.length,
        currentStreak: 0,
        longestStreak: 0,
        rank: 0
      }
    }

    const pointsToNextLevel = getPointsForNextLevel(user.currentLevel, user.totalPoints)
    const achievementsUnlocked = user.achievements.filter(ua => ua.unlockedAt).length
    
    // Calculate rank from leaderboard
    const overallLeaderboard = leaderboards.find(lb => lb.category === 'overall')
    const userEntry = overallLeaderboard?.entries.find(entry => entry.userId === user.id)
    const rank = userEntry?.rank || 0

    return {
      totalPoints: user.totalPoints,
      currentLevel: user.currentLevel,
      pointsToNextLevel,
      achievementsUnlocked,
      totalAchievements: achievements.length,
      currentStreak: user.loginStreak,
      longestStreak: user.loginStreak, // We'll enhance this later
      rank
    }
  }

  const value: AppContextType = {
    // Auth
    user,
    login,
    logout,
    isAuthenticated: !!user && isHydrated,
    
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
    rejectUser,
    
    // Gamification
    achievements,
    allChallenges,
    leaderboards,
    pointTransactions,
    addPoints,
    unlockAchievement,
    joinChallenge,
    updateChallengeProgress,
    getGamificationStats,
    getUserLevel,
    getPointsForNextLevel
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
