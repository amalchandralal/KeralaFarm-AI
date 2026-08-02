import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom emerald pin icon
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [28, 44],
  iconAnchor: [14, 44],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to center map smoothly when center prop changes
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lon) {
      map.flyTo([center.lat, center.lon], 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

const MapView = ({ places = [], selectedId, onSelectPlace, center }) => {
  const defaultCenter = [10.8505, 76.2711]; // Kerala default
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

        <MapController center={center} />

        {places.map((place) => {
          if (!place.lat || !place.lon) return null;
          const isSelected = selectedId === place._id;

          return (
            <Marker
              key={place._id}
              position={[place.lat, place.lon]}
              icon={isSelected ? selectedMarkerIcon : customMarkerIcon}
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
