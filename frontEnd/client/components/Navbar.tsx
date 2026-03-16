// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
//   Mic, Scan, BarChart3, WifiOff, MapPin, Calendar,
//   Home, Sprout, Search, Bell
// } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// const navLinks = [
//   { label: 'Home',      to: '/',          icon: Home },
//   { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
//   { label: 'Voice AI',  to: '/voice',     icon: Mic },
//   { label: 'Scan Crop', to: '/scan',      icon: Scan },
//   { label: 'Tracker',   to: '/tracker',   icon: BarChart3 },
//   { label: 'Offline',   to: '/offline',   icon: WifiOff },
//   { label: 'Places',    to: '/places',    icon: MapPin },
//   { label: 'Bookings',  to: '/bookings',  icon: Calendar },
// ];

// // ── Static notifications data ─────────────────────────────────────────────────
// const NOTIFICATIONS = [
//   { id: 1, icon: '🌧️', title: 'Heavy Rain Alert',       desc: 'Rainfall expected in your area tomorrow. Harvest ripe vegetables today.', time: '2 min ago',  unread: true },
//   { id: 2, icon: '🦟', title: 'Stem Borer Warning',     desc: 'High humidity detected. Apply Chlorpyrifos 2.5ml/L on paddy crops.', time: '1 hr ago',   unread: true },
//   { id: 3, icon: '💰', title: 'Coconut Price Up',       desc: 'Coconut prices rose to ₹24/piece at Thrissur APMC today.', time: '3 hrs ago',  unread: true },
//   { id: 4, icon: '🌱', title: 'Fertilizer Reminder',    desc: 'Time for second dose fertilizer application on your paddy field.', time: '1 day ago',  unread: false },
//   { id: 5, icon: '☀️', title: 'Good Spray Conditions',  desc: 'Clear skies and calm wind today — ideal for pesticide spraying.', time: '1 day ago',  unread: false },
//   { id: 6, icon: '🏛️', title: 'New Scheme Available',   desc: 'Solar pump subsidy applications open. Visit Krishi Bhavan for details.', time: '2 days ago', unread: false },
// ];

// // ── Searchable pages/features ─────────────────────────────────────────────────
// const SEARCH_ITEMS = [
//   { label: 'Voice AI Assistant',    to: '/voice',     icon: '🎤', desc: 'Ask farming questions in Malayalam' },
//   { label: 'Crop Disease Scanner',  to: '/scan',      icon: '📷', desc: 'Detect diseases from crop photos' },
//   { label: 'Weather Dashboard',     to: '/dashboard', icon: '🌤️', desc: 'Weather alerts and recommendations' },
//   { label: 'Resource Tracker',      to: '/tracker',   icon: '📊', desc: 'Track costs, market prices, schemes' },
//   { label: 'Offline Guides',        to: '/offline',   icon: '📥', desc: 'Download farming guides' },
//   { label: 'Places & Centers',      to: '/places',    icon: '📍', desc: 'Find Krishi Bhavans near you' },
//   { label: 'My Bookings',           to: '/bookings',  icon: '📅', desc: 'View and manage bookings' },
//   { label: 'Market Prices',         to: '/tracker',   icon: '💰', desc: 'Coconut, paddy, banana prices' },
//   { label: 'Fertilizer Guidance',   to: '/voice',     icon: '🌱', desc: 'Ask AI for fertilizer advice' },
//   { label: 'Pest Management',       to: '/offline',   icon: '🐛', desc: 'Download pest control guides' },
// ];

// const Navbar = () => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [menuOpen,       setMenuOpen]       = useState(false);
//   const [dropdownOpen,   setDropdownOpen]   = useState(false);
//   const [searchOpen,     setSearchOpen]     = useState(false);
//   const [searchQuery,    setSearchQuery]    = useState('');
//   const [notifOpen,      setNotifOpen]      = useState(false);
//   const [notifications,  setNotifications]  = useState(NOTIFICATIONS);

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchRef   = useRef<HTMLDivElement>(null);
//   const notifRef    = useRef<HTMLDivElement>(null);
//   const searchInput = useRef<HTMLInputElement>(null);

