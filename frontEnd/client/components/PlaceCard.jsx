import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Navigation } from 'lucide-react'

const PlaceCard = ({ place, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col p-4 bg-white border ${isSelected ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'} rounded-lg cursor-pointer transition-all hover:shadow-sm hover:border-gray-300 h-full`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{place.name}</h3>
        {place.distance !== undefined && (
          <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md whitespace-nowrap ml-2">
            {place.distance.toFixed(1)} km
          </span>
        )}
      </div>
      <p className="mb-4 text-sm text-gray-500 line-clamp-2">
        {place.address || place.location || place.description}
      </p>
      
      <div className="flex gap-2 mt-auto">
        <Link
          to={`/bookings/new?place=${place._id || place.id}&name=${encodeURIComponent(place.name || '')}`}
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center flex-1 gap-1.5 py-2 text-sm font-medium text-white transition-colors bg-emerald-600 rounded-md hover:bg-emerald-700"
        >
          <Calendar size={14} /> Book
        </Link>
        {place.lat && place.lon && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center flex-1 gap-1.5 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
          >
            <Navigation size={14} /> Dir
          </a>
        )}
      </div>
    </div>
  )
}

export default PlaceCard