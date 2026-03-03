import React, { useState, useEffect, useRef } from 'react'
import { useVoice } from '../hooks/useVoice'
import { askVoiceAssistant } from '../services/api'

/* ─── tiny markdown-to-plain stripper so AI response looks clean ─── */
const stripMarkdown = (txt: string) =>
  txt
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '')
    .trim()

export default function VoiceAssistantWidget() {
  const [question,   setQuestion]   = useState('')
  const [answer,     setAnswer]     = useState('')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [lang,       setLang]       = useState<'ml-IN' | 'en-IN'>('ml-IN')
  const [seconds,    setSeconds]    = useState(0)
  const [isPaused,   setIsPaused]   = useState(false)
  const [isSpeakingState, setIsSpeakingState] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── recording clock ── */
  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startClock = () => {
    setSeconds(0)
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }
  const stopClock = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  /* ── call backend ── */
  const sendQuestion = async (text: string) => {
    if (!text.trim()) return
    setLoading(true); setError(''); setAnswer('')
    try {
      const data = await askVoiceAssistant(text)
      const clean = stripMarkdown(data.answer || '')
      setAnswer(clean)
      setIsSpeakingState(true)
      setIsPaused(false)
      speak(clean, lang)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── voice hook ── */
  const { isListening, interimText, startListening, stopListening, speak,
          stopSpeaking, pauseSpeaking, resumeSpeaking } = useVoice({
    lang,
    onResult: (text) => { stopClock(); setQuestion(text); sendQuestion(text) },
    onError:  (msg)  => { stopClock(); setError(msg) },
  })

  /* sync clock with mic state */
  useEffect(() => { isListening ? startClock() : stopClock() }, [isListening])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const changeLang = (l: 'ml-IN' | 'en-IN') => {
    if (isListening) stopListening()
    setLang(l); setError('')
  }

  const handleStop = () => {
    stopSpeaking()
    setIsSpeakingState(false)
    setIsPaused(false)
  }

  const handlePause = () => {
    pauseSpeaking()
    setIsPaused(true)
  }

  const handleResume = () => {
    resumeSpeaking()
    setIsPaused(false)
  }

  const handleReadAloud = () => {
    setIsSpeakingState(true)
    setIsPaused(false)
    speak(answer, lang)
  }

  /* ──────────────────────── render ──────────────────────── */
  return (
    <div className="space-y-5">

      {/* ── Language toggle ── */}
      <div className="flex justify-center gap-3">
        {(['ml-IN', 'en-IN'] as const).map(l => (
          <button key={l} onClick={() => changeLang(l)}
            className={`px-6 py-2.5 rounded-xl font-semibold text-base transition-all ${
              lang === l
                ? 'bg-forest-600 text-white shadow-md scale-105'
                : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
            }`}>
            {l === 'ml-IN' ? 'മലയാളം' : 'English'}
          </button>
        ))}
      </div>

      {/* ── Big mic button ── */}
      <div className="flex flex-col items-center gap-3 py-2">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={loading}
          className={`relative w-36 h-36 rounded-full flex items-center justify-center text-6xl
            shadow-2xl transition-all duration-200 select-none outline-none
            focus:ring-4 focus:ring-forest-300
            ${isListening
              ? 'bg-red-500 hover:bg-red-600 pulse-animate'
              : loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-forest-600 hover:bg-forest-700 active:scale-95 cursor-pointer'
            }`}
        >
          {isListening ? '⏹' : '🎤'}
        </button>

        {/* Recording badge */}
        {isListening && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono font-bold text-red-600">{fmt(seconds)}</span>
            <span className="text-sm text-red-500">Recording — tap ⏹ to stop</span>
          </div>
        )}

        {/* Hint text */}
        <p className="text-sm text-center text-gray-500">
          {isListening ? 'Speak freely — stops automatically after silence'
            : loading    ? 'Sending to AI…'
            : 'Tap 🎤 to speak your farming question'}
        </p>
        <p className="text-xs text-center text-gray-400" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
          {isListening ? 'സംസാരിക്കൂ — ⏹ ടാപ്പ് ചെയ്ത് നിർത്താം'
            : loading    ? 'AI-ലേക്ക് അയക്കുന്നു…'
            : 'ചോദ്യം ചോദിക്കാൻ  ടാപ്പ് ചെയ്യൂ'}
        </p>
      </div>

      {/* ── Live transcript (what the mic hears) ── */}
      {isListening && (
        <div className={`rounded-xl p-4 border-2 min-h-[64px] transition-all ${
          interimText
            ? 'bg-blue-50 border-blue-300'
            : 'bg-gray-50 border-dashed border-gray-300'
        }`}>
          <p className="text-xs font-semibold mb-1 flex items-center gap-1.5 text-blue-500">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            {interimText ? 'Hearing you…' : 'Waiting for speech…'}
          </p>
          <p className="text-blue-900 font-medium text-base leading-relaxed min-h-[24px]">
            {interimText || <span className="text-sm italic text-gray-400">Start speaking…</span>}
          </p>
        </div>
      )}

      {/* ── Captured question (after mic stops) ── */}
      {question && !isListening && (
        <div className="p-4 border bg-forest-50 border-forest-200 rounded-xl">
          <p className="mb-1 text-xs font-bold tracking-wide uppercase text-forest-600">📝 Your Question</p>
          <p className="text-base font-medium text-forest-900">{question}</p>
        </div>
      )}

      {/* ── Type instead of speaking ── */}
      <div>
        <p className="text-xs text-gray-400 mb-1.5 text-center">— or type your question —</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={e => { setQuestion(e.target.value); setAnswer(''); setError('') }}
            onKeyDown={e => e.key === 'Enter' && !loading && question.trim() && sendQuestion(question)}
            placeholder="Type in Malayalam or English…"
            className="flex-1 input-field"
            disabled={isListening}
          />
          <button
            onClick={() => sendQuestion(question)}
            disabled={loading || !question.trim() || isListening}
            className="btn-primary px-5 min-w-[52px] flex items-center justify-center disabled:opacity-50"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              : '→'}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-xl">
          <span className="text-xl mt-0.5"></span>
          <div>
            <p className="text-sm font-medium text-red-700">{error}</p>
            {error.includes('blocked') && (
              <p className="mt-1 text-xs text-red-500">
                Click the 🔒 icon in Chrome's address bar → Site settings → Microphone → Allow
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Loading spinner ── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="border-4 rounded-full w-7 h-7 border-forest-500 border-t-transparent animate-spin" />
          <div>
            <p className="font-semibold text-forest-700">Getting answer from AI…</p>
            <p className="text-xs text-forest-400" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>AI ഉത്തരം തിരയുന്നു…</p>
          </div>
        </div>
      )}

      {/* ── AI Answer ── */}
      {answer && !loading && (
        <div className="p-5 border-2 bg-gradient-to-br from-forest-50 to-earth-50 border-forest-200 rounded-2xl fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl"></span>
              <p className="text-lg font-bold text-forest-800">AI Answer</p>
            </div>

            {/* ── Playback controls ── */}
            <div className="flex items-center gap-2">
              {!isSpeakingState && (
                <button
                  onClick={handleReadAloud}
                  className="flex items-center gap-1.5 text-sm font-medium text-forest-600
                    hover:text-white hover:bg-forest-600 bg-forest-100 px-3 py-1.5 rounded-lg transition-all"
                >
                   Read aloud
                </button>
              )}

              {isSpeakingState && !isPaused && (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-1.5 text-sm font-medium text-yellow-700
                    hover:text-white hover:bg-yellow-500 bg-yellow-100 px-3 py-1.5 rounded-lg transition-all"
                >
                   Pause
                </button>
              )}

              {isSpeakingState && isPaused && (
                <button
                  onClick={handleResume}
                  className="flex items-center gap-1.5 text-sm font-medium text-forest-600
                    hover:text-white hover:bg-forest-600 bg-forest-100 px-3 py-1.5 rounded-lg transition-all"
                >
                   Resume
                </button>
              )}

              {isSpeakingState && (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600
                    hover:text-white hover:bg-red-500 bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                >
                   Stop
                </button>
              )}
            </div>
          </div>
          <p className="text-base leading-relaxed text-gray-800 whitespace-pre-line">{answer}</p>
        </div>
      )}

    </div>
  )
}