'use client'

import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'

export default function DonationsPage() {
  const { isAuthenticated, donations, donationRecords, user, makeDonation } = useAppContext()
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedCause, setSelectedCause] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Please log in to make donations.</p>
          <a
            href="/auth/login"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    )
  }

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]
  
  const causes = [
    { id: 'scholarship', name: 'Student Scholarships', description: 'Support deserving students with financial aid' },
    { id: 'infrastructure', name: 'Campus Infrastructure', description: 'Improve facilities and learning environments' },
    { id: 'research', name: 'Research Programs', description: 'Fund cutting-edge research projects' },
    { id: 'emergency', name: 'Emergency Fund', description: 'Help students in crisis situations' }
  ]

  const handleDonation = () => {
    const amount = customAmount || donationAmount
    if (!amount || !selectedCause) {
      alert('Please select an amount and cause')
      return
    }

    makeDonation({
      amount: parseFloat(amount),
      cause: selectedCause,
      donorName: user?.name || 'Anonymous'
    })

    setShowThankYou(true)
    setDonationAmount('')
    setCustomAmount('')
    setSelectedCause('')
    
    setTimeout(() => setShowThankYou(false), 5000)
  }

  // Calculate total donated and recent donations
  const totalDonated = donationRecords.reduce((sum, donation) => sum + donation.amount, 0)
  const recentDonations = donationRecords.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Your Alma Mater</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your generous contributions help create opportunities for current and future students. Every donation makes a difference.
          </p>
        </div>

        {/* Thank You Message */}
        {showThankYou && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-8 text-center">
            <p className="font-medium">🎉 Thank you for your generous donation!</p>
            <p className="text-sm">Your contribution will make a real difference in students' lives.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
            
            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => {
                      setDonationAmount(amount.toString())
                      setCustomAmount('')
                    }}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      donationAmount === amount.toString()
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setDonationAmount('')
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cause Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose a Cause
              </label>
              <div className="space-y-3">
                {causes.map(cause => (
                  <div
                    key={cause.id}
                    onClick={() => setSelectedCause(cause.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCause === cause.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{cause.name}</h3>
                        <p className="text-sm text-gray-600">{cause.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedCause === cause.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedCause === cause.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Summary */}
            {(donationAmount || customAmount) && selectedCause && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Donation Summary</h3>
                <div className="flex justify-between items-center">
                  <span>Amount:</span>
                  <span className="font-medium">${customAmount || donationAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cause:</span>
                  <span className="font-medium">
                    {causes.find(c => c.id === selectedCause)?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Donate Button */}
            <button
              onClick={handleDonation}
              disabled={!(donationAmount || customAmount) || !selectedCause}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Donate Now
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your donation is secure and tax-deductible. You will receive a receipt via email.
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Our Impact</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${totalDonated.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{donationRecords.length}</div>
                  <div className="text-sm text-gray-600">Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">150+</div>
                  <div className="text-sm text-gray-600">Students Helped</div>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Donations</h3>
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-sm">{donation.donorName}</div>
                      <div className="text-xs text-gray-500 capitalize">{donation.cause.replace('_', ' ')}</div>
                    </div>
                    <div className="font-medium text-green-600">${donation.amount}</div>
                  </div>
                ))}
                {recentDonations.length === 0 && (
                  <p className="text-gray-500 text-sm text-center">Be the first to donate!</p>
                )}
              </div>
            </div>

            {/* Recognition Levels */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recognition Levels</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🥉 Bronze</span>
                  <span>$100+</span>
                </div>
                <div className="flex justify-between">
                  <span>🥈 Silver</span>
                  <span>$500+</span>
                </div>
                <div className="flex justify-between">
                  <span>🥇 Gold</span>
                  <span>$1,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>💎 Diamond</span>
                  <span>$5,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
