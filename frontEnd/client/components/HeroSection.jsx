import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Scan, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const geoData = await geoResponse.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || "Your Location";
        const state = geoData.address.state || "";

        setWeather({
          temp: Math.round(data.current_weather.temperature),
          location: state ? `${city}, ${state}` : city
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather({ temp: 28, location: "Kerala" });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setWeather({ temp: 28, location: "Palakkad, Kerala" });
        }
      );
    } else {
      setWeather({ temp: 28, location: "Kerala" });
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-gray-50">
      {/* Decorative subtle pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-50 rounded-full blur-[100px] opacity-40 translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gray-100 rounded-full blur-[80px] opacity-60 -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 grid items-center max-w-7xl gap-12 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-24 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-base font-medium rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm">
            <span className="flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AI-Powered Farm Assistant
          </div>
          
          <h1 className="mb-8 text-6xl font-extrabold tracking-tight text-gray-900 md:text-7xl lg:text-[5.5rem] leading-[1.1]">
            Smart Farming, <br className="hidden lg:block" />
            <span className="text-emerald-600">Redefined.</span>
          </h1>
          
          <p className="max-w-2xl mb-10 text-xl leading-relaxed text-gray-500 sm:text-2xl">
            A voice-first intelligent assistant for Kerala's farmers. Get instant help with crop questions, disease diagnosis, and daily advisory.
          </p>
          
          <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
            <Link 
              to="/voice" 
              className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white transition-all bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 hover:shadow-md"
            >
              <Mic className="w-6 h-6" />
              Try Voice Assistant
            </Link>
            <Link 
              to="/scan" 
              className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold transition-all bg-white border border-gray-200 rounded-lg text-gray-900 shadow-sm hover:bg-gray-50 hover:text-emerald-600"
            >
              <Scan className="w-6 h-6" />
              Scan a Crop
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
              alt="Farming in Kerala" 
              className="object-cover w-full h-[600px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
          </div>
          
          {/* Floating Weather Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute z-20 flex items-center gap-4 p-4 bg-white border border-gray-200 shadow-lg -bottom-6 -left-6 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50">
              <CloudSun className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {weather ? `${weather.temp}°C` : '--°C'}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {weather ? weather.location : 'Detecting...'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;