import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard, 
  Mic, Scan, BarChart3, WifiOff, MapPin, Calendar, Home,
  Sprout, Search, Bell, CloudRain, Bug, IndianRupee, Sun, Moon,
  Landmark, CloudSun, Download, AlertTriangle, Leaf, Droplets, Info, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation as useUserLocation } from '../hooks/useLocation';
import { getNotifications } from '../services/api';

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

const NotifIconMap = {
  'cloud-rain': CloudRain,
  'bug': Bug,
  'sun': Sun,
  'sprout': Sprout,
  'landmark': Landmark,
  'alert-triangle': AlertTriangle,
  'leaf': Leaf,
  'droplets': Droplets,
  'info': Info,
  'check-circle': CheckCircle2,
};

const renderNotifIcon = (iconName) => {
  if (typeof iconName === 'function') {
    const IconComp = iconName;
    return <IconComp className="w-4 h-4" />;
  }
  const IconComp = NotifIconMap[iconName] || Bell;
  return <IconComp className="w-4 h-4" />;
};

const NOTIFICATIONS = [
  { id: 1, icon: 'cloud-rain', title: 'Heavy Rain Alert',      desc: 'Rainfall expected in your area tomorrow. Harvest ripe vegetables today.', time: '2 min ago',  unread: true },
  { id: 2, icon: 'bug',       title: 'Stem Borer Warning',    desc: 'High humidity detected. Apply Chlorpyrifos 2.5ml/L on paddy crops.', time: '1 hr ago',   unread: true },
  { id: 3, icon: 'sprout',    title: 'Fertilizer Reminder',   desc: 'Time for second dose fertilizer application on your paddy field.', time: '1 day ago',  unread: false },
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

const routeToFeatureId = {
  '/dashboard': 'feature-dashboard',
  '/voice': 'feature-voice',
  '/scan': 'feature-scan',
  '/tracker': 'feature-tracker',
  '/offline': 'feature-offline',
  '/places': 'feature-places',
  '/bookings': 'feature-bookings',
};

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { location } = useUserLocation();

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
    if (!user) return;
    let isMounted = true;
    const fetchLiveNotifications = async () => {
      try {
        const data = await getNotifications(location?.lat, location?.lon);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to load real-time notifications:", err);
      }
    };
    fetchLiveNotifications();
    return () => { isMounted = false; };
  }, [location, user]);

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

  const handleProtectedNav = (e, targetPath) => {
    if (!user && targetPath !== '/') {
      e.preventDefault();
      setMenuOpen(false);
      setSearchOpen(false);
      const featureId = routeToFeatureId[targetPath] || 'features';
      navigate(`/#${featureId}`);
      setTimeout(() => {
        const el = document.getElementById(featureId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markOneRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const clearRead = () => setNotifications(prev => prev.filter(n => n.unread));

  const unreadCount = notifications.filter(n => n.unread).length;
  const hasRead = notifications.some(n => !n.unread);

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
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-gray-200/80 dark:border-slate-800 shadow-sm' 
            : 'bg-white dark:bg-slate-900 border-gray-200/80 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between h-full px-6 mx-auto w-full sm:px-8 lg:px-12">
          
          {/* LEFT: Logo & Links */}
          <div className="flex items-center h-full gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 text-white transition-transform duration-200 rounded-lg shadow-sm bg-emerald-600 dark:bg-emerald-500 group-hover:scale-105">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
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
                    onClick={(e) => handleProtectedNav(e, link.to)}
                    className={`relative h-full flex items-center text-base font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="items-center hidden gap-3 lg:flex">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 text-gray-500 transition-colors rounded-lg dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-base text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 font-mono text-[11px] font-medium text-gray-400 dark:text-slate-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded">
                <span className="text-sm">⌘</span>K
              </kbd>
            </button>

            {/* Auth State Handling: Neutral skeleton when loading to prevent flickering */}
            {authLoading ? (
              <div className="flex items-center gap-4 ml-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse" />
              </div>
            ) : user ? (
              <>
                {/* Notifications Bell - Rendered ONLY when user is logged in */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(v => !v); setDropdownOpen(false); }}
                    className="relative p-2 text-gray-500 transition-colors rounded-lg dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 z-50 mt-2 overflow-hidden origin-top-right bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg w-80"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Notifications</p>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <button onClick={markAllRead} className="text-xs font-medium transition-colors text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
                                Mark read
                              </button>
                            )}
                            {hasRead && (
                              <button onClick={clearRead} className="text-xs font-medium transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
                                Clear read
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-[28rem]">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                              No notifications
                            </div>
                          ) : (
                            notifications.map(n => {
                              return (
                                <div key={n.id} onClick={() => markOneRead(n.id)}
                                  className={`flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-slate-800/60 last:border-0 transition-colors ${
                                    n.unread 
                                      ? 'bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30' 
                                      : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                                  }`}
                                >
                                  <div className="flex-shrink-0 mt-0.5">
                                    <div className={`p-1.5 rounded-md ${
                                      n.unread 
                                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                                    }`}>
                                      {renderNotifIcon(n.icon)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${n.unread ? 'font-medium text-gray-900 dark:text-slate-100' : 'text-gray-600 dark:text-slate-400'}`}>{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.desc}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{n.time}</p>
                                  </div>
                                  {n.unread && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5" />}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); }}
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  >
                    <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full">
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
                        className="absolute right-0 z-50 w-56 mt-2 overflow-hidden origin-top-right bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800">
                          <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {[
                            { label: 'Profile',   to: '/profile',  icon: User },
                            { label: 'Bookings',  to: '/bookings', icon: Calendar },
                            { label: 'Tracker',   to: '/tracker',  icon: BarChart3 },
                          ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-slate-300 transition-colors hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                            >
                              <item.icon className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="py-1 border-t border-gray-200 dark:border-slate-800">
                          <button onClick={handleLogout}
                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-600 dark:text-slate-300 transition-colors hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                          >
                            <LogOut className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                            Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-base font-medium text-gray-500 dark:text-slate-400 transition-colors hover:text-gray-900 dark:hover:text-slate-100">
                  Log in
                </Link>
                <Link to="/register" className="text-base font-medium bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-1.5 text-gray-500 transition-colors dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 transition-colors dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setMenuOpen(true); setNotifOpen(false); }}
              className="text-gray-500 transition-colors dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
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
              className="fixed inset-0 z-[100] bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            />
            <div className="fixed inset-0 z-[101] overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full max-w-xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl pointer-events-auto rounded-xl"
              >
                <div className="flex items-center px-4 border-b border-gray-200 dark:border-slate-800">
                  <Search className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <input
                    ref={searchInput}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search AgroVision..."
                    className="w-full px-4 py-4 text-base text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
                  />
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 font-mono text-[10px] font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                    ESC
                  </kbd>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {searchQuery.trim().length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500 dark:text-slate-400">Try searching for crops, weather, or features</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={`${item.to}-${idx}`}
                            to={item.to}
                            onClick={(e) => {
                              setSearchOpen(false);
                              setSearchQuery('');
                              handleProtectedNav(e, item.to);
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                          >
                            <div className="flex items-center justify-center w-8 h-8 text-gray-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm group-hover:text-gray-600 dark:group-hover:text-slate-200">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{item.label}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{item.desc}</p>
                            </div>
                            <span className="text-gray-300 dark:text-slate-600 group-hover:text-gray-400 dark:group-hover:text-slate-400">
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
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">No results found</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">We couldn't find anything matching "{searchQuery}"</p>
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
              className="fixed inset-0 z-[100] bg-gray-900/30 dark:bg-slate-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[101] w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-xl flex flex-col lg:hidden border-l border-gray-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800">
                <span className="flex items-center gap-2 text-base font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                   <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                   AgroVision
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-gray-500 dark:text-slate-400 transition-colors rounded-md hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
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
                      onClick={(e) => {
                        setMenuOpen(false);
                        handleProtectedNav(e, link.to);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                          : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                {authLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-sm">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700">
                      Log in
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-emerald-600 dark:bg-emerald-500 rounded-md shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600">
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