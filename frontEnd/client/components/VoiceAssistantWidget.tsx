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
  const [question, setQuestion] = useState('')
  const [answer,   setAnswer]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [lang,     setLang]     = useState<'ml-IN' | 'en-IN'>('ml-IN')
  const [seconds,  setSeconds]  = useState(0)
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
      speak(clean, lang)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── voice hook ── */
  const { isListening, interimText, startListening, stopListening, speak } = useVoice({
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

  /* ──────────────────────── render ──────────────────────── */
  return (
    <div className="space-y-5">

      {/* ── Language toggle ── */}
      <div className="flex gap-3 justify-center">
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
            <span className="text-red-500 text-sm">Recording — tap ⏹ to stop</span>
          </div>
        )}

        {/* Hint text */}
        <p className="text-center text-gray-500 text-sm">
          {isListening ? 'Speak freely — stops automatically after silence'
            : loading    ? 'Sending to AI…'
            : 'Tap 🎤 to speak your farming question'}
        </p>
        <p className="text-center text-gray-400 text-xs" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
          {isListening ? 'സംസാരിക്കൂ — ⏹ ടാപ്പ് ചെയ്ത് നിർത്താം'
            : loading    ? 'AI-ലേക്ക് അയക്കുന്നു…'
            : 'ചോദ്യം ചോദിക്കാൻ 🎤 ടാപ്പ് ചെയ്യൂ'}
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
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {interimText ? 'Hearing you…' : 'Waiting for speech…'}
          </p>
          <p className="text-blue-900 font-medium text-base leading-relaxed min-h-[24px]">
            {interimText || <span className="text-gray-400 italic text-sm">Start speaking…</span>}
          </p>
        </div>
      )}

      {/* ── Captured question (after mic stops) ── */}
      {question && !isListening && (
        <div className="bg-forest-50 border border-forest-200 rounded-xl p-4">
          <p className="text-xs text-forest-600 font-bold uppercase tracking-wide mb-1">📝 Your Question</p>
          <p className="text-forest-900 font-medium text-base">{question}</p>
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
            className="input-field flex-1"
            disabled={isListening}
          />
          <button
            onClick={() => sendQuestion(question)}
            disabled={loading || !question.trim() || isListening}
            className="btn-primary px-5 min-w-[52px] flex items-center justify-center disabled:opacity-50"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : '→'}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="text-red-700 font-medium text-sm">{error}</p>
            {error.includes('blocked') && (
              <p className="text-red-500 text-xs mt-1">
                Click the 🔒 icon in Chrome's address bar → Site settings → Microphone → Allow
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Loading spinner ── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="w-7 h-7 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-forest-700 font-semibold">Getting answer from AI…</p>
            <p className="text-forest-400 text-xs" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>AI ഉത്തരം തിരയുന്നു…</p>
          </div>
        </div>
      )}

      {/* ── AI Answer ── */}
      {answer && !loading && (
        <div className="bg-gradient-to-br from-forest-50 to-earth-50 border-2 border-forest-200 rounded-2xl p-5 fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <p className="font-bold text-forest-800 text-lg">AI Answer</p>
            </div>
            <button
              onClick={() => speak(answer, lang)}
              className="flex items-center gap-1.5 text-sm font-medium text-forest-600
                hover:text-white hover:bg-forest-600 bg-forest-100 px-3 py-1.5 rounded-lg transition-all"
            >
              🔊 Read aloud
            </button>
          </div>
          <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">{answer}</p>
        </div>
      )}

    </div>
  )
}
