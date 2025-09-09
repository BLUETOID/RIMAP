import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import GamificationStats from './GamificationStats'
import PointsCounter from './PointsCounter'
import AchievementModal from './AchievementModal'
import LeaderboardModal from './LeaderboardModal'
import { 
  TrophyIcon, 
  SparklesIcon, 
  FireIcon, 
  StarIcon,
  ChartBarIcon,
  ClockIcon,
  GiftIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

interface GamificationDashboardProps {
  className?: string
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ className = '' }) => {
  const { user, achievements, allChallenges, getGamificationStats } = useAppContext()
  const [showAchievements, setShowAchievements] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Don't show gamification for admin users
  if (!user || user.role === 'admin') return null
  
  const stats = getGamificationStats()
  const unlockedAchievements = achievements.filter(achievement => 
    user.achievements.some(ua => ua.achievementId === achievement.id && ua.unlockedAt)
  )
  
  const recentAchievements = unlockedAchievements
    .slice(-3)
    .sort((a, b) => {
      const aUnlocked = user.achievements.find(ua => ua.achievementId === a.id)?.unlockedAt
      const bUnlocked = user.achievements.find(ua => ua.achievementId === b.id)?.unlockedAt
      return new Date(bUnlocked || 0).getTime() - new Date(aUnlocked || 0).getTime()
    })
  
  const getStreakMessage = () => {
    if (user.loginStreak >= 30) return "🔥 Incredible dedication!"
    if (user.loginStreak >= 14) return "⚡ You're on fire!"
    if (user.loginStreak >= 7) return "🌟 Great momentum!"
    if (user.loginStreak >= 3) return "💪 Keep it up!"
    return "🎯 Start your streak!"
  }
  
  const getRoleSpecificContent = () => {
    if (user.role === 'alumni') {
      return {
        title: "Alumni Gaming Dashboard",
        subtitle: "Continue building your legacy and help the next generation!",
        achievementCategories: ['profile', 'mentorship', 'events', 'donations', 'networking', 'special'],
        challenges: allChallenges.filter(c => c.isActive && (c.category === 'monthly' || c.category === 'special')),
        primaryColor: 'from-purple-600 via-blue-600 to-purple-700',
        iconColor: 'text-blue-600',
        bgGradient: 'from-purple-50 via-blue-50 to-purple-50'
      }
    } else if (user.role === 'student') {
      return {
        title: "Student Achievement Hub",
        subtitle: "Learn, grow, and connect with amazing alumni mentors!",
        achievementCategories: ['profile', 'events', 'networking', 'learning'],
        challenges: allChallenges.filter(c => c.isActive && (c.category === 'seasonal' || c.category === 'special')),
        primaryColor: 'from-green-500 via-emerald-500 to-teal-600',
        iconColor: 'text-green-600',
        bgGradient: 'from-green-50 via-emerald-50 to-teal-50'
      }
    } else {
      return {
        title: "Dashboard",
        subtitle: "Overview",
        achievementCategories: [],
        challenges: [],
        primaryColor: 'from-gray-600 to-gray-700',
        iconColor: 'text-gray-600',
        bgGradient: 'from-gray-50 to-gray-100'
      }
    }
  }
  
  const roleContent = getRoleSpecificContent()
  const roleChallenges = roleContent.challenges
  
  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${className}`}>
      {/* Enhanced Header */}
      <div className={`bg-gradient-to-br ${roleContent.primaryColor} relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{roleContent.title}</h3>
                <p className="text-purple-100">{roleContent.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-white font-mono text-lg">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <PointsCounter size="lg" showLevel={false} className="text-white" />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <FireIcon className="h-5 w-5 text-orange-300" />
                <span className="text-white font-semibold">{user.loginStreak}</span>
                <span className="text-purple-100 text-sm">day streak</span>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">{stats.currentLevel}</div>
                <div className="text-purple-200 text-xs">Current Level</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-purple-100 text-sm">{getStreakMessage()}</div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Stats Grid */}
      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <StarIcon className="h-8 w-8 text-yellow-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">Total</div>
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">{stats.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-yellow-600 font-medium">Points Earned</div>
          </div>
          
          <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <TrophyIcon className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">Unlocked</div>
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">{unlockedAchievements.length}</div>
            <div className="text-sm text-green-600 font-medium">Achievements</div>
          </div>
          
          <div className="group bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <ChartBarIcon className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">Rank</div>
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{stats.currentLevel}</div>
            <div className="text-sm text-purple-600 font-medium">Current Level</div>
          </div>
          
          <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <GiftIcon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">Active</div>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{roleChallenges.length}</div>
            <div className="text-sm text-blue-600 font-medium">Challenges</div>
          </div>
        </div>
        
        {/* Enhanced Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <SparklesIcon className="h-6 w-6 text-yellow-500" />
                <span>Recent Achievements</span>
              </h4>
              <button
                onClick={() => setShowAchievements(true)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recentAchievements.map(achievement => {
                const userAchievement = user.achievements.find(ua => ua.achievementId === achievement.id)
                const unlockDate = userAchievement?.unlockedAt ? new Date(userAchievement.unlockedAt) : null
                
                return (
                  <div key={achievement.id} className="group bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                        {achievement.icon}
                      </div>
                      <div className="font-bold text-gray-900 mb-2">{achievement.title}</div>
                      <div className="text-sm text-gray-600 mb-3">{achievement.description}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                          +{achievement.points} pts
                        </span>
                        {unlockDate && (
                          <span className="text-xs text-gray-500">
                            {unlockDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Enhanced Active Challenges */}
        {roleChallenges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <TrophyIcon className="h-6 w-6 text-purple-500" />
                <span>Active Challenges</span>
              </h4>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>Limited Time</span>
              </div>
            </div>
            <div className="space-y-4">
              {roleChallenges.slice(0, 3).map(challenge => {
                const userChallenge = user.challenges.find(uc => uc.challengeId === challenge.id)
                const progress = userChallenge?.progress || 0
                const progressPercentage = Math.min(100, (progress / challenge.targetCount) * 100)
                const isCompleted = progress >= challenge.targetCount
                
                return (
                  <div key={challenge.id} className={`group p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-purple-300'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{challenge.icon}</span>
                          <div>
                            <div className="font-bold text-gray-900">{challenge.title}</div>
                            <div className="text-sm text-gray-600">{challenge.description}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${isCompleted ? 'text-green-600' : 'text-purple-600'}`}>
                          +{challenge.points} pts
                        </div>
                        {isCompleted && (
                          <div className="text-xs text-green-600 font-medium">✓ Completed</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {progress} / {challenge.targetCount}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-green-400 to-green-500' 
                              : 'bg-gradient-to-r from-purple-400 to-purple-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {Math.round(progressPercentage)}% complete
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowAchievements(true)}
            className="group bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 text-yellow-800 py-4 px-6 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <SparklesIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">View All Achievements</span>
            </div>
            <div className="text-xs text-yellow-700 mt-1">
              {unlockedAchievements.length} unlocked • {achievements.length - unlockedAchievements.length} remaining
            </div>
          </button>
          
          <button
            onClick={() => setShowLeaderboard(true)}
            className="group bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-800 py-4 px-6 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <TrophyIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">View Leaderboard</span>
            </div>
            <div className="text-xs text-purple-700 mt-1">
              See how you rank against others
            </div>
          </button>
        </div>
      </div>
      
      {/* Modals */}
      <AchievementModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
      
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  )
}

export default GamificationDashboard
