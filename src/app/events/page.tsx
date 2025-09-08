'use client'

import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'

export default function EventsPage() {
  const { isAuthenticated, events, user, rsvpToEvent } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Please log in to view events.</p>
          <a
            href="/auth/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    )
  }

  const handleRSVP = (eventId: string) => {
    rsvpToEvent(eventId)
  }

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory)

  const categories = [...new Set(events.map(e => e.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alumni Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected through networking events, workshops, reunions, and professional development opportunities.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} events
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <div className="text-white text-6xl">
                  {event.category === 'networking' && '🤝'}
                  {event.category === 'reunion' && '🎉'}
                  {event.category === 'workshop' && '📚'}
                  {event.category === 'webinar' && '💻'}
                  {event.category === 'career' && '💼'}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {event.category}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                
                {/* Event Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🕒</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    <span>{event.currentAttendees}/{event.maxAttendees} attending</span>
                  </div>
                </div>

                {/* RSVP Button */}
                <div className="flex items-center justify-between">
                  {event.rsvpList?.includes(user?.id || '') ? (
                    <div className="flex items-center text-green-600">
                      <span className="mr-2">✅</span>
                      <span className="text-sm font-medium">You're going!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      RSVP
                    </button>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Free Event
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Check back later for upcoming events in this category.</p>
          </div>
        )}

        {/* Create Event Button (Admin Only) */}
        {user?.role === 'admin' && (
          <div className="fixed bottom-8 right-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