//   // Close panels on outside click
//   useEffect(() => {
//     const handle = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
//       if (searchRef.current   && !searchRef.current.contains(e.target as Node))   { setSearchOpen(false); setSearchQuery(''); }
//       if (notifRef.current    && !notifRef.current.contains(e.target as Node))    setNotifOpen(false);
//     };
//     document.addEventListener('mousedown', handle);
//     return () => document.removeEventListener('mousedown', handle);
//   }, []);

//   // Focus input when search opens
//   useEffect(() => {
//     if (searchOpen) setTimeout(() => searchInput.current?.focus(), 50);
//   }, [searchOpen]);

//   // Close mobile menu on route change
//   useEffect(() => { setMenuOpen(false); }, [pathname]);

//   const handleLogout = async () => {
//     await logout();
//     setDropdownOpen(false);
//     setMenuOpen(false);
//     navigate('/');
//   };

//   const markAllRead = () =>
//     setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

//   const markOneRead = (id: number) =>
//     setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

//   const unreadCount = notifications.filter(n => n.unread).length;

//   const searchResults = searchQuery.trim().length > 0
//     ? SEARCH_ITEMS.filter(item =>
//         item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.desc.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : [];

//   const initials = user?.name
//     ? (user.name as string).split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
//     : '?';

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
//       <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">

//           {/* ── Logo ── */}
//           <Link to="/" className="flex items-center gap-2.5 group">
//             <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 transition-all duration-300 group-hover:rotate-6">
//               <Sprout className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xl font-black leading-none tracking-tight text-slate-900">
//                 KeralaFarm <span className="text-emerald-600">AI</span>
//               </span>
//               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Smart Farming</span>
//             </div>
//           </Link>

//           {/* ── Desktop nav links ── */}
//           <div className="items-center hidden gap-1 xl:flex">
//             {navLinks.map(link => {
//               const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
//               const Icon = link.icon;
//               return (
//                 <Link key={link.to} to={link.to}
//                   className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 group/link ${
//                     isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
//                   }`}
//                 >
//                   <Icon size={16} className={`${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover/link:text-emerald-500'} transition-colors`} />
//                   {link.label}
//                   {isActive && (
//                     <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-600 rounded-full" />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* ── Desktop Actions ── */}
//           <div className="items-center hidden gap-2 lg:flex">

//             {/* Search */}
//             <div className="relative" ref={searchRef}>
//               <div className={`flex items-center gap-2 transition-all duration-300 ${
//                 searchOpen ? 'bg-slate-100 rounded-xl px-3 py-2' : ''
//               }`}>
//                 {searchOpen && (
//                   <input
//                     ref={searchInput}
//                     type="text"
//                     value={searchQuery}
//                     onChange={e => setSearchQuery(e.target.value)}
//                     onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
//                     placeholder="Search crops, pests, markets..."
//                     className="w-56 text-sm font-medium bg-transparent outline-none text-slate-700 placeholder-slate-400"
//                   />
//                 )}
//                 <button
//                   onClick={() => { setSearchOpen(v => !v); setSearchQuery(''); setNotifOpen(false); setDropdownOpen(false); }}
//                   className="p-2 transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
//                 >
//                   {searchOpen ? <X size={18} /> : <Search size={20} />}
//                 </button>
//               </div>

