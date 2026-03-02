import React from 'react'
import { Link } from 'react-router-dom'

interface PlaceCardProps {
  place: {
    _id?: string
    name?: string
    description?: string
    location?: string
    image?: string
    category?: string
    [key: string]: unknown
  }
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  return (
    <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden p-0">
      {place.image && (
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-40 object-cover"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="p-4">
        {place.category && (
          <span className="badge bg-forest-100 text-forest-700 mb-2 text-xs">{place.category}</span>
        )}
        <h3 className="font-bold text-forest-800 text-lg mb-1">{place.name}</h3>
        {place.location && (
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
            📍 {place.location}
          </p>
        )}
        {place.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{place.description}</p>
        )}
        <Link
          to={`/bookings/new?place=${place._id}&name=${encodeURIComponent(place.name || '')}`}
          className="mt-3 btn-primary text-sm py-2 w-full text-center block"
        >
          📅 Book Now
        </Link>
      </div>
    </div>
  )
}

export default PlaceCard
