import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Inbox, ArrowLeft, Phone, User, MapPin, IndianRupee, CheckCircle2, AlertTriangle } from 'lucide-react'
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
    <div className="min-h-screen pt-12 pb-20 bg-stone-50">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase transition-all text-emerald-600 hover:gap-3">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="mb-1 text-4xl font-black tracking-tight md:text-5xl text-slate-900">
              My <span className="text-emerald-600">Bookings</span>
            </h1>
          </div>
          
          <button 
            onClick={() => { setShowForm(!showForm); resetForm() }}
            className={`px-8 py-4 rounded-2xl font-black text-base shadow-lg transition-all flex items-center gap-3 h-fit ${
              showForm 
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                : 'bg-emerald-600 text-white shadow-emerald-200/50 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95'
            }`}
          >
            {showForm ? 'Cancel' : <><Plus size={20} /> New Booking</>}
          </button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3 p-6 mb-8 border bg-emerald-50 border-emerald-100 text-emerald-700 rounded-[2rem] shadow-sm font-bold"
            >
              <CheckCircle2 size={24} />
              <p>{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                <h2 className="flex items-center gap-3 mb-8 text-2xl font-black text-slate-900">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl text-emerald-600">
                    <Calendar size={20} />
                  </div>
                  Create New Booking
                  {placeNameFromUrl && <span className="ml-auto text-sm font-black tracking-widest uppercase text-emerald-600">— {decodeURIComponent(placeNameFromUrl)}</span>}
                </h2>

                {formError && (
                  <div className="flex items-center gap-3 p-4 mb-8 text-sm font-bold text-red-700 border border-red-100 bg-red-50 rounded-2xl">
                    <AlertTriangle size={20} /> {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Place Name */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Place Name *</label>
                    <div className="relative">
                      <MapPin className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={placeName}
                        onChange={e => setPlaceName(e.target.value)}
                        placeholder="e.g. Krishi Bhavan Palakkad"
                        className="w-full py-4 pl-12 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Full Name *</label>
                    <div className="relative">
                      <User className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full py-4 pl-12 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full py-4 pl-12 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* Check-in */}
                  <div>
                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Check-In Date *</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      min={today}
                      className="w-full px-5 py-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Check-out */}
                  <div>
                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Check-Out Date *</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      min={checkIn || today}
                      className="w-full px-5 py-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Estimated Price (optional)</label>
                    <div className="relative">
                      <IndianRupee className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="₹ Amount"
                        min="0"
                        className="w-full py-4 pl-12 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 md:col-span-2">
                    <button 
                      type="button" 
                      onClick={() => { setShowForm(false); resetForm() }} 
                      className="flex-1 py-4 font-black transition-all rounded-2xl text-slate-500 bg-slate-100 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="flex items-center justify-center flex-1 gap-3 py-4 font-black text-white transition-all shadow-xl rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 disabled:opacity-50"
                    >
                      {submitting
                        ? <><div className="w-5 h-5 border-white rounded-full border-3 border-t-transparent animate-spin" /> Processing...</>
                        : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookings List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <div className="w-12 h-12 border-4 rounded-full border-emerald-100 border-t-emerald-600 animate-spin" />
            <p className="text-xs font-black tracking-widest uppercase text-emerald-700">Loading your bookings…</p>
          </div>
        ) : error ? (
          <div className="p-8 text-red-700 border border-red-100 bg-red-50 rounded-[2rem] font-bold text-center">
            <AlertTriangle size={36} className="mx-auto mb-4" />
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-300">
              <Inbox size={40} />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-900">No bookings yet</h3>
            <p className="max-w-xs px-4 mx-auto mb-8 font-medium text-slate-500">
              Find agricultural centers and book your visit today.
            </p>
            <Link to="/places" className="px-10 py-4 font-black text-white transition-all shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200/50 hover:bg-emerald-700 active:scale-95">
              Browse Places
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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