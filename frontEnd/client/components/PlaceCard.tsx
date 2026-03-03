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
    <div className="p-0 overflow-hidden transition-all duration-200 card hover:shadow-lg hover:-translate-y-1">
      {place.image && (
        <img
          src={place.image}
          alt={place.name}
          className="object-cover w-full h-40"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="p-4">
        {place.category && (
          <span className="mb-2 text-xs badge bg-forest-100 text-forest-700">{place.category}</span>
        )}
        <h3 className="mb-1 text-lg font-bold text-forest-800">{place.name}</h3>
        {place.location && (
          <p className="flex items-center gap-1 mb-2 text-sm text-gray-500">
             {place.location}
          </p>
        )}
        {place.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>
        )}
        <Link
          to={`/bookings/new?place=${place._id}&name=${encodeURIComponent(place.name || '')}`}
          className="block w-full py-2 mt-3 text-sm text-center btn-primary"
        >
           Book Now
        </Link>
      </div>
    </div>
  )
}

export default PlaceCard
