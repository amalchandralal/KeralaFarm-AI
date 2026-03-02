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
    icon: '🌤️',
    title: 'Weather Advisory',
    titleMal: 'കാലാവസ്ഥ നിർദ്ദേശം',
    description: 'Get personalized weather-based farming advice to plan your agricultural activities.',
    link: '/voice',
  },
  {
    icon: '💰',
    title: 'Market Prices',
    titleMal: 'വിപണി വില',
    description: 'Ask about current vegetable and crop prices in Kerala markets to get the best deals.',
    link: '/voice',
  },
  {
    icon: '🌱',
    title: 'Fertilizer Guidance',
    titleMal: 'വളം നിർദ്ദേശം',
    description: 'Get expert advice on fertilizer usage, soil health, and crop nutrition management.',
    link: '/voice',
  },
  {
    icon: '🎤',
    title: 'Voice Assistant',
    titleMal: 'ശബ്ദ സഹായി',
    description: 'Ask any farming question in Malayalam or English and get instant AI-powered answers.',
    link: '/voice',
  },
  {
    icon: '📍',
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
      <section className="page-container py-12">
        <div className="text-center mb-10">
          <h2 className="section-title">Everything a Farmer Needs</h2>
          <p className="text-gray-500 text-lg" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            ഒരു കർഷകന് ആവശ്യമുള്ളതെല്ലാം
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-forest-700 text-white py-12">
        <div className="page-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '1', icon: '🎤', text: 'Speak your question in Malayalam or English', mal: 'ചോദ്യം ചോദിക്കൂ' },
              { step: '2', icon: '🤖', text: 'Our AI analyzes and finds the best answer for you', mal: 'AI ഉത്തരം തിരയുന്നു' },
              { step: '3', icon: '🔊', text: 'Hear the answer read aloud in your language', mal: 'ഉത്തരം കേൾക്കൂ' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div className="text-4xl">{item.icon}</div>
                <p className="text-forest-100">{item.text}</p>
                <p className="text-forest-300 text-sm" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
                  {item.mal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-earth-50 border-y border-earth-200 py-10">
        <div className="page-container text-center">
          <p className="text-2xl mb-2">🌾</p>
          <h3 className="text-xl font-bold text-earth-800 mb-2">Free for all Kerala farmers</h3>
          <p className="text-gray-500 mb-6" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            എല്ലാ കേരള കർഷകർക്കും സൗജന്യം
          </p>
          <a href="/register" className="btn-primary inline-flex items-center gap-2 text-lg">
            📝 Create Free Account
          </a>
        </div>
      </section>
    </div>
  )
}

export default HomePage
