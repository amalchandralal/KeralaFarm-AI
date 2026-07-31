import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scan, 
  CloudSun, 
  TrendingUp, 
  Sprout, 
  Mic, 
  MapPin,
  Play,
  Zap,
  ShieldCheck
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

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
  return (
    <div className="min-h-screen font-sans bg-gray-50 selection:bg-emerald-100 selection:text-emerald-900">
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Everything a Farmer Needs
            </h2>
            <p className="text-xl text-gray-500">
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
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              How It Works
            </h2>
            <p className="text-xl text-gray-500">
              Get answers to your farming questions in three simple steps.
            </p>
          </div>
          
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Horizontal Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-8 left-[16.666%] right-[16.666%] h-[2px] bg-gray-200 z-0" />
            
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
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white border border-gray-200 rounded-full shadow-sm text-emerald-600">
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="flex items-center justify-center w-6 h-6 mb-4 text-xs font-semibold bg-gray-100 rounded-full text-gray-500">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="max-w-sm text-base leading-relaxed text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-[1600px] sm:px-8 lg:px-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl shadow-xl">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
              <Sprout className="w-[500px] h-[500px] text-emerald-500/20" />
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
                Join thousands of Kerala farmers who are already using KrishiAI to improve their crop yield. Completely free to use.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link 
                  to="/register" 
                  className="w-full px-10 py-4 text-lg font-bold text-emerald-700 transition-colors bg-white rounded-lg shadow-sm sm:w-auto hover:bg-gray-50"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/contact" 
                  className="w-full px-10 py-4 text-lg font-bold text-white transition-colors bg-emerald-800/50 border border-emerald-500/30 rounded-lg sm:w-auto hover:bg-emerald-800/70"
                >
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