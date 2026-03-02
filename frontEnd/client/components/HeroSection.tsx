import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-700 via-forest-600 to-forest-500 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-9xl">🌴</div>
        <div className="absolute bottom-10 right-10 text-9xl">🌾</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-30">🌿</div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6 text-sm font-medium">
          <span>🤖</span>
          <span>AI-Powered Farm Assistant</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight fade-in-up">
          KeralaFarm
          <span className="text-paddy"> AI</span>
        </h1>

        <p className="text-xl md:text-2xl font-semibold mb-2 fade-in-up fade-in-up-delay-1" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
          കേരളത്തിലെ ചെറുകിട കർഷകർക്കായി
        </p>

        <p className="text-lg md:text-xl text-forest-100 mb-8 max-w-xl mx-auto fade-in-up fade-in-up-delay-2">
          Voice-first AI assistant for Kerala farmers.
          <br />
          <span className="text-sm opacity-80">Speak in Malayalam or English</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up fade-in-up-delay-3">
          <Link
            to="/voice"
            className="flex items-center gap-3 bg-white text-forest-700 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-forest-50 transition-all active:scale-95 w-full sm:w-auto justify-center"
          >
            <span className="text-2xl">🎤</span>
            Try Voice Assistant
          </Link>
          <Link
            to="/scan"
            className="flex items-center gap-3 bg-earth-500 hover:bg-earth-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 w-full sm:w-auto justify-center"
          >
            <span className="text-2xl">📷</span>
            Scan a Crop
          </Link>
        </div>

        <p className="mt-8 text-forest-200 text-sm fade-in-up fade-in-up-delay-4">
          Free to use · No technical knowledge required · Works in Malayalam
        </p>
      </div>
    </section>
  )
}

export default HeroSection
