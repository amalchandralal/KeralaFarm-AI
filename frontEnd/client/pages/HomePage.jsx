import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Scan, 
  CloudSun, 
  TrendingUp, 
  Sprout, 
  Mic, 
  MapPin,
  Play,
  Zap,
  ShieldCheck,
  Calendar,
  WifiOff
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    id: 'feature-scan',
    icon: Scan,
    title: 'Crop Disease Detection',
    description: 'Upload a photo of your crop to instantly detect diseases and get treatment recommendations.',
    link: '/scan',
  },
  {
    id: 'feature-dashboard',
    icon: CloudSun,
    title: 'Weather Advisory',
    description: 'Get personalized weather-based farming advice to plan your agricultural activities.',
    link: '/dashboard',
  },
  {
    id: 'feature-tracker',
    icon: TrendingUp,
    title: 'Market Prices & Resource Tracker',
    description: 'Track input expenses and stay updated on current crop prices in local markets.',
    link: '/tracker',
  },
  {
    id: 'feature-voice',
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Ask any farming question naturally and get instant AI-powered advice.',
    link: '/voice',
  },
  {
    id: 'feature-places',
    icon: MapPin,
    title: 'Farm Centers & Places',
    description: 'Find nearby agricultural service centers, Krishi Bhavans, and support locations.',
    link: '/places',
  },
  {
    id: 'feature-offline',
    icon: WifiOff,
    title: 'Offline Guides',
    description: 'Access farming documentation and guides anytime, even without an internet connection.',
    link: '/offline',
  },
  {
    id: 'feature-bookings',
    icon: Calendar,
    title: 'Krishi Bhavan Bookings',
    description: 'Schedule appointments and bookings at local agricultural offices hassle-free.',
    link: '/bookings',
  },
];

const HomePage = () => {
  const { hash, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const targetId = hash ? hash.replace('#', '') : params.get('feature');
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [hash, search]);

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800/80 scroll-mt-16 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100 sm:text-5xl">
              Everything a Farmer Needs
            </h2>
            <p className="text-xl text-gray-500 dark:text-slate-400">
              A complete suite of smart tools designed to assist you at every step of your farming journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard 
                  id={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  link={feature.link}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
     
      {/* How it Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100 sm:text-5xl">
              How It Works
            </h2>
            <p className="text-xl text-gray-500 dark:text-slate-400">
              Get answers to your farming questions in three simple steps.
            </p>
          </div>
          
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Horizontal Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-8 left-[16.666%] right-[16.666%] h-[2px] bg-gray-200 dark:bg-slate-800 z-0" />
            
            {[
              { 
                step: '1', 
                icon: Mic,
                title: 'Ask your question', 
                desc: 'Tap the microphone and ask your farming doubts naturally.'
              },
              { 
                step: '2', 
                icon: Zap,
                title: 'AI Processing', 
                desc: 'Our system analyzes your query against verified agricultural data.'
              },
              { 
                step: '3', 
                icon: Play,
                title: 'Get Results', 
                desc: 'Receive clear, actionable advice instantly, read aloud.'
              },
            ].map((item, idx) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-full shadow-sm text-emerald-600 dark:text-emerald-400">
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="flex items-center justify-center w-6 h-6 mb-4 text-xs font-semibold bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-slate-100">{item.title}</h3>
                <p className="max-w-sm text-base leading-relaxed text-gray-500 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="px-6 mx-auto max-w-[1600px] sm:px-8 lg:px-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-3xl shadow-xl">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
              <Sprout className="w-[500px] h-[500px] text-emerald-500/20 dark:text-emerald-400/10" />
            </div>
            
            <div className="relative z-10 px-8 py-20 text-center sm:px-16 sm:py-24 lg:px-32">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-base font-medium text-emerald-100 bg-emerald-800/50 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5" />
                Government Verified Data
              </div>
              <h2 className="max-w-3xl mx-auto mb-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ready to transform your farming?
              </h2>
              <p className="max-w-2xl mx-auto mb-12 text-xl text-emerald-50">
                Join thousands of farmers who are using AgroVision to improve their crop yield. Completely free to use.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link 
                  to="/register" 
                  className="w-full px-10 py-4 text-lg font-bold text-emerald-700 dark:text-emerald-800 transition-colors bg-white rounded-lg shadow-sm sm:w-auto hover:bg-gray-50"
                >
                  Create Free Account
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