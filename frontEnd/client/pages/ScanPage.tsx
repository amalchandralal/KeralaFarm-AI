import React from 'react'
import DiseaseScanner from '../components/DiseaseScanner'

const ScanPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-6xl">📷</div>
          <h1 className="section-title">Crop Disease Scanner</h1>
          <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            വിള രോഗ നിർണ്ണയം
          </p>
          <p className="mt-2 text-gray-600">
            Take a photo of your crop to detect diseases instantly
          </p>
        </div>

        {/* Scanner */}
        <div className="card">
          <DiseaseScanner />
        </div>

        {/* Tips */}
        <div className="mt-6 card bg-earth-50 border-earth-200">
          <h3 className="mb-3 font-semibold text-earth-800">📸 Photo Tips for Better Results</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Take photo in good daylight</li>
            <li>Focus on the affected leaf or stem</li>
            <li>Ensure the diseased area is clearly visible</li>
            <li>Avoid blurry or dark photos</li>
          </ul>
          <p className="mt-3 text-xs text-earth-600" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            നല്ല വെളിച്ചത്തിൽ രോഗബാധിത ഭാഗം വ്യക്തമായി ഫോട്ടോ എടുക്കൂ
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScanPage
