import React from 'react'

interface BookingCardProps {
  booking: {
    _id?: string
    place?: string
    placeName?: string
    date?: string
    status?: string
    notes?: string
    [key: string]: unknown
  }
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-forest-100 text-forest-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const statusClass = statusColors[booking.status?.toLowerCase() || ''] || 'bg-gray-100 text-gray-700'

  return (
    <div className="flex flex-col gap-2 card">
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-forest-800">{booking.placeName || booking.place || 'Booking'}</h3>
        {booking.status && (
          <span className={`badge ${statusClass} text-xs capitalize`}>{booking.status}</span>
        )}
      </div>
      {booking.date && (
        <p className="flex items-center gap-2 text-sm text-gray-600">
           {new Date(booking.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </p>
      )}
      {booking.notes && (
        <p className="text-sm text-gray-500">{booking.notes}</p>
      )}
      {booking._id && (
        <p className="font-mono text-xs text-gray-400">ID: {booking._id}</p>
      )}
    </div>
  )
}

export default BookingCard
