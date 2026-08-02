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
    <div className="min-h-screen px-4 py-8 mx-auto font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              My Bookings
            </h1>
          </div>
          
          <button 
            onClick={() => { setShowForm(true); resetForm() }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-sm transition-colors self-start md:self-auto"
          >
            <Plus size={18} />
            New Booking
          </button>
        </div>

        {/* Global Alerts */}
        {success && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            {success}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg">
            <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />
            {error}
          </div>
        )}

        {/* New Booking Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
                  Create New Booking
                </h2>
                <button 
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {formError && (
                  <div className="flex items-center gap-2 p-3 mb-6 text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-md">
                    <AlertTriangle size={18} /> {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Place Name */}
                  <div className="md:col-span-2">
                    <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Place Name *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                      <input
                        type="text"
                        value={placeName}
                        onChange={e => setPlaceName(e.target.value)}
                        placeholder="e.g. Krishi Bhavan Palakkad"
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Your Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  {/* Check-In */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Check-In Date *</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={e => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>

                  {/* Check-Out */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Check-Out Date *</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2">
                    <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Budget / Fee (Optional)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="500"
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); resetForm() }}
                      className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? 'Creating...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="p-4 mb-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 dark:text-slate-500">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No Bookings Yet</h3>
            <p className="max-w-md mt-1 text-sm text-slate-500 dark:text-slate-400">
              You haven't made any Krishi Bhavan or consultation bookings yet. Search for nearby farm centers to schedule an appointment.
            </p>
            <Link
              to="/places"
              className="inline-flex items-center gap-2 px-4 py-2 mt-6 text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm"
            >
              Explore Farm Centers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard key={booking._id || booking.id} booking={booking} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default BookingsPage