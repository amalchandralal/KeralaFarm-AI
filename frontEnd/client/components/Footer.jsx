import React from "react";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-5 bg-slate-950 text-slate-500">
      <div className="page-container">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-lg font-black text-white">
            <div className="flex items-center justify-center rounded-lg w-7 h-7 bg-emerald-600">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            KrishiAI
          </div>

          {/* Links */}
          <div className="flex flex-wrap text-sm font-medium gap-x-6 gap-y-1">
            <Link to="/about" className="transition-colors hover:text-emerald-500">About</Link>
            <Link to="/privacy" className="transition-colors hover:text-emerald-500">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-emerald-500">Terms</Link>
            <Link to="/contact" className="transition-colors hover:text-emerald-500">Contact</Link>
            <Link to="/scan" className="transition-colors hover:text-emerald-500">Disease Detection</Link>
            <Link to="/dashboard" className="transition-colors hover:text-emerald-500">Weather Advisory</Link>
            <Link to="/tracker" className="transition-colors hover:text-emerald-500">Market Prices</Link>
            <Link to="/voice" className="transition-colors hover:text-emerald-500">Voice Assistant</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 pt-4 text-xs border-t border-slate-900 md:flex-row">
          <p>© {new Date().getFullYear()} KeralaFarm Ai. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Systems Operational
            </span>
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;