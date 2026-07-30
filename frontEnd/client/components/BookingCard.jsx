import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Info, 
  Hash, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight,
  Leaf,
  Phone,
  ArrowUpRight
} from 'lucide-react';

const statusConfig = {
  confirmed: { 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50', 
    label: 'Confirmed',
    icon: <CheckCircle2 size={14} className="text-emerald-600" /> 
  },
  pending: { 
    color: 'text-amber-700', 
    bg: 'bg-amber-50', 
    label: 'Awaiting Action',
    icon: <Clock size={14} className="text-amber-600" /> 
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
    color: 'text-slate-700', 
    bg: 'bg-slate-50', 
    label: status,
    icon: <Info size={14} className="text-slate-600" /> 
  };

  const bookingDate = booking.date ? new Date(booking.date) : null;
  const isUpcoming = bookingDate && bookingDate > new Date();
  
  // Calculate days until
  const daysUntil = bookingDate 
    ? Math.ceil((bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
    >
      {/* Organic Background Pattern */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
        <Leaf size={120} className="translate-x-8 -translate-y-8 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <div className="scale-125">{config.icon}</div>
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight transition-colors text-slate-900 group-hover:text-emerald-600">
                {booking.placeName || booking.place || 'Farm Consultation'}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  {booking.place || 'Kerala, India'}
                </span>
              </div>
            </div>
          </div>
          
          {isUpcoming && status === 'confirmed' && (
            <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 animate-bounce">
              Upcoming
            </div>
          )}
        </div>

        {/* Status Pill */}
        <div className="mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.color} border border-current/10`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {config.label}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-grow mb-8 space-y-4">
          {bookingDate && (
            <div className="flex items-center justify-between p-4 transition-all duration-500 border bg-slate-50/80 backdrop-blur-sm rounded-2xl border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white shadow-sm rounded-xl">
                  <Calendar size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled Date</p>
                  <p className="text-sm font-bold text-slate-700">
                    {bookingDate.toLocaleDateString('en-IN', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {daysUntil !== null && daysUntil > 0 && (
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">In {daysUntil} Days</p>
                </div>
              )}
            </div>
          )}
          
          {booking.notes && (
            <div className="relative pl-4 transition-colors border-l-2 border-slate-100 group-hover:border-emerald-200">
              <p className="text-sm italic font-medium leading-relaxed text-slate-500">
                "{booking.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center w-10 h-10 transition-all rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 group/btn">
              <Phone size={18} className="transition-transform group-hover/btn:scale-110" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Hash size={10} className="text-slate-300" />
                <span className="font-mono text-[9px] font-bold text-slate-400 tracking-tighter">
                  {booking._id?.slice(-8).toUpperCase() || 'REF-9283'}
                </span>
              </div>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:-translate-y-1 transition-all shadow-lg shadow-slate-200 hover:shadow-emerald-200">
            View Details <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute w-24 h-24 transition-all duration-700 rounded-full -bottom-4 -right-4 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10" />
    </motion.div>
  );
};

export default BookingCard;