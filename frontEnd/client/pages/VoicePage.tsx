import React from 'react'
import VoiceAssistantWidget from '../components/VoiceAssistantWidget'

const VoicePage = () => {
  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎤</div>
          <h1 className="section-title">Voice AI Assistant</h1>
          <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            ശബ്ദ AI സഹായി
          </p>
          <p className="text-gray-600 mt-2">
            Ask any farming question in Malayalam or English
          </p>
        </div>

        {/* Widget */}
        <div className="card">
          <VoiceAssistantWidget />
        </div>

        {/* Sample Questions */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-600 mb-3 text-sm">Sample Questions / സാമ്പിൾ ചോദ്യങ്ങൾ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { en: 'What is the price of coconut today?', mal: 'ഇന്ന് തേങ്ങയുടെ വില എത്ര?' },
              { en: 'How to treat leaf blight in paddy?', mal: 'നെൽകൃഷിയിൽ ബ്ലൈറ്റ് എങ്ങനെ ചികിത്സിക്കാം?' },
              { en: 'Best fertilizer for banana?', mal: 'വാഴയ്ക്ക് ഏറ്റവും നല്ല വളം ഏത്?' },
              { en: 'Weather forecast for farming?', mal: 'കൃഷിക്ക് കാലാവസ്ഥ എങ്ങനെ?' },
            ].map((q, i) => (
              <div key={i} className="bg-forest-50 border border-forest-100 rounded-lg p-3">
                <p className="text-sm font-medium text-forest-700">{q.en}</p>
                <p className="text-xs text-forest-500 mt-1" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>{q.mal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoicePage
