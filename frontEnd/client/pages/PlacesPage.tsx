import React, { useEffect, useState } from 'react'
import { getPlaces } from '../services/api'
import PlaceCard from '../components/PlaceCard'

const PlacesPage = () => {
  const [places, setPlaces] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPlaces()
      .then(data => setPlaces(Array.isArray(data) ? data : data.places || []))
      .catch(() => setError('Failed to load places. Please check your connection.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-2">
          📍 Agricultural Places
        </h1>
        <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
          കൃഷി കേന്ദ്രങ്ങൾ
        </p>
        <p className="text-gray-600 mt-1">Find Krishi Bhavans, farm support centers, and more</p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && places.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-3">📍</p>
          <p className="text-lg">No places found</p>
          <p style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>സ്ഥലങ്ങൾ കണ്ടെത്തിയില്ല</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.map((place, i) => (
          <PlaceCard key={(place as Record<string, unknown>)._id as string || i} place={place as Record<string, unknown>} />
        ))}
      </div>
    </div>
  )
}

export default PlacesPage
