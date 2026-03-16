// import React, { useEffect, useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'
// import api from '../lib/axios'

// const ProfilePage = () => {
//   const { user, logout, loading, setUser } = useAuth()
//   const navigate = useNavigate()
//   const [rawData, setRawData] = useState<Record<string, unknown> | null>(null)

//   useEffect(() => {
//     api.get('/profile')
//       .then(res => {
//         setRawData(res.data)
//         const d = res.data
//         const extracted = d?.user || d?.data || d?.profile || (d?.name || d?.email ? d : null) || d
//         setUser(extracted)
//       })
//       .catch(() => {})
//   }, [])

//   const handleLogout = async () => {
//     await logout()
//     navigate('/')
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <div className="w-10 h-10 border-4 rounded-full border-forest-500 border-t-transparent animate-spin" />
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <p className="text-lg text-gray-500">Please login to view your profile</p>
//         <Link to="/login" className="btn-primary">Login</Link>
//       </div>
//     )
//   }

//   const name     = String(user.name     || user.username || user.fullName || '')
//   const email    = String(user.email    || '')
//   const role     = String(user.role     || user.userType || '')
//   const initial  = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?'

//   return (
//     <div className="page-container">
//       <div className="max-w-lg mx-auto space-y-5">

//         {/* Avatar */}
//         <div className="py-8 text-center card">
//           <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 text-4xl font-bold text-white rounded-full shadow-lg bg-forest-600">
//             {initial}
//           </div>
//           {name  && <h1 className="text-2xl font-bold text-forest-800">{name}</h1>}
//           {email && <p className="mt-1 text-gray-500">{email}</p>}
//           {role  && <span className="mt-3 capitalize badge bg-forest-100 text-forest-700">{role}</span>}
//         </div>

//         {/* Account Details */}
//         <div className="card">
//           <h2 className="mb-3 text-sm font-bold tracking-wide uppercase text-forest-700">Account Details</h2>
//           <div className="space-y-0">
//             {[
//               { label: 'Name',     value: name  },
//               { label: 'Email',    value: email },
//               { label: 'Role',     value: role  },
//               { label: 'Phone',    value: String(user.phone    || user.mobile  || '') },
//               { label: 'Location', value: String(user.location || user.address || user.district || '') },
//               { label: 'Joined',   value: user.createdAt || user.created_at
//                   ? new Date(String(user.createdAt || user.created_at)).toLocaleDateString('en-IN', { dateStyle: 'medium' })
//                   : '' },
//             ]
//               .filter(row => row.value)
//               .map((row, i, arr) => (
//                 <div key={row.label}
//                   className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
//                   <span className="text-sm text-gray-500">{row.label}</span>
//                   <span className="font-medium text-gray-800 max-w-[200px] text-right break-words">{row.value}</span>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Quick links */}
//         <div className="grid grid-cols-2 gap-3">
//           <Link to="/bookings"
//             className="p-4 text-center transition-all cursor-pointer card hover:shadow-lg hover:-translate-y-1">
//             <p className="text-sm font-semibold text-forest-700">My Bookings</p>
//           </Link>
//           <Link to="/voice"
//             className="p-4 text-center transition-all cursor-pointer card hover:shadow-lg hover:-translate-y-1">
//             <p className="text-sm font-semibold text-forest-700">Voice AI</p>
//           </Link>
//         </div>

//         {/* Logout */}
//         <button onClick={handleLogout}
//           className="flex items-center justify-center w-full gap-2 text-lg btn-secondary">
//           Logout
//         </button>

//         {/* Debug panel — remove after confirming it works */}
//         {rawData && (
//           <details className="text-xs text-gray-400">
//             <summary className="p-2 cursor-pointer select-none">Debug: raw /profile response</summary>
//             <pre className="p-3 mt-2 overflow-auto text-xs border rounded-lg bg-gray-50">
//               {JSON.stringify(rawData, null, 2)}
//             </pre>
//           </details>
//         )}

//       </div>
//     </div>
//   )
// }

// export default ProfilePage
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  LogOut, 
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 rounded-full border-emerald-100 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300">
          <UserIcon size={40} />
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-black text-slate-900">Profile Locked</h2>
          <p className="max-w-xs mx-auto mb-8 font-medium text-slate-500">
            Please login to your account to view and manage your profile details.
          </p>
          <Link to="/login" className="px-10 btn-primary">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  const name = String(user.name || user.username || user.fullName || 'Farmer');
  const email = String(user.email || '');
  const role = String(user.role || user.userType || 'Member');
  const initial = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?';

  const details = [
    { label: 'Full Name', value: name, icon: UserIcon },
    { label: 'Email Address', value: email, icon: Mail },
    { label: 'Phone Number', value: String(user.phone || user.mobile || 'Not provided'), icon: Phone },
    { label: 'Location', value: String(user.location || user.address || user.district || 'Kerala, India'), icon: MapPin },
    { 
      label: 'Member Since', 
      value: user.createdAt || user.created_at
        ? new Date(String(user.createdAt || user.created_at)).toLocaleDateString('en-IN', { dateStyle: 'medium' })
        : 'Recently Joined', 
      icon: Clock 
    },
  ];

  return (
    <div className="min-h-screen pt-12 pb-20 bg-stone-50">
      <div className="max-w-2xl px-4 mx-auto sm:px-6">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm mb-6 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-50 bg-emerald-50" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-emerald-200 mb-6 ring-4 ring-white">
              {initial}
            </div>
            <h1 className="mb-1 text-3xl font-black tracking-tight text-slate-900">{name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <Shield size={10} />
                {role}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="text-xs font-bold text-slate-400">{email}</span>
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-6"
        >
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Account Information</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-xl text-slate-400">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          <Link 
            to="/bookings"
            className="flex items-center justify-between p-6 transition-all bg-white border shadow-sm group rounded-2xl border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 transition-transform bg-emerald-100 rounded-xl text-emerald-600 group-hover:scale-110">
                <Calendar size={20} />
              </div>
              <span className="font-black text-slate-700">My Bookings</span>
            </div>
            <ChevronRight size={18} className="transition-all text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1" />
          </Link>

          <Link 
            to="/voice"
            className="flex items-center justify-between p-6 transition-all bg-white border shadow-sm group rounded-2xl border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 transition-transform bg-emerald-100 rounded-xl text-emerald-600 group-hover:scale-110">
                <Shield size={20} />
              </div>
              <span className="font-black text-slate-700">Voice AI</span>
            </div>
            <ChevronRight size={18} className="transition-all text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Logout Button */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-3 py-5 font-black text-red-500 transition-all border border-red-100 rounded-2xl bg-red-50 hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout from Account
        </motion.button>

      </div>
    </div>
  );
};

export default ProfilePage;
