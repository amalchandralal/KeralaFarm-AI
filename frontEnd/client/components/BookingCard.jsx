import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Info, 
  Hash, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Phone
} from 'lucide-react';

const statusConfig = {
  confirmed: { 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50', 
    label: 'Confirmed',
    icon: <CheckCircle2 size={14} className="text-emerald-600" /> 
  },
  pending: { 
    color: 'text-yellow-700', 
    bg: 'bg-yellow-50', 
    label: 'Pending',
    icon: <Clock size={14} className="text-yellow-600" /> 
  },
  cancelled: { 
    color: 'text-red-700', 
    bg: 'bg-red-50', 
    label: 'Cancelled',
    icon: <XCircle size={14} className="text-red-600" /> 
  },
};

const BookingCard = ({ booking }) => {
  const status = booking.status?.toLowerCase() || 'pending';
  const config = statusConfig[status] || { 
    color: 'text-gray-700', 
    bg: 'bg-gray-50', 
    label: status,
    icon: <Info size={14} className="text-gray-600" /> 
  };

  const bookingDate = booking.date ? new Date(booking.date) : null;
  const isUpcoming = bookingDate && bookingDate > new Date();
  
  // Calculate days until
  const daysUntil = bookingDate 
    ? Math.ceil((bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="flex flex-col p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.placeName || booking.place || 'Farm Consultation'}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {booking.place || 'Kerala, India'}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {bookingDate && (
          <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {bookingDate.toLocaleDateString('en-IN', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            {daysUntil !== null && daysUntil > 0 && (
              <span className="text-xs font-medium text-emerald-600">
                In {daysUntil} Days
              </span>
            )}
          </div>
        )}
        
        {booking.notes && (
          <div className="p-3 border border-gray-100 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Hash size={14} className="text-gray-400" />
          <span className="font-mono text-sm text-gray-500">
            {booking._id?.slice(-8).toUpperCase() || 'REF-9283'}
          </span>
        </div>
        
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-md hover:bg-gray-50">
          <Phone size={14} /> Call
        </button>
      </div>
    </div>
  );
};

export default BookingCard;