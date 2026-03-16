import React from 'react'
import DiseaseScanner from '../components/DiseaseScanner'

const ScanPage = () => {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          {/* Custom Camera & Leaf Icon */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-sm bg-emerald-100 ring-4 ring-white">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="absolute p-1 bg-white rounded-full shadow-sm -bottom-1 -right-1">
              <span className="text-xl leading-none">🌿</span>
            </div>
          </div>
          
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Crop Disease Scanner
          </h1>
          <p className="mb-3 text-sm font-bold tracking-wide text-emerald-600" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            വിള രോഗ നിർണ്ണയം
          </p>
          <p className="max-w-xl mx-auto text-base text-gray-500">
            Take a clear photo of your crop to detect diseases instantly using our AI-powered analysis tool.
          </p>
        </div>

        {/* Scanner Component Wrapper */}
        <div className="relative mb-8 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl shadow-gray-200/40">
          {/* Decorative Top Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          
          <div className="p-6 sm:p-8 md:p-10">
            <DiseaseScanner />
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="p-6 border shadow-sm bg-emerald-50 border-emerald-100 rounded-2xl sm:px-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-100/80 rounded-xl text-emerald-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-extrabold text-emerald-900">Photo Tips for Best Results</h3>
          </div>
          
          <div className="grid grid-cols-1 mb-5 sm:grid-cols-2 gap-x-6 gap-y-3">
            {[
              "Take photo in good daylight",
              "Focus on the affected leaf or stem",
              "Ensure the diseased area is centered",
              "Avoid blurry, moving, or dark photos"
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-medium text-emerald-800/80">{tip}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-start gap-3 pt-4 border-t border-emerald-200/60 sm:items-center">
            <span className="text-lg bg-white p-1.5 rounded-full shadow-sm">📸</span>
            <p className="text-sm font-medium text-emerald-700" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
              നല്ല വെളിച്ചത്തിൽ രോഗബാധിത ഭാഗം വ്യക്തമായി ഫോട്ടോ എടുക്കൂ.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ScanPage