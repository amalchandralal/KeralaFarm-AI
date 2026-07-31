import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard, 
  Mic, Scan, BarChart3, WifiOff, MapPin, Calendar, Home,
  Sprout, Search, Bell, CloudRain, Bug, IndianRupee, Sun, 
  Landmark, CloudSun, Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { label: 'Home',      to: '/',          icon: Home },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Voice AI',  to: '/voice',     icon: Mic },
  { label: 'Scan Crop', to: '/scan',      icon: Scan },
  { label: 'Tracker',   to: '/tracker',   icon: BarChart3 },
  { label: 'Offline',   to: '/offline',   icon: WifiOff },
  { label: 'Places',    to: '/places',    icon: MapPin },
  { label: 'Bookings',  to: '/bookings',  icon: Calendar },
];

const NOTIFICATIONS = [
  { id: 1, icon: CloudRain, title: 'Heavy Rain Alert',      desc: 'Rainfall expected in your area tomorrow. Harvest ripe vegetables today.', time: '2 min ago',  unread: true },
  { id: 2, icon: Bug,       title: 'Stem Borer Warning',    desc: 'High humidity detected. Apply Chlorpyrifos 2.5ml/L on paddy crops.', time: '1 hr ago',   unread: true },
  { id: 3, icon: IndianRupee, title: 'Coconut Price Up',    desc: 'Coconut prices rose to ₹24/piece at Thrissur APMC today.', time: '3 hrs ago',  unread: true },
  { id: 4, icon: Sprout,    title: 'Fertilizer Reminder',   desc: 'Time for second dose fertilizer application on your paddy field.', time: '1 day ago',  unread: false },
  { id: 5, icon: Sun,       title: 'Good Spray Conditions', desc: 'Clear skies and calm wind today — ideal for pesticide spraying.', time: '1 day ago',  unread: false },
  { id: 6, icon: Landmark,  title: 'New Scheme Available',  desc: 'Solar pump subsidy applications open. Visit Krishi Bhavan for details.', time: '2 days ago', unread: false },
];

const SEARCH_ITEMS = [
  { label: 'Voice AI Assistant',   to: '/voice',     icon: Mic,       desc: 'Ask farming questions by voice' },
  { label: 'Crop Disease Scanner', to: '/scan',      icon: Scan,      desc: 'Detect diseases from crop photos' },
  { label: 'Weather Dashboard',    to: '/dashboard', icon: CloudSun,  desc: 'Weather alerts and recommendations' },
  { label: 'Resource Tracker',     to: '/tracker',   icon: BarChart3, desc: 'Track costs, market prices, schemes' },
  { label: 'Offline Guides',       to: '/offline',   icon: Download,  desc: 'Download farming guides' },
  { label: 'Places & Centers',     to: '/places',    icon: MapPin,    desc: 'Find Krishi Bhavans near you' },
  { label: 'My Bookings',          to: '/bookings',  icon: Calendar,  desc: 'View and manage bookings' },
  { label: 'Market Prices',        to: '/tracker',   icon: IndianRupee, desc: 'Coconut, paddy, banana prices' },
  { label: 'Fertilizer Guidance',  to: '/voice',     icon: Sprout,    desc: 'Ask AI for fertilizer advice' },
  { label: 'Pest Management',      to: '/offline',   icon: Bug,       desc: 'Download pest control guides' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchInput = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen, searchOpen]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markOneRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const unreadCount = notifications.filter(n => n.unread).length;

  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_ITEMS.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 w-full h-16 transition-all duration-200 ease-out-expo border-b ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-lg border-gray-200/80 shadow-sm' 
            : 'bg-white border-gray-200/80'
        }`}
      >
        <div className="flex items-center justify-between h-full px-6 mx-auto w-full sm:px-8 lg:px-12">
          
          {/* LEFT: Logo & Links */}
          <div className="flex items-center h-full gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 text-white transition-transform duration-200 rounded-lg shadow-sm bg-emerald-600 group-hover:scale-105">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                AgroVision
              </span>
            </Link>

            <div className="items-center hidden h-full gap-8 xl:flex">
              {navLinks.map(link => {
                const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
                return (
                  <Link 
                    key={link.to} 
                    to={link.to}
                    className={`relative h-full flex items-center text-base font-medium transition-colors duration-200 ${
                      isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="items-center hidden gap-4 lg:flex">
            
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-base text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 font-mono text-[11px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
                <span className="text-sm">⌘</span>K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(v => !v); setDropdownOpen(false); }}
                className="relative p-2 text-gray-500 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 z-50 mt-2 overflow-hidden origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg w-80"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-900">Notifications</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-medium transition-colors text-emerald-600 hover:text-emerald-700">
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-[28rem]">
                      {notifications.map(n => {
                        const Icon = n.icon;
                        return (
                          <div key={n.id} onClick={() => markOneRead(n.id)}
                            className={`flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                              n.unread ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <div className={`p-1.5 rounded-md ${n.unread ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${n.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.desc}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                            {n.unread && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-600 mt-1.5" />}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); }}
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-full">
                    {initials}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 z-50 w-56 mt-2 overflow-hidden origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { label: 'Profile',   to: '/profile',  icon: User },
                          { label: 'Bookings',  to: '/bookings', icon: Calendar },
                          { label: 'Tracker',   to: '/tracker',  icon: BarChart3 },
                        ].map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900 hover:bg-gray-50"
                          >
                            <item.icon className="w-4 h-4 text-gray-400" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="py-1 border-t border-gray-200">
                        <button onClick={handleLogout}
                          className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900 hover:bg-gray-50"
                        >
                          <LogOut className="w-4 h-4 text-gray-400" />
                          Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link to="/login" className="text-base font-medium text-gray-500 transition-colors hover:text-gray-900">
                  Log in
                </Link>
                <Link to="/register" className="text-base font-medium bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 transition-colors hover:text-gray-900"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setMenuOpen(true); setNotifOpen(false); }}
              className="text-gray-500 transition-colors hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Search Command Palette Modal ── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-gray-900/20 backdrop-blur-sm"
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            />
            <div className="fixed inset-0 z-[101] overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full max-w-xl overflow-hidden bg-white border border-gray-200 shadow-2xl pointer-events-auto rounded-xl"
              >
                <div className="flex items-center px-4 border-b border-gray-200">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInput}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search AgroVision..."
                    className="w-full px-4 py-4 text-base text-gray-900 placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0"
                  />
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 font-mono text-[10px] font-medium text-gray-500 bg-gray-100 rounded border border-gray-200">
                    ESC
                  </kbd>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {searchQuery.trim().length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">Try searching for crops, weather, or features</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={`${item.to}-${idx}`}
                            to={item.to}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center justify-center w-8 h-8 text-gray-400 bg-white border border-gray-200 rounded-md shadow-sm group-hover:text-gray-600">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                              <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                            </div>
                            <span className="text-gray-300 group-hover:text-gray-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium text-gray-900">No results found</p>
                      <p className="mt-1 text-sm text-gray-500">We couldn't find anything matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-gray-900/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[101] w-4/5 max-w-sm bg-white shadow-xl flex flex-col lg:hidden border-l border-gray-200"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="flex items-center gap-2 text-base font-semibold tracking-tight text-gray-900">
                   <Sprout className="w-5 h-5 text-emerald-600" />
                   AgroVision
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-gray-500 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navLinks.map(link => {
                  const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50">
                      Log in
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md shadow-sm hover:bg-gray-800">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;