//               {/* Search results dropdown */}
//               {searchOpen && searchQuery.trim().length > 0 && (
//                 <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-14 w-80 border-slate-100 rounded-2xl">
//                   {searchResults.length > 0 ? (
//                     <div className="p-2">
//                       <p className="px-3 py-2 text-xs font-bold tracking-wider uppercase text-slate-400">
//                         {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
//                       </p>
//                       {searchResults.map(item => (
//                         <Link key={item.to + item.label} to={item.to}
//                           onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
//                           className="flex items-center gap-3 px-3 py-3 transition-colors rounded-xl hover:bg-emerald-50 group"
//                         >
//                           <span className="flex items-center justify-center text-2xl w-9 h-9 bg-slate-50 rounded-xl group-hover:bg-emerald-100">{item.icon}</span>
//                           <div>
//                             <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">{item.label}</p>
//                             <p className="text-xs text-slate-400">{item.desc}</p>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="px-4 py-8 text-center">
//                       <p className="mb-2 text-2xl">🔍</p>
//                       <p className="text-sm font-bold text-slate-500">No results for "{searchQuery}"</p>
//                       <p className="mt-1 text-xs text-slate-400">Try: crops, weather, prices</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Notifications */}
//             <div className="relative" ref={notifRef}>
//               <button
//                 onClick={() => { setNotifOpen(v => !v); setSearchOpen(false); setDropdownOpen(false); }}
//                 className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
//               >
//                 <Bell size={20} />
//                 {unreadCount > 0 && (
//                   <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
//                     {unreadCount > 9 ? '9+' : unreadCount}
//                   </span>
//                 )}
//               </button>

//               {notifOpen && (
//                 <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-14 w-96 border-slate-100 rounded-2xl">
//                   {/* Header */}
//                   <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
//                     <div>
//                       <p className="font-black text-slate-900">Notifications</p>
//                       <p className="text-xs text-slate-400 font-medium mt-0.5">{unreadCount} unread alerts</p>
//                     </div>
//                     {unreadCount > 0 && (
//                       <button onClick={markAllRead}
//                         className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
//                         Mark all read
//                       </button>
//                     )}
//                   </div>

//                   {/* List */}
//                   <div className="overflow-y-auto max-h-96">
//                     {notifications.map(n => (
//                       <div key={n.id}
//                         onClick={() => markOneRead(n.id)}
//                         className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${
//                           n.unread ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
//                         }`}
//                       >
//                         <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-2xl bg-white border shadow-sm rounded-xl border-slate-100">
//                           {n.icon}
//                         </span>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-0.5">
//                             <p className={`text-sm font-bold truncate ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
//                             {n.unread && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500" />}
//                           </div>
//                           <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">{n.desc}</p>
//                           <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{n.time}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Footer */}
//                   <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
//                     <p className="text-xs font-medium text-center text-slate-400">
//                       Alerts based on your location & crops
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="w-px h-8 mx-1 bg-slate-200" />

//             {/* User dropdown */}
//             {user ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); setSearchOpen(false); }}
//                   className="flex items-center gap-3 p-1.5 pr-3 transition-all rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50"
//                 >
//                   <div className="flex items-center justify-center text-sm font-black text-white shadow-lg w-9 h-9 bg-emerald-600 rounded-xl shadow-emerald-200 ring-2 ring-white">
//                     {initials}
//                   </div>
//                   <div className="hidden text-left xl:block">
//                     <p className="mb-1 text-xs font-black leading-none text-slate-900">{user.name as string}</p>
//                     <div className="flex items-center gap-1">
//                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
//                       <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Active</p>
//                     </div>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 z-50 p-3 mt-3 overflow-hidden bg-white border shadow-2xl w-72 border-slate-100 rounded-3xl">
//                     {/* Profile header */}
//                     <div className="px-4 py-4 mb-2 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl">
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="flex items-center justify-center w-12 h-12 text-lg font-black text-white shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200">
//                           {initials}
//                         </div>
//                         <div>
//                           <p className="text-sm font-black text-slate-900">{user.name as string}</p>
//                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.email as string}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Menu items — Settings and Help Center removed */}
//                     <div className="space-y-1">
//                       {[
//                         { label: 'My Profile',       to: '/profile',   icon: User },
//                         { label: 'My Bookings',      to: '/bookings',  icon: Calendar },
//                         { label: 'Resource Tracker', to: '/tracker',   icon: BarChart3 },
//                       ].map(item => (
//                         <Link key={item.to} to={item.to}
//                           onClick={() => setDropdownOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl group/item"
//                         >
//                           <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-xl bg-slate-50 group-hover/item:bg-emerald-100">
//                             <item.icon size={16} className="text-slate-400 group-hover/item:text-emerald-600" />
//                           </div>
//                           {item.label}
//                         </Link>
//                       ))}
//                     </div>

//                     <div className="pt-3 mt-3 border-t border-slate-100">
//                       <button onClick={handleLogout}
//                         className="flex items-center w-full gap-3 px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 rounded-2xl">
//                         <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50">
//                           <LogOut size={16} />
//                         </div>
//                         Logout Account
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors px-4 py-2.5">
//                   Login
//                 </Link>
//                 <Link to="/register" className="text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 active:scale-95">
//                   Get Started
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* ── Mobile hamburger ── */}
//           <div className="flex items-center gap-2 lg:hidden">
//             <button className="relative p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl"
//               onClick={() => { setNotifOpen(v => !v); setMenuOpen(false); }}>
//               <Bell size={20} />
//               {unreadCount > 0 && (
//                 <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>
//             <button
//               className="p-2.5 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
//               onClick={() => { setMenuOpen(v => !v); setNotifOpen(false); }}
//             >
//               {menuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile notification panel ── */}
//       {notifOpen && (
//         <div className="overflow-y-auto bg-white border-t lg:hidden border-slate-100 max-h-96">
//           <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
//             <p className="text-sm font-black text-slate-900">Notifications</p>
//             {unreadCount > 0 && (
//               <button onClick={markAllRead} className="text-xs font-bold text-emerald-600">Mark all read</button>
//             )}
//           </div>
//           {notifications.map(n => (
//             <div key={n.id} onClick={() => markOneRead(n.id)}
//               className={`flex items-start gap-3 px-5 py-3 border-b border-slate-50 last:border-0 ${n.unread ? 'bg-emerald-50/50' : ''}`}>
//               <span className="flex-shrink-0 text-xl">{n.icon}</span>
//               <div>
//                 <p className={`text-sm font-bold ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
//                 <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
//                 <p className="text-[10px] text-slate-400 font-bold mt-1">{n.time}</p>
//               </div>
//               {n.unread && <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5" />}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── Mobile menu ── */}
//       {menuOpen && (
//         <div className="overflow-hidden bg-white border-t lg:hidden border-slate-100">
//           <div className="px-4 py-6 space-y-1.5">
//             {navLinks.map(link => {
//               const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
//               const Icon = link.icon;
//               return (
//                 <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
//                   className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
//                     isActive ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-slate-600 hover:bg-slate-50'
//                   }`}
//                 >
//                   <Icon size={20} />
//                   {link.label}
//                 </Link>
//               );
//             })}

//             {/* Mobile search */}
//             <div className="pt-2">
//               <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-2xl">
//                 <Search size={18} className="flex-shrink-0 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={e => setSearchQuery(e.target.value)}
//                   placeholder="Search crops, pests, markets..."
//                   className="flex-1 text-sm font-medium bg-transparent outline-none text-slate-700 placeholder-slate-400"
//                 />
//               </div>
//               {searchQuery.trim().length > 0 && (
//                 <div className="mt-2 space-y-1">
//                   {(SEARCH_ITEMS.filter(item =>
//                     item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     item.desc.toLowerCase().includes(searchQuery.toLowerCase())
//                   )).map(item => (
//                     <Link key={item.to + item.label} to={item.to}
//                       onClick={() => { setMenuOpen(false); setSearchQuery(''); }}
//                       className="flex items-center gap-3 px-4 py-3 transition-colors rounded-xl hover:bg-emerald-50"
//                     >
//                       <span className="text-xl">{item.icon}</span>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{item.label}</p>
//                         <p className="text-xs text-slate-400">{item.desc}</p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="pt-4 mt-2 border-t border-slate-100">
//               {user ? (
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-4 px-5 py-4 border bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl border-slate-100">
//                     <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-black text-white shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200 ring-4 ring-white">
//                       {initials}
//                     </div>
//                     <div>
//                       <p className="font-black text-slate-900">{user.name as string}</p>
//                       <p className="text-xs text-slate-500">{user.email as string}</p>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     {[
//                       { to: '/profile',  icon: User,      label: 'Profile' },
//                       { to: '/bookings', icon: Calendar,  label: 'Bookings' },
//                       { to: '/tracker',  icon: BarChart3, label: 'Tracker' },
//                     ].map(item => (
//                       <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
//                         className="flex flex-col items-center gap-2 p-3 font-bold transition-colors bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">
//                         <item.icon size={18} />
//                         <span className="text-xs">{item.label}</span>
//                       </Link>
//                     ))}
//                   </div>
//                   <button onClick={handleLogout}
//                     className="flex items-center justify-center w-full gap-3 px-5 py-4 font-black text-red-500 transition-colors bg-red-50 rounded-2xl hover:bg-red-100">
//                     <LogOut size={18} /> Logout Account
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-3">
//                   <Link to="/login" onClick={() => setMenuOpen(false)}
//                     className="flex items-center justify-center px-5 py-4 text-base font-bold text-slate-600 bg-slate-50 rounded-2xl">
//                     Login
//                   </Link>
//                   <Link to="/register" onClick={() => setMenuOpen(false)}
//                     className="flex items-center justify-center px-5 py-4 text-base font-black text-white shadow-xl bg-emerald-600 rounded-2xl shadow-emerald-200">
//                     Register
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Mic, 
  Scan, 
  BarChart3, 
  WifiOff, 
  MapPin, 
  Calendar,
  Home,
  Sprout,
  Search,
  Bell
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

// ── Static notifications data ─────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, icon: '🌧️', title: 'Heavy Rain Alert',       desc: 'Rainfall expected in your area tomorrow. Harvest ripe vegetables today.', time: '2 min ago',  unread: true },
  { id: 2, icon: '🦟', title: 'Stem Borer Warning',     desc: 'High humidity detected. Apply Chlorpyrifos 2.5ml/L on paddy crops.', time: '1 hr ago',   unread: true },
  { id: 3, icon: '💰', title: 'Coconut Price Up',       desc: 'Coconut prices rose to ₹24/piece at Thrissur APMC today.', time: '3 hrs ago',  unread: true },
  { id: 4, icon: '🌱', title: 'Fertilizer Reminder',    desc: 'Time for second dose fertilizer application on your paddy field.', time: '1 day ago',  unread: false },
  { id: 5, icon: '☀️', title: 'Good Spray Conditions',  desc: 'Clear skies and calm wind today — ideal for pesticide spraying.', time: '1 day ago',  unread: false },
  { id: 6, icon: '🏛️', title: 'New Scheme Available',   desc: 'Solar pump subsidy applications open. Visit Krishi Bhavan for details.', time: '2 days ago', unread: false },
];

