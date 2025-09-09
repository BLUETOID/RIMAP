import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon, 
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface GamificationStatsProps {
  className?: string
  showDetailed?: boolean
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({ 
  className = '',
  showDetailed = false 
}) => {
  const { user, getGamificationStats, achievements } = useAppContext()
  const [animateProgress, setAnimateProgress] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  if (!user) return null
  
  const stats = getGamificationStats()
  
  const getProgressPercentage = () => {
    const levelThresholds = {
      'Bronze': 200,
      'Silver': 500,
      'Gold': 1000,
      'Platinum': 2000,
      'Diamond': Infinity
    }
    
    const currentThreshold = levelThresholds[stats.currentLevel as keyof typeof levelThresholds]
    if (currentThreshold === Infinity) return 100
    
    const previousThreshold = stats.currentLevel === 'Bronze' ? 0 : 
      stats.currentLevel === 'Silver' ? 200 :
      stats.currentLevel === 'Gold' ? 500 :
      stats.currentLevel === 'Platinum' ? 1000 : 0
    
    const progress = ((stats.totalPoints - previousThreshold) / (currentThreshold - previousThreshold)) * 100
    return Math.min(100, Math.max(0, progress))
  }
  
  const getLevelInfo = () => {
    const levels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']
    const currentIndex = levels.indexOf(stats.currentLevel)
    return {
      current: stats.currentLevel,
      next: currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null,
      progress: getProgressPercentage(),
      isMaxLevel: currentIndex === levels.length - 1
    }
  }
  
  const levelInfo = getLevelInfo()
  
  const getStreakStatus = () => {
    if (stats.currentStreak >= 30) return { status: 'legendary', color: 'purple', icon: '👑' }
    if (stats.currentStreak >= 14) return { status: 'amazing', color: 'orange', icon: '🔥' }
    if (stats.currentStreak >= 7) return { status: 'great', color: 'green', icon: '⚡' }
    if (stats.currentStreak >= 3) return { status: 'good', color: 'blue', icon: '💪' }
    return { status: 'starting', color: 'gray', icon: '🎯' }
  }
  
  const streakInfo = getStreakStatus()
  
  const recentAchievements = achievements
    .filter(achievement => user.achievements.some(ua => ua.achievementId === achievement.id && ua.unlockedAt))
    .slice(-3)
  
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
              <p className="text-sm text-gray-600">Track your journey and achievements</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{stats.totalPoints.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-500">Total Points</div>
          </div>
        </div>
      </div>
      
      {/* Level Progress Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {stats.currentLevel === 'Bronze' && '🥉'}
              {stats.currentLevel === 'Silver' && '🥈'}
              {stats.currentLevel === 'Gold' && '🥇'}
              {stats.currentLevel === 'Platinum' && '💎'}
              {stats.currentLevel === 'Diamond' && '💠'}
            </span>
            <div>
              <div className="text-lg font-bold text-gray-900">Level: {stats.currentLevel}</div>
              {levelInfo.next && (
                <div className="text-sm text-gray-600">
                  Next: {levelInfo.next} • {stats.pointsToNextLevel} points to go
                </div>
              )}
              {levelInfo.isMaxLevel && (
                <div className="text-sm text-purple-600 font-medium">🎉 Maximum Level Achieved!</div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Progress</div>
            <div className="text-lg font-bold text-gray-900">{Math.round(levelInfo.progress)}%</div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out ${
                animateProgress ? 'animate-pulse' : ''
              }`}
              style={{ 
                width: animateProgress ? `${levelInfo.progress}%` : '0%',
                transition: 'width 1.5s ease-out'
              }}
            />
          </div>
          {!levelInfo.isMaxLevel && (
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {levelInfo.next}
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Achievements */}
          <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <TrophyIcon className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-700 mb-1">{stats.achievementsUnlocked}</div>
            <div className="text-sm text-green-600 font-medium">Achievements</div>
            <div className="text-xs text-green-500">of {stats.totalAchievements} total</div>
          </div>
          
          {/* Global Rank */}
          <div className="group bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <UserGroupIcon className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Rank</div>
            </div>
            <div className="text-2xl font-bold text-purple-700 mb-1">#{stats.rank || 'N/A'}</div>
            <div className="text-sm text-purple-600 font-medium">Global Rank</div>
            <div className="text-xs text-purple-500">Leaderboard</div>
          </div>
          
          {/* Current Streak */}
          <div className={`group bg-gradient-to-br from-${streakInfo.color}-50 to-${streakInfo.color}-100 p-4 rounded-xl border border-${streakInfo.color}-200 hover:border-${streakInfo.color}-300 transition-all duration-300 hover:shadow-lg cursor-pointer`}>
            <div className="flex items-center justify-between mb-2">
              <FireIcon className={`h-6 w-6 text-${streakInfo.color}-600 group-hover:scale-110 transition-transform duration-200`} />
              <span className="text-lg">{streakInfo.icon}</span>
            </div>
            <div className={`text-2xl font-bold text-${streakInfo.color}-700 mb-1`}>{stats.currentStreak}</div>
            <div className={`text-sm text-${streakInfo.color}-600 font-medium`}>Login Streak</div>
            <div className={`text-xs text-${streakInfo.color}-500 capitalize`}>{streakInfo.status}</div>
          </div>
          
          {/* Best Streak */}
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Record</div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">{stats.longestStreak}</div>
            <div className="text-sm text-blue-600 font-medium">Best Streak</div>
            <div className="text-xs text-blue-500">Personal record</div>
          </div>
        </div>
        
        {/* Recent Achievements Preview */}
        {showDetailed && recentAchievements.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-yellow-500" />
              <span>Latest Achievements</span>
            </h4>
            <div className="space-y-2">
              {recentAchievements.map(achievement => {
                const userAchievement = user.achievements.find(ua => ua.achievementId === achievement.id)
                const unlockDate = userAchievement?.unlockedAt ? new Date(userAchievement.unlockedAt) : null
                
                return (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{achievement.title}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <span>+{achievement.points} points</span>
                        {unlockDate && (
                          <>
                            <span>•</span>
                            <span>{unlockDate.toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamificationStats
