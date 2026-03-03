import React from 'react'
import VoiceAssistantWidget from '../components/VoiceAssistantWidget'

const VoicePage = () => {
  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-6xl"></div>
          <h1 className="section-title">Voice AI Assistant</h1>
          <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            ശബ്ദ AI സഹായി
          </p>
          <p className="mt-2 text-gray-600">
            Ask any farming question in Malayalam or English
          </p>
        </div>

        {/* Widget */}
        <div className="card">
          <VoiceAssistantWidget />
        </div>

        {/* Sample Questions */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-600">Sample Questions / സാമ്പിൾ ചോദ്യങ്ങൾ</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { en: 'What is the price of coconut today?', mal: 'ഇന്ന് തേങ്ങയുടെ വില എത്ര?' },
              { en: 'How to treat leaf blight in paddy?', mal: 'നെൽകൃഷിയിൽ ബ്ലൈറ്റ് എങ്ങനെ ചികിത്സിക്കാം?' },
              { en: 'Best fertilizer for banana?', mal: 'വാഴയ്ക്ക് ഏറ്റവും നല്ല വളം ഏത്?' },
              { en: 'Weather forecast for farming?', mal: 'കൃഷിക്ക് കാലാവസ്ഥ എങ്ങനെ?' },
            ].map((q, i) => (
              <div key={i} className="p-3 border rounded-lg bg-forest-50 border-forest-100">
                <p className="text-sm font-medium text-forest-700">{q.en}</p>
                <p className="mt-1 text-xs text-forest-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>{q.mal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoicePage
