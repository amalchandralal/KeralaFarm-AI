import React from 'react'
import { Link } from 'react-router-dom'
import { Mic, Scan } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden text-white bg-gradient-to-br from-forest-700 via-forest-600 to-forest-500">
      <div className="relative max-w-5xl px-4 py-16 mx-auto text-center md:py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-white/20 backdrop-blur">
          <span>AI-Powered Farm Assistant</span>
        </div>

        <h1 className="mb-3 text-4xl font-bold leading-tight md:text-6xl fade-in-up">
          KeralaFarm
          <span className="text-paddy"> AI</span>
        </h1>

        <p className="max-w-xl mx-auto mb-8 text-lg md:text-xl text-forest-100 fade-in-up fade-in-up-delay-2">
          Voice-first AI assistant for Kerala farmers.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row fade-in-up fade-in-up-delay-3">
          <Link
            to="/voice"
            className="flex items-center justify-center w-full gap-3 px-8 py-4 text-lg font-bold transition-all bg-white shadow-xl text-forest-700 rounded-2xl hover:shadow-2xl hover:bg-forest-50 active:scale-95 sm:w-auto"
          >
            <Mic size={20} />
            Try Voice Assistant
          </Link>
          <Link
            to="/scan"
            className="flex items-center justify-center w-full gap-3 px-8 py-4 text-lg font-bold text-white transition-all shadow-xl bg-earth-500 hover:bg-earth-600 rounded-2xl hover:shadow-2xl active:scale-95 sm:w-auto"
          >
            <Scan size={20} />
            Scan a Crop
          </Link>
        </div>

        <p className="mt-8 text-sm text-forest-200 fade-in-up fade-in-up-delay-4">
          Free to use · No technical knowledge required
        </p>
      </div>
    </section>
  )
}

export default HeroSection