import React from "react";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 py-4 text-gray-500">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* LEFT: Brand & Tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-emerald-600 text-white shadow-sm">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              AgroVision
            </div>
            <p className="text-sm text-gray-500">
              Empowering agriculture with AI-driven insights.
            </p>
          </div>

          {/* MIDDLE: Quick Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          </div>
          
        </div>

        {/* BOTTOM: Copyright & Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-gray-200/60 text-xs">
          <p>© {new Date().getFullYear()} AgroVision. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-500" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-medium text-gray-600">Operational</span>
            </div>
            <span className="text-gray-400 font-mono">v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;