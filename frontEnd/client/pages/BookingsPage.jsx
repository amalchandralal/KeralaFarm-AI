import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Calendar, Plus, Inbox, ArrowLeft, Phone, User, MapPin, IndianRupee, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { getBookings, createBooking } from '../services/api'
import BookingCard from '../components/BookingCard'

const BookingsPage = () => {
  const [searchParams] = useSearchParams()
  const placeId          = searchParams.get('place')
  const placeNameFromUrl = searchParams.get('name') || ''

  const [bookings,   setBookings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [showForm,   setShowForm]   = useState(!!placeId)
  const [submitting, setSubmitting] = useState(false)
  const [formError,  setFormError]  = useState('')

  // Form fields
  const [placeName, setPlaceName] = useState(decodeURIComponent(placeNameFromUrl))
  const [name,      setName]      = useState('')
  const [phone,     setPhone]     = useState('')
  const [checkIn,   setCheckIn]   = useState('')
  const [checkOut,  setCheckOut]  = useState('')
  const [price,     setPrice]     = useState('')

  const today = new Date().toISOString().split('T')[0]

  const fetchBookings = () => {
    setLoading(true)
    getBookings()
      .then(data => setBookings(Array.isArray(data) ? data : data.bookings || []))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const resetForm = () => {
    setPlaceName(decodeURIComponent(placeNameFromUrl)); 
    setName(''); 
    setPhone('')
    setCheckIn(''); 
    setCheckOut(''); 
    setPrice('')
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!placeName.trim()) { setFormError('Please enter a place name.'); return }
    if (!name.trim())      { setFormError('Please enter your name.'); return }
    if (!phone.trim())     { setFormError('Please enter your phone number.'); return }
    if (!checkIn)          { setFormError('Please select a check-in date.'); return }
    if (!checkOut)         { setFormError('Please select a check-out date.'); return }
    if (checkOut <= checkIn) { setFormError('Check-out must be after check-in.'); return }

    setSubmitting(true)
    setFormError('')
    try {
      await createBooking({
        place:     placeId || placeName.trim(),
        placeName: placeName.trim(),
        name:      name.trim(),
        phone:     phone.trim(),
        checkIn,
        checkOut,
        ...(price ? { price: parseFloat(price) } : {}),
      })
      setSuccess('Booking created successfully!')
      setShowForm(false)
      resetForm()
      fetchBookings()
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setFormError(err.message || 'Failed to create booking.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 font-sans relative">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 mb-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              My Bookings
            </h1>
          </div>
          
          <button 
            onClick={() => { setShowForm(true); resetForm() }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors w-fit shadow-sm"
          >
            <Plus size={18} /> New Booking
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* Overlay Panel for Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar size={20} className="text-emerald-600" />
                  Create New Booking
                </h2>
                <button 
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {formError && (
                  <div className="flex items-center gap-2 p-3 mb-6 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md">
                    <AlertTriangle size={18} /> {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Place Name */}
                  <div className="md:col-span-2">
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Place Name *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={placeName}
                        onChange={e => setPlaceName(e.target.value)}
                        placeholder="e.g. Krishi Bhavan Palakkad"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Your Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Check-in */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Check-In Date *</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      min={today}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-gray-900"
                    />
                  </div>

                  {/* Check-out */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Check-Out Date *</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      min={checkIn || today}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-gray-900"
                    />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2">
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Estimated Price (optional)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="Amount"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => { setShowForm(false); resetForm() }} 
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-colors bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 min-w-[140px]"
                    >
                      {submitting
                        ? <><div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" /> Processing...</>
                        : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-700 bg-red-50 border border-red-100 rounded-lg text-sm text-center">
            <AlertTriangle size={24} className="mx-auto mb-2" />
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 text-gray-400">
              <Inbox size={32} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No bookings yet</h3>
            <p className="mb-6 text-sm text-gray-500 max-w-sm">
              Find agricultural centers and book your visit today.
            </p>
            <Link to="/places" className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors">
              Browse Places
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b, i) => (
              <BookingCard
                key={b._id || i}
                booking={b}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingsPage