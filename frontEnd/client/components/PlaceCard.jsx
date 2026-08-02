import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Navigation, MapPin } from 'lucide-react'

const PlaceCard = ({ place, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
        isSelected
          ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/40'
          : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg ${isSelected ? 'bg-emerald-100 dark:bg-emerald-950/60' : 'bg-gray-100 dark:bg-slate-800'}`}>
        <MapPin size={16} className={isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400'} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{place?.name}</p>
        <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
          {place?.address || 'Address not available'}
        </p>
      </div>

      {/* Distance + Actions */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {typeof place?.distance === 'number' && (
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
            {place.distance.toFixed(1)} km
          </span>
        )}
        <div className="flex gap-1">
          <Link
            to={`/bookings/new?place=${place?._id || place?.id}&name=${encodeURIComponent(place?.name || '')}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
          >
            <Calendar size={11} /> Book
          </Link>
          {place?.lat && place?.lon && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Navigation size={11} /> Dir
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaceCard