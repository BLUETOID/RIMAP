import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { TrophyIcon, XMarkIcon, ArrowLeftIcon, StarIcon, FireIcon } from '@heroicons/react/24/outline'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { leaderboards, user } = useAppContext()
  const [activeCategory, setActiveCategory] = useState<string>('overall')
  
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
  
  if (!isOpen || !user || user.role === 'admin') return null
  
  const currentLeaderboard = leaderboards.find(lb => lb.category === activeCategory)
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <TrophyIcon className="h-6 w-6 text-yellow-500" />
      case 2: return <StarIcon className="h-6 w-6 text-gray-400" />
      case 3: return <FireIcon className="h-6 w-6 text-orange-500" />
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }
  
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return ''
    }
  }
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
      case 'Silver': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 'Platinum': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
      case 'Diamond': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const getRankCardStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg ring-2 ring-blue-200'
    }
    
    switch (rank) {
      case 1: return 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg'
      case 2: return 'border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50 shadow-md'
      case 3: return 'border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 shadow-md'
      default: return 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md'
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const categoryIcons = {
    overall: TrophyIcon,
    monthly: StarIcon,
    events: FireIcon,
    mentorship: TrophyIcon
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-in">
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
                <h2 className="text-3xl font-bold mb-1">Leaderboard Champions</h2>
                <p className="text-white text-opacity-90 text-lg">
                  See how you rank among {currentLeaderboard?.entries.length || 0} active members
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Category Tabs */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {leaderboards.map(leaderboard => {
              const Icon = categoryIcons[leaderboard.category as keyof typeof categoryIcons] || TrophyIcon
              const isActive = activeCategory === leaderboard.category
              
              return (
                <button
                  key={leaderboard.id}
                  onClick={() => setActiveCategory(leaderboard.category)}
                  className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105 ring-4 ring-blue-200' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{leaderboard.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    isActive ? 'bg-white bg-opacity-25' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {leaderboard.entries.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Enhanced Leaderboard Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          {currentLeaderboard ? (
            <div className="space-y-4">
              {currentLeaderboard.entries.map((entry, index) => {
                const isCurrentUser = user && entry.userId === user.id
                const isTopThree = entry.rank <= 3
                
                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                      getRankCardStyle(entry.rank, !!isCurrentUser)
                    } ${isCurrentUser ? 'transform scale-102' : 'hover:scale-105'}`}
                  >
                    <div className="flex items-center space-x-6">
                      {/* Enhanced Rank Display */}
                      <div className="flex flex-col items-center min-w-[4rem]">
                        <div className="flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                          {isTopThree && (
                            <span className="ml-1 text-2xl">{getRankBadge(entry.rank)}</span>
                          )}
                        </div>
                        {entry.rank <= 3 && (
                          <div className="text-xs font-bold text-gray-600 mt-1">
                            TOP {entry.rank}
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className={`text-lg font-bold ${
                            isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {entry.userName}
                          </h3>
                          {isCurrentUser && (
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-bold shadow-md">
                              YOU
                            </span>
                          )}
                          {isTopThree && !isCurrentUser && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold">
                              CHAMPION
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="capitalize font-medium bg-gray-100 px-2 py-1 rounded-full">
                            {entry.userRole}
                          </span>
                          {entry.department && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                              {entry.department}
                            </span>
                          )}
                          {entry.graduationYear && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Class of {entry.graduationYear}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Points and Level Display */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {entry.points.toLocaleString()}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">pts</span>
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(entry.level)}`}>
                        {entry.level}
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
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No leaderboard data</h3>
              <p className="text-gray-400">Start earning points to appear on the leaderboard!</p>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">🏆 Tip:</span> Earn points by attending events, mentoring, and engaging with the community!
              </div>
            </div>
            <div className="flex space-x-3">
              {user && currentLeaderboard && (
                <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border">
                  <span className="font-semibold">Your Rank:</span> 
                  <span className="ml-1 text-blue-600 font-bold">
                    #{currentLeaderboard.entries.find(e => e.userId === user.id)?.rank || 'Unranked'}
                  </span>
                </div>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                Close Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardModal
