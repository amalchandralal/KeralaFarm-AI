import React from "react";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm mt-auto transition-colors duration-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-slate-100">
            <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            AgroVision
          </div>
          <span className="hidden md:inline-block text-gray-300 dark:text-slate-700">|</span>
          <p className="text-xs md:text-sm">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Middle: Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/about" className="hover:text-gray-900 dark:hover:text-slate-100 transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-slate-100 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-900 dark:hover:text-slate-100 transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-gray-900 dark:hover:text-slate-100 transition-colors">Contact</Link>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:hover:text-slate-100 transition-colors">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-500" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span>All systems operational</span>
          </div>
          <span className="text-gray-400 dark:text-slate-500 font-mono hidden sm:inline-block">v2.4.0</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;