import React from 'react';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { Info } from 'lucide-react';

const VoicePage = () => {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Voice Assistant
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Ask questions about farming, crops, and diseases using your voice.
          </p>
        </div>

        {/* Tips Banner */}
        <div className="flex items-start gap-3 p-4 mb-8 border border-gray-200 bg-white rounded-lg shadow-sm">
          <Info className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Quick Tips</h3>
            <ul className="mt-1 space-y-1 text-sm text-gray-500 list-disc list-inside">
              <li>Tap the microphone button to start speaking</li>
              <li>Speak clearly in a quiet environment</li>
              <li>You can also type your question if preferred</li>
            </ul>
          </div>
        </div>

        {/* Voice Widget Component */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <VoiceAssistantWidget />
        </div>

      </div>
    </div>
  );
};

export default VoicePage;