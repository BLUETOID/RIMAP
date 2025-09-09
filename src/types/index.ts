// Gamification Types
export type UserLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  category: 'profile' | 'mentorship' | 'events' | 'donations' | 'networking' | 'special'
  points: number
  requiredAction: string
  requiredCount: number
  unlockedAt?: string
}

export type UserAchievement = {
  achievementId: string
  unlockedAt: string
  progress: number
}

export type Challenge = {
  id: string
  title: string
  description: string
  icon: string
  category: 'monthly' | 'seasonal' | 'special'
  points: number
  startDate: string
  endDate: string
  targetAction: string
  targetCount: number
  participants: string[]
  isActive: boolean
}

export type UserChallenge = {
  challengeId: string
  progress: number
  completed: boolean
  completedAt?: string
}

export type LeaderboardEntry = {
  userId: string
  userName: string
  userRole: string
  points: number
  level: UserLevel
  department?: string
  graduationYear?: number
  rank: number
}

export type Leaderboard = {
  id: string
  title: string
  category: 'overall' | 'monthly' | 'department' | 'mentorship' | 'events' | 'donations'
  entries: LeaderboardEntry[]
  lastUpdated: string
}

export type PointTransaction = {
  id: string
  userId: string
  points: number
  reason: string
  action: string
  timestamp: string
  relatedId?: string
}

export type GamificationStats = {
  totalPoints: number
  currentLevel: UserLevel
  pointsToNextLevel: number
  achievementsUnlocked: number
  totalAchievements: number
  currentStreak: number
  longestStreak: number
  rank: number
}