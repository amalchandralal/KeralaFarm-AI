import React from 'react'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'

const features = [
  {
    icon: '🔬',
    title: 'Crop Disease Detection',
    titleMal: 'രോഗ നിർണ്ണയം',
    description: 'Upload a photo of your crop to instantly detect diseases and get treatment recommendations.',
    link: '/scan',
  },
  {
    
    title: 'Weather Advisory',
    titleMal: 'കാലാവസ്ഥ നിർദ്ദേശം',
    description: 'Get personalized weather-based farming advice to plan your agricultural activities.',
    link: '/dashboard',
  },
  {
    
    title: 'Market Prices',
    titleMal: 'വിപണി വില',
    description: 'Ask about current vegetable and crop prices in Kerala markets to get the best deals.',
    link: '/tracker',
  },
  {
    
    title: 'Fertilizer Guidance',
    titleMal: 'വളം നിർദ്ദേശം',
    description: 'Get expert advice on fertilizer usage, soil health, and crop nutrition management.',
    link: '/voice',
  },
  {
    
    title: 'Voice Assistant',
    titleMal: 'ശബ്ദ സഹായി',
    description: 'Ask any farming question in Malayalam or English and get instant AI-powered answers.',
    link: '/offline',
  },
  {
    
    title: 'Farm Centers',
    titleMal: 'കൃഷി കേന്ദ്രങ്ങൾ',
    description: 'Find nearby agricultural service centers, Krishi Bhavans, and farming support places.',
    link: '/places',
  },
]

const HomePage = () => {
  return (
    <div>
      <HeroSection />

      {/* Features Section */}
      <section className="py-12 page-container">
        <div className="mb-10 text-center">
          <h2 className="section-title">Everything a Farmer Needs</h2>
          <p className="text-lg text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            ഒരു കർഷകന് ആവശ്യമുള്ളതെല്ലാം
          </p>
        </div>

        
      </section>

      {/* How it Works */}
      <section className="py-12 text-white bg-forest-700">
        <div className="page-container">
          <h2 className="mb-10 text-2xl font-bold text-center md:text-3xl">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {[
              { step: '1',  text: 'Speak your question in Malayalam or English', mal: 'ചോദ്യം ചോദിക്കൂ' },
              { step: '2',  text: 'Our AI analyzes and finds the best answer for you', mal: 'AI ഉത്തരം തിരയുന്നു' },
              { step: '3',  text: 'Hear the answer read aloud in your language', mal: 'ഉത്തരം കേൾക്കൂ' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center text-2xl font-bold rounded-full w-14 h-14 bg-white/20">
                  {item.step}
                </div>
                <div className="text-4xl"></div>
                <p className="text-forest-100">{item.text}</p>
                <p className="text-sm text-forest-300" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
                  {item.mal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-10 bg-earth-50 border-y border-earth-200">
        <div className="text-center page-container">
          <p className="mb-2 text-2xl"></p>
          <h3 className="mb-2 text-xl font-bold text-earth-800">Free for all Kerala farmers</h3>
          <p className="mb-6 text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            എല്ലാ കേരള കർഷകർക്കും സൗജന്യം
          </p>
          <a href="/register" className="inline-flex items-center gap-2 text-lg btn-primary">
             Create Free Account
          </a>
        </div>
      </section>
    </div>
  )
}

export default HomePage