// ── Searchable pages/features ─────────────────────────────────────────────────
const SEARCH_ITEMS = [
  { label: 'Voice AI Assistant',    to: '/voice',     icon: '🎤', desc: 'Ask farming questions in Malayalam' },
  { label: 'Crop Disease Scanner',  to: '/scan',      icon: '📷', desc: 'Detect diseases from crop photos' },
  { label: 'Weather Dashboard',     to: '/dashboard', icon: '🌤️', desc: 'Weather alerts and recommendations' },
  { label: 'Resource Tracker',      to: '/tracker',   icon: '📊', desc: 'Track costs, market prices, schemes' },
  { label: 'Offline Guides',        to: '/offline',   icon: '📥', desc: 'Download farming guides' },
  { label: 'Places & Centers',      to: '/places',    icon: '📍', desc: 'Find Krishi Bhavans near you' },
  { label: 'My Bookings',           to: '/bookings',  icon: '📅', desc: 'View and manage bookings' },
  { label: 'Market Prices',         to: '/tracker',   icon: '💰', desc: 'Coconut, paddy, banana prices' },
  { label: 'Fertilizer Guidance',   to: '/voice',     icon: '🌱', desc: 'Ask AI for fertilizer advice' },
  { label: 'Pest Management',       to: '/offline',   icon: '🐛', desc: 'Download pest control guides' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen,       setMenuOpen]       = useState(false);
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [notifOpen,      setNotifOpen]      = useState(false);
  const [notifications,  setNotifications]  = useState(NOTIFICATIONS);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  // Close panels on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target as Node))   { setSearchOpen(false); setSearchQuery(''); }
      if (notifRef.current    && !notifRef.current.contains(e.target as Node))    setNotifOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 50);
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const markOneRead = (id: number) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  const unreadCount = notifications.filter(n => n.unread).length;

  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_ITEMS.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const initials = user?.name
    ? (user.name as string).split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 transition-all duration-300"
            >
              <Sprout className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black tracking-tight text-slate-900">
                KeralaFarm <span className="text-emerald-600">AI</span>
              </span>
              
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="items-center hidden gap-1 xl:flex">
            {navLinks.map(link => {
              const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 group/link ${
                    isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon size={16} className={`${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover/link:text-emerald-500'} transition-colors`} />
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Actions ── */}
          <div className="items-center hidden gap-2 lg:flex">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <div className={`flex items-center gap-2 transition-all duration-300 ${
                searchOpen ? 'bg-slate-100 rounded-xl px-3 py-2' : ''
              }`}>
                {searchOpen && (
                  <input
                    ref={searchInput}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                    placeholder="Search crops, pests, markets..."
                    className="w-56 text-sm font-medium bg-transparent outline-none text-slate-700 placeholder-slate-400"
                  />
                )}
                <button
                  onClick={() => { setSearchOpen(v => !v); setSearchQuery(''); setNotifOpen(false); setDropdownOpen(false); }}
                  className="p-2 transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
                >
                  {searchOpen ? <X size={18} /> : <Search size={20} />}
                </button>
              </div>

              {/* Search results dropdown */}
              <AnimatePresence>
                {searchOpen && searchQuery.trim().length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-14 w-80 border-slate-100 rounded-2xl"
                  >
                    {searchResults.length > 0 ? (
                      <div className="p-2">
                        <p className="px-3 py-2 text-xs font-bold tracking-wider uppercase text-slate-400">
                          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </p>
                        {searchResults.map(item => (
                          <Link key={item.to + item.label} to={item.to}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 px-3 py-3 transition-colors rounded-xl hover:bg-emerald-50 group"
                          >
                            <span className="flex items-center justify-center text-2xl w-9 h-9 bg-slate-50 rounded-xl group-hover:bg-emerald-100">{item.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">{item.label}</p>
                              <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="mb-2 text-2xl">🔍</p>
                        <p className="text-sm font-bold text-slate-500">No results for "{searchQuery}"</p>
                        <p className="mt-1 text-xs text-slate-400">Try: crops, weather, prices</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(v => !v); setSearchOpen(false); setDropdownOpen(false); }}
                className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-14 w-96 border-slate-100 rounded-2xl"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                      <div>
                        <p className="font-black text-slate-900">Notifications</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{unreadCount} unread alerts</p>
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-96">
                      {notifications.map(n => (
                        <div key={n.id}
                          onClick={() => markOneRead(n.id)}
                          className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${
                            n.unread ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-2xl bg-white border shadow-sm rounded-xl border-slate-100">
                            {n.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className={`text-sm font-bold truncate ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                              {n.unread && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500" />}
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">{n.desc}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
                      <p className="text-xs font-medium text-center text-slate-400">
                        Alerts based on your location & crops
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-8 mx-1 bg-slate-200" />

            {/* User dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); setSearchOpen(false); }}
                  className="flex items-center gap-3 p-1.5 pr-3 transition-all rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50"
                >
                  <div className="flex items-center justify-center text-sm font-black text-white shadow-lg w-9 h-9 bg-emerald-600 rounded-xl shadow-emerald-200 ring-2 ring-white">
                    {initials}
                  </div>
                  <div className="hidden text-left xl:block">
                    <p className="mb-1 text-xs font-black leading-none text-slate-900">{user.name as string}</p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Active</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 z-50 p-3 mt-3 overflow-hidden bg-white border shadow-2xl w-72 border-slate-100 rounded-3xl"
                    >
                      {/* Profile header */}
                      <div className="px-4 py-4 mb-2 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-12 h-12 text-lg font-black text-white shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{user.name as string}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.email as string}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {[
                          { label: 'My Profile',       to: '/profile',   icon: User },
                          { label: 'My Bookings',      to: '/bookings',  icon: Calendar },
                          { label: 'Resource Tracker', to: '/tracker',   icon: BarChart3 },
                        ].map(item => (
                          <Link key={item.to} to={item.to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl group/item"
                          >
                            <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-xl bg-slate-50 group-hover/item:bg-emerald-100">
                              <item.icon size={16} className="text-slate-400 group-hover/item:text-emerald-600" />
                            </div>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <button onClick={handleLogout}
                          className="flex items-center w-full gap-3 px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 rounded-2xl">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-50">
                            <LogOut size={16} />
                          </div>
                          Logout Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors px-4 py-2.5">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 active:scale-95">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              onClick={() => { setNotifOpen(v => !v); setMenuOpen(false); }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              className="p-2.5 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => { setMenuOpen(v => !v); setNotifOpen(false); }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile notification panel ── */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-y-auto bg-white border-t lg:hidden border-slate-100 max-h-96"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
              <p className="text-sm font-black text-slate-900">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs font-bold text-emerald-600">Mark all read</button>
              )}
            </div>
            {notifications.map(n => (
              <div key={n.id} onClick={() => markOneRead(n.id)}
                className={`flex items-start gap-3 px-5 py-3 border-b border-slate-50 last:border-0 ${n.unread ? 'bg-emerald-50/50' : ''}`}>
                <span className="flex-shrink-0 text-xl">{n.icon}</span>
                <div>
                  <p className={`text-sm font-bold ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{n.time}</p>
                </div>
                {n.unread && <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-t lg:hidden border-slate-100"
          >
            <div className="px-4 py-6 space-y-1.5">
              {navLinks.map(link => {
                const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                      isActive ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile search */}
              <div className="pt-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-2xl">
                  <Search size={18} className="flex-shrink-0 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search crops, pests, markets..."
                    className="flex-1 text-sm font-medium bg-transparent outline-none text-slate-700 placeholder-slate-400"
                  />
                </div>
                {searchQuery.trim().length > 0 && (
                  <div className="mt-2 space-y-1">
                    {(SEARCH_ITEMS.filter(item =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                    )).map(item => (
                      <Link key={item.to + item.label} to={item.to}
                        onClick={() => { setMenuOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-3 transition-colors rounded-xl hover:bg-emerald-50"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 px-5 py-4 border bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl border-slate-100">
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-black text-white shadow-lg bg-emerald-600 rounded-2xl shadow-emerald-200 ring-4 ring-white">
                        {initials}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{user.name as string}</p>
                        <p className="text-xs text-slate-500">{user.email as string}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { to: '/profile',  icon: User,      label: 'Profile' },
                        { to: '/bookings', icon: Calendar,  label: 'Bookings' },
                        { to: '/tracker',  icon: BarChart3, label: 'Tracker' },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                          className="flex flex-col items-center gap-2 p-3 font-bold transition-colors bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">
                          <item.icon size={18} />
                          <span className="text-xs">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <button onClick={handleLogout}
                      className="flex items-center justify-center w-full gap-3 px-5 py-4 font-black text-red-500 transition-colors bg-red-50 rounded-2xl hover:bg-red-100">
                      <LogOut size={18} /> Logout Account
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center px-5 py-4 text-base font-bold text-slate-600 bg-slate-50 rounded-2xl">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center px-5 py-4 text-base font-black text-white shadow-xl bg-emerald-600 rounded-2xl shadow-emerald-200">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
