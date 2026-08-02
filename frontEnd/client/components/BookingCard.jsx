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
    color: 'text-emerald-700 dark:text-emerald-300', 
    bg: 'bg-emerald-50 dark:bg-emerald-950/50', 
    label: 'Confirmed',
    icon: <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> 
  },
  pending: { 
    color: 'text-amber-700 dark:text-amber-300', 
    bg: 'bg-amber-50 dark:bg-amber-950/50', 
    label: 'Pending',
    icon: <Clock size={14} className="text-amber-600 dark:text-amber-400" /> 
  },
  cancelled: { 
    color: 'text-rose-700 dark:text-rose-300', 
    bg: 'bg-rose-50 dark:bg-rose-950/50', 
    label: 'Cancelled',
    icon: <XCircle size={14} className="text-rose-600 dark:text-rose-400" /> 
  },
};

const BookingCard = ({ booking }) => {
  const status = booking.status?.toLowerCase() || 'pending';
  const config = statusConfig[status] || { 
    color: 'text-slate-700 dark:text-slate-300', 
    bg: 'bg-slate-50 dark:bg-slate-800', 
    label: status,
    icon: <Info size={14} className="text-slate-600 dark:text-slate-400" /> 
  };

  const bookingDate = booking.date ? new Date(booking.date) : null;
  
  // Calculate days until
  const daysUntil = bookingDate 
    ? Math.ceil((bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {booking.placeName || booking.place || 'Farm Consultation'}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
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
          <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {bookingDate.toLocaleDateString('en-IN', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            {daysUntil !== null && daysUntil > 0 && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                In {daysUntil} Days
              </span>
            )}
          </div>
        )}
        
        {booking.notes && (
          <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-800/40">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Hash size={14} className="text-slate-400 dark:text-slate-500" />
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
            {booking._id?.slice(-8).toUpperCase() || 'REF-9283'}
          </span>
        </div>
        
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <Phone size={14} /> Call
        </button>
      </div>
    </div>
  );
};

export default BookingCard;