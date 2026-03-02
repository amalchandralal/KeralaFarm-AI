import React from 'react'
import DiseaseScanner from '../components/DiseaseScanner'

const ScanPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📷</div>
          <h1 className="section-title">Crop Disease Scanner</h1>
          <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            വിള രോഗ നിർണ്ണയം
          </p>
          <p className="text-gray-600 mt-2">
            Take a photo of your crop to detect diseases instantly
          </p>
        </div>

        {/* Scanner */}
        <div className="card">
          <DiseaseScanner />
        </div>

        {/* Tips */}
        <div className="mt-6 card bg-earth-50 border-earth-200">
          <h3 className="font-semibold text-earth-800 mb-3">📸 Photo Tips for Better Results</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ Take photo in good daylight</li>
            <li>✅ Focus on the affected leaf or stem</li>
            <li>✅ Ensure the diseased area is clearly visible</li>
            <li>❌ Avoid blurry or dark photos</li>
          </ul>
          <p className="text-xs text-earth-600 mt-3" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            നല്ല വെളിച്ചത്തിൽ രോഗബാധിത ഭാഗം വ്യക്തമായി ഫോട്ടോ എടുക്കൂ
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScanPage
