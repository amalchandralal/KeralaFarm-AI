import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useJsApiLoader, GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, ExternalLink } from 'lucide-react';

// --- Leaflet Setup ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customLeafletIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="37.5"><path fill="%23059669" stroke="%23047857" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/><circle cx="12" cy="12" r="5" fill="white"/></svg>',
  iconSize: [25, 37.5],
  iconAnchor: [12, 37.5],
  popupAnchor: [0, -34],
});

const selectedLeafletIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42"><path fill="%23eab308" stroke="%23ca8a04" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/><circle cx="12" cy="12" r="5" fill="white"/></svg>',
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -38],
});

const LeafletController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lon) {
      map.flyTo([center.lat, center.lon], 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

// --- Google Maps Component ---
const GoogleMapViewComponent = ({ googleApiKey, places = [], selectedId, onSelectPlace, center }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries: ['places'],
  });

  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const mapRef = useRef(null);

  const defaultCenter = { lat: 10.8505, lng: 76.2711 }; // Kerala center
  const currentCenter = center?.lat && center?.lon 
    ? { lat: parseFloat(center.lat), lng: parseFloat(center.lon) } 
    : defaultCenter;

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (mapRef.current && center?.lat && center?.lon) {
      mapRef.current.panTo({ lat: parseFloat(center.lat), lng: parseFloat(center.lon) });
    }
  }, [center]);

  useEffect(() => {
    if (selectedId) {
      const selected = places.find(p => p._id === selectedId);
      if (selected) setActiveInfoWindow(selected);
    }
  }, [selectedId, places]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        <p className="text-sm font-medium text-rose-500 mb-1">Google Maps load error</p>
        <p className="text-xs">Please verify your VITE_GOOGLE_MAPS_API_KEY in .env</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900 text-slate-400">
        <p className="text-xs animate-pulse">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '1rem' }}
      center={currentCenter}
      zoom={11}
      onLoad={onMapLoad}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {places.map((place) => {
        if (!place.lat || !place.lon) return null;
        const isSelected = selectedId === place._id;
        const pos = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };

        return (
          <MarkerF
            key={place._id}
            position={pos}
            onClick={() => {
              setActiveInfoWindow(place);
              onSelectPlace && onSelectPlace(place);
            }}
            icon={
              isSelected
                ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }
          />
        );
      })}

      {activeInfoWindow && activeInfoWindow.lat && activeInfoWindow.lon && (
        <InfoWindowF
          position={{ lat: parseFloat(activeInfoWindow.lat), lng: parseFloat(activeInfoWindow.lon) }}
          onCloseClick={() => setActiveInfoWindow(null)}
        >
          <div className="p-1 max-w-xs font-sans text-slate-900">
            <h4 className="font-bold text-sm mb-1">{activeInfoWindow.name}</h4>
            <p className="text-xs text-slate-600 mb-2">{activeInfoWindow.address}</p>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              {typeof activeInfoWindow.distance === 'number' && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {activeInfoWindow.distance.toFixed(1)} km away
                </span>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeInfoWindow.lat},${activeInfoWindow.lon}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
              >
                Directions <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

// --- Combined MapView Component ---
const MapView = ({ places = [], selectedId, onSelectPlace, center }) => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (googleApiKey && googleApiKey.trim() !== '') {
    return (
      <div className="w-full h-full relative z-0">
        <GoogleMapViewComponent
          googleApiKey={googleApiKey}
          places={places}
          selectedId={selectedId}
          onSelectPlace={onSelectPlace}
          center={center}
        />
      </div>
    );
  }

  // Fallback to Leaflet if Google Maps API key is not configured yet
  const defaultCenter = [10.8505, 76.2711];
  const initialCenter = center?.lat && center?.lon ? [center.lat, center.lon] : defaultCenter;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={initialCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LeafletController center={center} />

        {places.map((place) => {
          if (!place.lat || !place.lon) return null;
          const isSelected = selectedId === place._id;

          return (
            <Marker
              key={place._id}
              position={[place.lat, place.lon]}
              icon={isSelected ? selectedLeafletIcon : customLeafletIcon}
              eventHandlers={{
                click: () => onSelectPlace && onSelectPlace(place),
              }}
            >
              <Popup className="font-sans">
                <div className="p-1 max-w-xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{place.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{place.address}</p>
                  {typeof place.distance === 'number' && (
                    <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {place.distance.toFixed(1)} km away
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
