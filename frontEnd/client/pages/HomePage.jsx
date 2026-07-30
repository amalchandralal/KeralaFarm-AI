import { 
  Scan, 
  CloudSun, 
  TrendingUp, 
  Sprout, 
  Mic, 
  MapPin,
  ArrowRight,
  Play,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';

const FeatureCard = ({ icon: Icon, title, description, link, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-[2.5] duration-700 opacity-50" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-8 transition-all duration-300 shadow-inner rounded-2xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
          <Icon className="w-8 h-8" />
        </div>
        
        <h3 className="mb-4 text-2xl font-bold text-slate-900">{title}</h3>
        
        <p className="flex-grow mb-8 leading-relaxed text-slate-600">
          {description}
        </p>
        
        <Link 
          to={link}
          className="inline-flex items-center text-sm font-bold transition-colors text-slate-900 group-hover:text-emerald-600"
        >
          Explore Service
          <div className="flex items-center justify-center w-10 h-10 ml-3 transition-all rounded-full shadow-sm bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const containerRef = useRef(null);
  const [weather, setWeather] = useState(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        // Fetch weather from Open-Meteo (Free, no key required)
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        
        // Use reverse geocoding to get location name (OpenStreetMap Nominatim - Free)
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const geoData = await geoResponse.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || "Your Location";

        setWeather({
          temp: Math.round(data.current_weather.temperature),
          location: `${city}, Kerala`
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
        // Fallback if geocoding fails but weather works
        setWeather(prev => prev || { temp: 28, location: "Kerala" });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to Palakkad if permission denied
          setWeather({ temp: 28, location: "Palakkad, Kerala" });
        }
      );
    } else {
      setWeather({ temp: 28, location: "Palakkad, Kerala" });
    }
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-50 rounded-full blur-[100px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 grid items-center gap-16 page-container lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y, opacity }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] mb-8">
            Smart Farming <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">
              Redefined.
            </span>
          </h1>
          
          <p className="max-w-xl mb-12 text-xl leading-relaxed text-slate-600">
            A smart assistant for Kerala's farmers. Get help with crop questions and disease diagnosis, powered by KrishiAI.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link to="/scan" className="flex items-center justify-center px-8 py-4 text-lg font-black text-white transition-all shadow-xl group bg-slate-900 sm:px-10 sm:py-5 rounded-2xl hover:bg-emerald-600 shadow-slate-200 hover:shadow-emerald-200 hover:-translate-y-1">
              Start Scanning
              <Scan className="w-5 h-5 ml-3 transition-transform group-hover:rotate-12" />
            </Link>
            <Link to="/voice" className="flex items-center justify-center px-8 py-4 text-lg font-black transition-all bg-white border-2 group text-slate-900 border-slate-100 sm:px-10 sm:py-5 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50">
              Voice Assistant
              <Mic className="w-5 h-5 ml-3 transition-transform group-hover:scale-110 text-emerald-600" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-200 border-[12px] border-white">
            <img 
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
              alt="Farming" 
              className="w-full h-[600px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
          </div>
          
          {/* Floating Weather Card */}
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute z-20 p-6 border shadow-2xl -top-6 -right-6 bg-white/80 backdrop-blur-xl rounded-3xl border-white/20"
          >
            <div className="flex items-center gap-4">
              <CloudSun className="w-10 h-10 text-emerald-500" />
              <div>
                <p className="text-2xl font-black text-slate-900">
                  {weather ? `${weather.temp}°C` : '--°C'}
                </p>
                <p className="text-xs font-bold text-slate-500">
                  {weather ? weather.location : 'Detecting location...'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Scan,
    title: 'Crop Disease Detection',
    description: 'Upload a photo of your crop to instantly detect diseases and get treatment recommendations.',
    link: '/scan',
  },
  {
    icon: CloudSun,
    title: 'Weather Advisory',
    description: 'Get personalized weather-based farming advice to plan your agricultural activities.',
    link: '/dashboard',
  },
  {
    icon: TrendingUp,
    title: 'Market Prices',
    description: 'Ask about current vegetable and crop prices in Kerala markets to get the best deals.',
    link: '/tracker',
  },
  {
    icon: Sprout,
    title: 'Fertilizer Guidance',
    description: 'Get expert advice on fertilizer usage, soil health, and crop nutrition management.',
    link: '/fertilizer',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Ask any farming question and get instant AI-powered answers.',
    link: '/voice',
  },
  {
    icon: MapPin,
    title: 'Farm Centers',
    description: 'Find nearby agricultural service centers, Krishi Bhavans, and farming support places.',
    link: '/places',
  },
];

const HomePage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      {/* Features Section */}
      <section className="py-32 page-container">
        <div className="flex flex-col justify-between gap-8 mb-20 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black tracking-widest uppercase mb-6"
            >
              Our Services
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black leading-tight md:text-6xl text-slate-900"
            >
              Everything a Farmer Needs <br />
              <span className="text-slate-400">In One Place.</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              index={index} 
            />
          ))}
        </div>
      </section>
     
      {/* How it Works */}
      <section className="py-32 bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto mb-24 text-center">
            <h2 className="mb-6 text-4xl font-black text-center md:text-6xl text-slate-900">How It Works</h2>
          </div>
          
          <div className="relative grid grid-cols-1 gap-16 md:grid-cols-3">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
            {[
              { 
                step: '01', 
                icon: Mic,
                text: 'Speak your question', 
                desc: 'Simply tap the microphone and ask your farming doubts.'
              },
              { 
                step: '02', 
                icon: Zap,
                text: 'AI Analysis', 
                desc: 'Our advanced models process your query and search through verified agricultural data.'
              },
              { 
                step: '03', 
                icon: Play,
                text: 'Instant Answer', 
                desc: 'Get clear, actionable advice instantly, read aloud to you.'
              },
            ].map((item, idx) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                  <item.icon className="w-10 h-10 transition-colors text-emerald-600 group-hover:text-white" />
                </div>
                <div className="mb-2 text-sm font-black tracking-widest uppercase text-emerald-600">{item.step}</div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">{item.text}</h3>
                <p className="max-w-xs leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="bg-emerald-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5">
              <Sprout size={300} className="text-white" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 text-sm font-black tracking-widest uppercase border rounded-full bg-emerald-800/50 text-emerald-400 border-emerald-700/50">
                <ShieldCheck size={18} />
                Government Verified Data
              </div>
              <h3 className="mb-8 text-5xl font-black leading-tight text-white md:text-7xl">Free for all Kerala farmers</h3>
              <p className="mb-16 text-2xl font-medium text-emerald-200">
                This service is completely free for all Kerala farmers.
              </p>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <Link to="/register" className="px-12 py-6 text-xl font-black transition-all bg-white shadow-2xl text-emerald-900 rounded-2xl hover:bg-emerald-50 hover:-translate-y-1">
                  Create Free Account
                </Link>
                <Link to="/contact" className="px-12 py-6 text-xl font-black text-white transition-all border-2 bg-emerald-800/50 border-white/20 rounded-2xl hover:bg-emerald-800 backdrop-blur-sm">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;