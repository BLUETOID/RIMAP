import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { XMarkIcon, TrophyIcon, LockClosedIcon, CalendarIcon, SparklesIcon, FireIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid'

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose }) => {
  const { user, achievements } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Don't show for admin users or when user is null
  const shouldHide = !isOpen || !user || user.role === 'admin'
  
  if (shouldHide) return null

  const userAchievements = user.achievements || []
  
  // Role-based category filtering
  const getRoleBasedCategories = () => {
    const baseCategories = [
      { id: 'all', name: 'All Achievements', icon: TrophyIcon, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' }
    ]
    
    if (user.role === 'alumni') {
      return [
        ...baseCategories,
        { id: 'profile', name: 'Profile', icon: CalendarIcon, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
        { id: 'mentorship', name: 'Mentorship', icon: FireIcon, color: 'bg-gradient-to-r from-red-400 to-pink-500' },
        { id: 'events', name: 'Events', icon: SparklesIcon, color: 'bg-gradient-to-r from-purple-400 to-indigo-500' },
        { id: 'donations', name: 'Donations', icon: StarIcon, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
        { id: 'networking', name: 'Networking', icon: SparklesIcon, color: 'bg-gradient-to-r from-pink-400 to-rose-500' },
        { id: 'special', name: 'Special', icon: TrophyIcon, color: 'bg-gradient-to-r from-violet-400 to-purple-500' }
      ]
    } else if (user.role === 'student') {
      return [
        ...baseCategories,
        { id: 'profile', name: 'Profile', icon: CalendarIcon, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
        { id: 'events', name: 'Events', icon: SparklesIcon, color: 'bg-gradient-to-r from-purple-400 to-indigo-500' },
        { id: 'networking', name: 'Networking', icon: SparklesIcon, color: 'bg-gradient-to-r from-pink-400 to-rose-500' },
        { id: 'special', name: 'Special', icon: TrophyIcon, color: 'bg-gradient-to-r from-violet-400 to-purple-500' }
      ]
    }
    return baseCategories
  }
  
  const categories = getRoleBasedCategories()
  
  // Filter achievements based on role
  const getRoleBasedAchievements = () => {
    if (user.role === 'alumni') {
      return achievements.filter(a => 
        a.category === 'profile' || 
        a.category === 'mentorship' || 
        a.category === 'events' || 
        a.category === 'donations' || 
        a.category === 'networking' || 
        a.category === 'special'
      )
    } else if (user.role === 'student') {
      return achievements.filter(a => 
        a.category === 'profile' || 
        a.category === 'events' || 
        a.category === 'networking' || 
        a.category === 'special'
      )
    }
    return achievements
  }

  const roleBasedAchievements = getRoleBasedAchievements()
  
  const filteredAchievements = selectedCategory === 'all' 
    ? roleBasedAchievements 
    : roleBasedAchievements.filter(a => a.category === selectedCategory)

  const getAchievementStatus = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId)
    return userAchievement?.unlockedAt ? 'unlocked' : 'locked'
  }

  const getAchievementDate = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId)
    return userAchievement?.unlockedAt ? new Date(userAchievement.unlockedAt).toLocaleDateString() : null
  }

  const getCategoryData = (category: string) => {
    return categories.find(c => c.id === category) || categories[0]
  }

  const unlockedCount = filteredAchievements.filter(a => getAchievementStatus(a.id) === 'unlocked').length
  const totalCount = filteredAchievements.length
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <TrophyIcon className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Achievement Gallery</h2>
                <p className="text-white text-opacity-90 text-lg">
                  {unlockedCount} of {totalCount} achievements unlocked • {user.totalPoints} total points
                </p>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="mt-6 bg-white bg-opacity-20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-white transition-all duration-700 ease-out rounded-full shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-white text-opacity-90 mt-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Category Tabs */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.id
              const categoryAchievements = category.id === 'all' ? achievements : achievements.filter(a => a.category === category.id)
              const categoryUnlocked = categoryAchievements.filter(a => getAchievementStatus(a.id) === 'unlocked').length
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? `${category.color} text-white shadow-lg transform scale-105 ring-4 ring-white ring-opacity-30` 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    isActive ? 'bg-white bg-opacity-25' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {categoryUnlocked}/{categoryAchievements.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Achievements Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh] bg-gradient-to-b from-gray-50 to-white">
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const status = getAchievementStatus(achievement.id)
                const unlockedDate = getAchievementDate(achievement.id)
                const categoryData = getCategoryData(achievement.category)
                const Icon = categoryData.icon
                const isUnlocked = status === 'unlocked'
                
                return (
                  <div
                    key={achievement.id}
                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      isUnlocked 
                        ? 'border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 hover:border-green-300' 
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-2xl transition-all duration-300 ${
                        isUnlocked ? categoryData.color + ' group-hover:scale-110' : 'bg-gray-300'
                      }`}>
                        {isUnlocked ? (
                          <CheckCircleIcon className="h-8 w-8 text-white" />
                        ) : (
                          <LockClosedIcon className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {achievement.title}
                          </h3>
                          <Icon className={`h-5 w-5 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        
                        <p className={`text-sm mb-4 leading-relaxed ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-bold transition-all ${
                            isUnlocked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-500'
                          }`}>
                            <SparklesIcon className="h-4 w-4" />
                            <span>{achievement.points} points</span>
                          </div>
                          
                          {unlockedDate && (
                            <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{unlockedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <TrophyIcon className="h-20 w-20 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No achievements yet</h3>
              <p className="text-gray-400">Start participating to unlock your first achievement!</p>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">💡 Tip:</span> Complete your profile and attend events to earn more achievements!
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                Continue Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementModal
