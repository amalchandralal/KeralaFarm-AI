import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getBookings, createBooking } from '../services/api'
import BookingCard from '../components/BookingCard'

const BookingsPage = () => {
  const [searchParams] = useSearchParams()
  const placeId = searchParams.get('place')
  const placeName = searchParams.get('name') || ''

  const [bookings, setBookings] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm] = useState(!!placeId)

  const fetchBookings = () => {
    setLoading(true)
    getBookings()
      .then(data => setBookings(Array.isArray(data) ? data : data.bookings || []))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) { setFormError('Please select a date.'); return }
    setSubmitting(true)
    setFormError('')
    try {
      await createBooking({ place: placeId, placeName, date, notes })
      setSuccess('Booking created successfully!')
      setShowForm(false)
      fetchBookings()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setFormError(e?.response?.data?.message || 'Failed to create booking.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-2">📅 My Bookings</h1>
          <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            എന്റെ ബുക്കിങ്ങുകൾ
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + New Booking
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="card mb-8 border-forest-300">
          <h2 className="text-xl font-bold text-forest-800 mb-4">
            📋 Create Booking {placeName && `— ${decodeURIComponent(placeName)}`}
          </h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
              ⚠️ {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!placeId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Place Name</label>
                <input
                  type="text"
                  value={placeName}
                  onChange={() => {}}
                  placeholder="Enter place name"
                  className="input-field"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requirements..."
                className="input-field h-24 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {submitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Booking...</>
                ) : '✅ Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-forest-50 border border-forest-300 text-forest-700 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <p>{success}</p>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">⚠️ {error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-3">📅</p>
          <p className="text-lg mb-2">No bookings yet</p>
          <p style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>ഇതുവരെ ബുക്കിങ്ങ് ഇല്ല</p>
          <Link to="/places" className="btn-primary inline-flex mt-4">Browse Places</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookings.map((b, i) => (
            <BookingCard key={(b as Record<string, unknown>)._id as string || i} booking={b as Record<string, unknown>} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BookingsPage
