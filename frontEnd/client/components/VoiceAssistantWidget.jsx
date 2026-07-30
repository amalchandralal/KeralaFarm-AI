
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Send, Loader2, Globe } from 'lucide-react';
import { useVoice } from '../hooks/useVoice'; // Adjust path
import { askVoiceAssistant } from '../services/api'; // Adjust path

const LANG = 'en-IN';

const VoiceAssistantWidget = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Initialize Voice Hook
  const { 
    isListening, 
    interimText, 
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking 
  } = useVoice({
    lang: LANG,
    onResult: (text) => handleTranscriptionComplete(text),
    onError: (msg) => {
      setError(msg);
      setIsProcessing(false);
    },
  });

  const handleTranscriptionComplete = async (text) => {
    if (!text) return;
    setIsProcessing(true);
    setResponse("");
    
    try {
      const data = await askVoiceAssistant(text);
      setResponse(data.answer);
      speak(data.answer, LANG);
    } catch (err) {
      setError("Failed to get response. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSend = () => {
    if (!inputText.trim()) return;
    handleTranscriptionComplete(inputText);
    setInputText('');
  };

  return (
    <div className="w-full max-w-md p-4 mx-auto">
      <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative overflow-hidden min-h-[550px] flex flex-col">
        
        {/* Interaction Area */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20" />
                  <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase text-emerald-600 animate-pulse">
                  Analyzing Question...
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center w-full text-center"
              >
                {/* Mic Button - Matches Image */}
                <button 
                  onClick={isListening ? stopListening : startListening}
                  className={`
                    relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500 mb-6
                    ${isListening 
                      ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' 
                      : 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105'}
                  `}
                >
                  {isListening && (
                    <div className="absolute inset-0 border-4 rounded-full border-white/30 animate-ping" />
                  )}
                  {isListening ? (
                    <Square className="w-10 h-10 text-white fill-current" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>

                <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  {isListening ? (
                    <span className="font-medium text-red-500 animate-pulse">Listening to you...</span>
                  ) : (
                    <>Tap <Mic size={14} className="text-emerald-600" /> to speak your farming question</>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript / Response Display */}
          <div className="w-full mt-6 space-y-4">
            {/* Real-time transcription preview */}
            {isListening && interimText && (
              <p className="text-sm italic text-center text-slate-400">"{interimText}..."</p>
            )}

            {/* Error Message */}
            {error && <p className="text-xs text-center text-red-500">{error}</p>}

            {/* Final AI Response Bubble - EXACT MATCH TO SCREENSHOT */}
            {response && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#059669] text-white p-5 rounded-2xl shadow-lg shadow-emerald-100 relative"
              >
                <p className="text-sm leading-relaxed">{response}</p>
                {/* Speech Control */}
                <button 
                    onClick={stopSpeaking} 
                    className="absolute p-1 bg-white border rounded-full shadow-md -top-2 -right-2 text-emerald-600"
                >
                    <X size={12}/>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Form Bottom Section */}
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-grow h-px bg-slate-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">or type your question</span>
            <div className="flex-grow h-px bg-slate-100" />
          </div>

          <div className="relative">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSend()}
              placeholder="Type your question..."
              className="w-full py-4 pl-6 pr-16 text-sm border bg-slate-50 border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button 
              onClick={handleManualSend}
              disabled={!inputText.trim() || isProcessing}
              className="absolute flex items-center justify-center w-12 text-white transition-colors right-2 top-2 bottom-2 bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:bg-slate-300"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Footer Status - Matches Image */}
          <div className="mt-6 flex justify-center items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-1">
              <Globe size={10} />
              <span>Neural Engine v3.1</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Real-time Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantWidget;