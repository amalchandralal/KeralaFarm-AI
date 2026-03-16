// import React from 'react'
// import VoiceAssistantWidget from '../components/VoiceAssistantWidget'

// const VoicePage = () => {
//   return (
//     <div className="page-container">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="mb-3 text-6xl"></div>
//           <h1 className="section-title">Voice AI Assistant</h1>
//           <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
//             ശബ്ദ AI സഹായി
//           </p>
//           <p className="mt-2 text-gray-600">
//             Ask any farming question in Malayalam or English
//           </p>
//         </div>

//         {/* Widget */}
//         <div className="card">
//           <VoiceAssistantWidget />
//         </div>

//         {/* Sample Questions */}
//         <div className="mt-6">
//           <h3 className="mb-3 text-sm font-semibold text-gray-600">Sample Questions / സാമ്പിൾ ചോദ്യങ്ങൾ</h3>
//           <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//             {[
//               { en: 'What is the price of coconut today?', mal: 'ഇന്ന് തേങ്ങയുടെ വില എത്ര?' },
//               { en: 'How to treat leaf blight in paddy?', mal: 'നെൽകൃഷിയിൽ ബ്ലൈറ്റ് എങ്ങനെ ചികിത്സിക്കാം?' },
//               { en: 'Best fertilizer for banana?', mal: 'വാഴയ്ക്ക് ഏറ്റവും നല്ല വളം ഏത്?' },
//               { en: 'Weather forecast for farming?', mal: 'കൃഷിക്ക് കാലാവസ്ഥ എങ്ങനെ?' },
//             ].map((q, i) => (
//               <div key={i} className="p-3 border rounded-lg bg-forest-50 border-forest-100">
//                 <p className="text-sm font-medium text-forest-700">{q.en}</p>
//                 <p className="mt-1 text-xs text-forest-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>{q.mal}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoicePage
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Loader2, Globe } from 'lucide-react';

const VoiceAssistantWidget = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'mal' | 'en'>('mal');
  const [inputText, setInputText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setResponse(language === 'mal' 
          ? "പാലക്കാട് മാർക്കറ്റിൽ ഇന്ന് തേങ്ങയുടെ വില കിലോയ്ക്ക് 35 രൂപയാണ്. കൂടുതൽ വിവരങ്ങൾ വേണോ?" 
          : "The current price of coconut in Palakkad market is ₹35 per kg. Would you like more details?");
      }, 2000);
    } else {
      setIsListening(true);
      setTranscript("");
      setResponse("");
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setTranscript(inputText);
    setInputText('');
    setTimeout(() => {
      setIsProcessing(false);
      setResponse(language === 'mal' 
        ? "നിങ്ങളുടെ ചോദ്യത്തിനുള്ള മറുപടി ഉടൻ ലഭ്യമാകും." 
        : "The answer to your question will be available shortly.");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Language Selection */}
        <div className="flex justify-center gap-3 mb-10">
          <button 
            onClick={() => setLanguage('mal')}
            className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all ${language === 'mal' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
          >
            മലയാളം
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all ${language === 'en' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
          >
            English
          </button>
        </div>

        {/* Interaction Area */}
        <div className="flex flex-col items-center justify-center min-h-[280px] mb-8">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20" />
                  <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                </div>
                <p className="font-bold text-emerald-600 font-malayalam animate-pulse">
                  {language === 'mal' ? 'വിശകലനം ചെയ്യുന്നു...' : 'Analyzing...'}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center w-full text-center"
              >
                {/* Mic Button */}
                <button 
                  onClick={toggleListening}
                  className={`
                    relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500 mb-8
                    ${isListening 
                      ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-110' 
                      : 'bg-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-105 hover:bg-emerald-500'}
                  `}
                >
                  {isListening && (
                    <div className="absolute inset-0 border-4 rounded-full border-white/30 animate-ping" />
                  )}
                  {isListening ? <MicOff className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
                </button>

                <div className="space-y-2">
                  <p className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
                    Tap <Mic size={14} className="text-emerald-600" /> to speak your farming question
                  </p>
                  <p className="text-xs text-slate-400 font-malayalam">
                    ചോദ്യം ചോദിക്കാൻ ടാപ്പ് ചെയ്യൂ
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript / Response Display */}
          <AnimatePresence>
            {(transcript || response) && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="w-full mt-8 space-y-4"
              >
                {transcript && (
                  <div className="text-right">
                    <span className="inline-block px-4 py-2 text-sm italic rounded-2xl bg-slate-100 text-slate-700">
                      "{transcript}"
                    </span>
                  </div>
                )}
                {response && (
                  <div className="text-left">
                    <div className="inline-block px-5 py-3 text-sm text-white shadow-lg rounded-2xl bg-emerald-600 shadow-emerald-100">
                      {response}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-grow h-px bg-slate-100" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">or type your question</span>
          <div className="flex-grow h-px bg-slate-100" />
        </div>

        {/* Text Input */}
        <div className="relative group">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'mal' ? 'മലയാളത്തിലോ ഇംഗ്ലീഷിലോ ടൈപ്പ് ചെയ്യൂ...' : 'Type in Malayalam or English...'}
            className="w-full py-4 pl-6 pr-16 text-sm transition-all border bg-slate-50 border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="absolute flex items-center justify-center w-12 text-white transition-colors right-2 top-2 bottom-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-slate-300"
          >
            <Send size={18} />
          </button>
        </div>

        {/* Bottom Status */}
        <div className="mt-8 flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1">
            <Globe size={10} />
            <span>Neural Engine v3.1</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <span>Real-time Sync</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantWidget;
