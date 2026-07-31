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
    <div className="flex flex-col h-[600px] font-sans">
      
      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 relative">
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
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 shadow-sm transition-colors"
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
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' 
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {/* Interim text preview */}
          {isListening && interimText && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-emerald-50/50 text-emerald-700/70 border border-emerald-100/50 italic">
                {interimText}...
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-white text-gray-500 border border-gray-200 shadow-sm">
                <Loader2 size={16} className="animate-spin text-emerald-600" />
                Thinking...
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center my-2">
              <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">{error}</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          
          {/* Mic Button */}
          <button 
            onClick={isListening ? stopListening : startListening}
            className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full transition-all ${
              isListening 
                ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
                : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
            }`}
            title={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <Square size={20} className="fill-current" />
            ) : (
              <Mic size={24} />
            )}
            {isListening && (
              <span className="absolute w-14 h-14 rounded-full border-2 border-red-500/30 animate-ping" />
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
              className={`w-full h-11 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${(isSpeaking || hasSpokenText) ? 'pr-32' : 'pr-12'}`}
              disabled={isListening || isProcessing}
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              
              {/* Audio Controls */}
              {isSpeaking && !isPaused && (
                <button 
                  onClick={pauseSpeaking}
                  title="Pause Audio"
                  className="p-2 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  <Pause size={16} />
                </button>
              )}
              {isSpeaking && isPaused && (
                <button 
                  onClick={resumeSpeaking}
                  title="Resume Audio"
                  className="p-2 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  <Play size={16} />
                </button>
              )}
              {isSpeaking && (
                <button 
                  onClick={stopSpeaking}
                  title="Stop Audio"
                  className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-md transition-colors"
                >
                  <VolumeX size={16} />
                </button>
              )}
              {!isSpeaking && hasSpokenText && (
                <button 
                  onClick={replaySpeaking}
                  title="Replay Last Answer"
                  className="p-2 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
              )}

              {/* Send Button */}
              <button 
                onClick={handleManualSend}
                disabled={!inputText.trim() || isListening || isProcessing}
                className="p-2 text-gray-400 hover:text-emerald-600 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Helper Text */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400 font-mono">
            {isListening ? 'Listening...' : 'Tap the microphone to speak'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default VoiceAssistantWidget;