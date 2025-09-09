import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { SparklesIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface PointsCounterProps {
  className?: string
  showLevel?: boolean
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const PointsCounter: React.FC<PointsCounterProps> = ({ 
  className = '', 
  showLevel = true,
  animated = true,
  size = 'md'
}) => {
  const { user, getGamificationStats } = useAppContext()
  const [previousPoints, setPreviousPoints] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const stats = getGamificationStats()
  
  // Animate when points change
  useEffect(() => {
    if (animated && stats.totalPoints !== previousPoints && previousPoints > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
    setPreviousPoints(stats.totalPoints)
  }, [stats.totalPoints, previousPoints, animated])
  
  // Don't show gamification for admin users or when user is null/undefined
  const shouldHide = !user || user.role === 'admin'
  
  if (shouldHide) return null
  
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'Bronze': 
        return {
          color: 'from-orange-400 to-orange-600',
          textColor: 'text-orange-800',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: '🥉',
          glow: 'shadow-orange-200'
        }
      case 'Silver': 
        return {
          color: 'from-gray-400 to-gray-600',
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '🥈',
          glow: 'shadow-gray-200'
        }
      case 'Gold': 
        return {
          color: 'from-yellow-400 to-yellow-600',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: '🥇',
          glow: 'shadow-yellow-200'
        }
      case 'Platinum': 
        return {
          color: 'from-purple-400 to-purple-600',
          textColor: 'text-purple-800',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          icon: '💎',
          glow: 'shadow-purple-200'
        }
      case 'Diamond': 
        return {
          color: 'from-blue-400 to-blue-600',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: '💠',
          glow: 'shadow-blue-200'
        }
      default: 
        return {
          color: 'from-gray-400 to-gray-600',
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '🥉',
          glow: 'shadow-gray-200'
        }
    }
  }
  
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'space-x-2',
          points: 'px-2 py-1 text-sm',
          level: 'px-2 py-1 text-xs',
          icon: 'text-base',
          progress: 'text-xs'
        }
      case 'lg':
        return {
          container: 'space-x-4',
          points: 'px-4 py-2 text-lg',
          level: 'px-4 py-2 text-base',
          icon: 'text-2xl',
          progress: 'text-sm'
        }
      default: // md
        return {
          container: 'space-x-3',
          points: 'px-3 py-1',
          level: 'px-3 py-1 text-sm',
          icon: 'text-lg',
          progress: 'text-xs'
        }
    }
  }
  
  const levelConfig = getLevelConfig(stats.currentLevel)
  const sizeClasses = getSizeClasses(size)
  const pointsGain = stats.totalPoints - previousPoints
  
  // Calculate progress percentage to next level
  const progressPercentage = stats.pointsToNextLevel > 0 
    ? ((stats.totalPoints % 1000) / 1000) * 100 
    : 100
  
  return (
    <div className={`flex items-center ${sizeClasses.container} ${className}`}>
      {/* Enhanced Points Display */}
      <div className={`relative flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white ${sizeClasses.points} rounded-xl shadow-lg transition-all duration-300 ${
        isAnimating ? 'scale-110 shadow-xl' : ''
      }`}>
        <SparklesIcon className={`${sizeClasses.icon.replace('text-', 'h-5 w-5')} animate-pulse`} />
        <span className="font-bold">{stats.totalPoints.toLocaleString()}</span>
        <span className="text-blue-100 font-medium">pts</span>
        
        {/* Points Gain Animation */}
        {isAnimating && pointsGain > 0 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce-in">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <ChevronUpIcon className="h-3 w-3" />
              <span>+{pointsGain}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Level Display */}
      {showLevel && (
        <div className={`relative flex items-center space-x-2 bg-gradient-to-r ${levelConfig.color} text-white ${sizeClasses.level} rounded-xl shadow-lg border ${levelConfig.borderColor} transition-all duration-300 hover:shadow-xl group`}>
          <span className={`${sizeClasses.icon} group-hover:scale-110 transition-transform duration-200`}>
            {levelConfig.icon}
          </span>
          <span className="font-bold">{stats.currentLevel}</span>
          
          {/* Level Progress Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
              <div className="text-center mb-1">Level Progress</div>
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${levelConfig.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-center mt-1">{Math.round(progressPercentage)}%</div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
      
      {/* Progress to Next Level */}
      {stats.pointsToNextLevel > 0 && showLevel && size !== 'sm' && (
        <div className={`flex items-center space-x-1 ${sizeClasses.progress} text-gray-500 bg-gray-100 px-2 py-1 rounded-full transition-all duration-300 hover:bg-gray-200`}>
          <span className="font-medium">{stats.pointsToNextLevel}</span>
          <span>to next level</span>
        </div>
      )}
    </div>
  )
}

export default PointsCounter
