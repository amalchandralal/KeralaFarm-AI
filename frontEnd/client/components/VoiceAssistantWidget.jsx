import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, Loader2, Play, Pause, RotateCcw, VolumeX, Download } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { askVoiceAssistant } from '../services/api';

const LANG = 'en-IN';

const VoiceAssistantWidget = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', role: 'ai', content: 'Hello! I am your AgroVision assistant. How can I help you today?' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const {
    isListening, 
    isSpeaking,
    isPaused,
    hasSpokenText,
    interimText, 
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    replaySpeaking
  } = useVoice({
    lang: LANG,
    onResult: (text) => handleTranscriptionComplete(text),
    onError: (msg) => {
      setError(msg);
      setIsProcessing(false);
    },
  });

  const handleTranscriptionComplete = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: text }]);
    
    setIsProcessing(true);
    setError("");
    
    try {
      const data = await askVoiceAssistant(text);
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: data.answer }]);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] font-sans bg-white dark:bg-slate-900 transition-colors duration-200">
      
      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/60 relative">
        {messages.length > 1 && (
          <div className="sticky top-0 z-10 flex justify-end mb-4">
            <button
              onClick={() => {
                const guide = {
                  id: `custom-voice-${Date.now()}`,
                  title: `Voice Assistant Chat - ${new Date().toLocaleDateString()}`,
                  category: 'Voice Assistant',
                  iconName: 'Mic',
                  size: 'Custom',
                  content: messages.map(m => `${m.role === 'user' ? 'You' : 'AgroVision AI'}: ${m.content}`)
                };
                const custom = JSON.parse(localStorage.getItem('custom_offline_guides') || '[]');
                localStorage.setItem('custom_offline_guides', JSON.stringify([guide, ...custom]));
                
                const downloaded = new Set(JSON.parse(localStorage.getItem('downloaded_guides') || '[]'));
                downloaded.add(guide.id);
                localStorage.setItem('downloaded_guides', JSON.stringify([...downloaded]));
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-sm transition-colors"
            >
              <Download size={14} />
              Save Chat Offline
            </button>
          </div>
        )}
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {/* Interim text preview */}
          {isListening && interimText && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700/70 dark:text-emerald-300/70 border border-emerald-100/50 dark:border-emerald-900/40 italic">
                {interimText}...
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Loader2 size={16} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                Thinking...
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center my-2">
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full">{error}</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          
          {/* Mic Button */}
          <button 
            onClick={() => {
              setError('');
              if (isListening) stopListening();
              else startListening();
            }}
            className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full transition-all ${
              isListening 
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shadow-sm border border-rose-200 dark:border-rose-800' 
                : 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600'
            }`}
            title={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <Square size={20} className="fill-current" />
            ) : (
              <Mic size={24} />
            )}
            {isListening && (
              <span className="absolute w-14 h-14 rounded-full border-2 border-rose-500/30 animate-ping" />
            )}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className={`w-full h-11 pl-4 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${(isSpeaking || hasSpokenText) ? 'pr-32' : 'pr-12'}`}
              disabled={isListening || isProcessing}
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              
              {/* Audio Controls */}
              {isSpeaking && !isPaused && (
                <button 
                  onClick={pauseSpeaking}
                  title="Pause Audio"
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-700 rounded-md transition-colors"
                >
                  <Pause size={16} />
                </button>
              )}
              {isSpeaking && isPaused && (
                <button 
                  onClick={resumeSpeaking}
                  title="Resume Audio"
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-700 rounded-md transition-colors"
                >
                  <Play size={16} />
                </button>
              )}
              {isSpeaking && (
                <button 
                  onClick={stopSpeaking}
                  title="Stop Audio"
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-700 rounded-md transition-colors"
                >
                  <VolumeX size={16} />
                </button>
              )}
              {!isSpeaking && hasSpokenText && (
                <button 
                  onClick={replaySpeaking}
                  title="Replay Last Answer"
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-700 rounded-md transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
              )}

              {/* Send Button */}
              <button 
                onClick={handleManualSend}
                disabled={!inputText.trim() || isListening || isProcessing}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Helper Text */}
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {isListening ? 'Listening...' : 'Tap the microphone to speak'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default VoiceAssistantWidget;