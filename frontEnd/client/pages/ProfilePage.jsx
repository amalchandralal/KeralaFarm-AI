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
  Clock,
  Mic
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
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-2 rounded-full border-gray-200 dark:border-slate-800 border-t-emerald-600 dark:border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-200">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-500">
          <UserIcon size={32} />
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Profile Locked</h2>
          <p className="max-w-xs mx-auto mb-6 text-sm text-gray-500 dark:text-slate-400">
            Please login to your account to view and manage your profile details.
          </p>
          <Link to="/login" className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors">
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
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <div className="max-w-3xl px-4 mx-auto sm:px-6">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 mb-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-2xl font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 rounded-full">
            {initial}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">{name}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{email}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-4 text-xs font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded-full">
              <Shield size={12} className="text-gray-500 dark:text-slate-400" />
              {role}
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-xl mb-6"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
            <h2 className="text-sm font-medium text-gray-900 dark:text-slate-100">Account Information</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-center p-6 sm:px-8">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-400 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <item.icon size={16} />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-0.5 text-sm text-gray-900 dark:text-slate-100">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          <Link 
            to="/bookings"
            className="flex items-center justify-between p-5 transition-colors bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-xl hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-500 dark:text-slate-400">
                <Calendar size={20} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">My Bookings</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 dark:text-slate-500" />
          </Link>

          <Link 
            to="/voice"
            className="flex items-center justify-between p-5 transition-colors bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-xl hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-500 dark:text-slate-400">
                <Mic size={20} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">Voice AI</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 dark:text-slate-500" />
          </Link>
        </div>

        {/* Logout Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-colors bg-red-50 dark:bg-red-950/40 border border-transparent dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60"
          >
            <LogOut size={16} />
            Logout from Account
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;
