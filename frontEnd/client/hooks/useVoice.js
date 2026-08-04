import { useState, useRef, useCallback, useEffect } from 'react'

export const useVoice = ({ lang = 'en-IN', onResult, onError } = {}) => {
  const [isListening, setIsListening]   = useState(false)
  const [isSpeaking, setIsSpeaking]     = useState(false)
  const [isPaused, setIsPaused]         = useState(false)
  const [hasSpokenText, setHasSpokenText] = useState(false)
  const lastSpokenText = useRef('')
  const remainingTextRef = useRef('')
  const currentLang = useRef('en-IN')
  const isManuallyPaused = useRef(false)
  const [interimText, setInterimText]   = useState('')
  const [transcript, setTranscript]     = useState('')

  const recognitionRef  = useRef(null)
  const accumulated     = useRef('')
  const latestTextRef   = useRef('')
  const silenceTimer    = useRef(null)
  const restartTimer    = useRef(null)
  const active          = useRef(false)
  const langRef         = useRef(lang)
  langRef.current = lang

  const clearTimers = () => {
    if (silenceTimer.current)  { clearTimeout(silenceTimer.current);  silenceTimer.current  = null }
    if (restartTimer.current)  { clearTimeout(restartTimer.current);  restartTimer.current  = null }
  }

  const commit = useCallback((text) => {
    clearTimers()
    active.current = false
    try { recognitionRef.current?.stop() } catch {}
    setIsListening(false)
    setInterimText('')
    const cleanText = text.trim()
    if (cleanText) {
      setTranscript(cleanText)
      onResult?.(cleanText)
    }
  }, [onResult])

  const scheduleSilenceCommit = useCallback((text) => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current)
    silenceTimer.current = setTimeout(() => {
      if (text && text.trim()) {
        commit(text.trim())
      }
    }, 1200) // 1.2s silence detection
  }, [commit])

  const createAndStart = useCallback(() => {
    const Cls = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Cls) {
      onError?.('Speech recognition not supported. Please use Google Chrome.')
      return
    }

    const r = new Cls()
    r.lang            = langRef.current
    r.continuous      = true
    r.interimResults  = true
    r.maxAlternatives = 1
    recognitionRef.current = r

    r.onstart = () => setIsListening(true)

    r.onresult = (e) => {
      let interim = ''
      let final   = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t + ' '
        else interim += t
      }

      if (final) {
        accumulated.current = (accumulated.current + ' ' + final).trim()
      }

      const fullCurrentText = (accumulated.current + ' ' + interim).trim()
      if (fullCurrentText) {
        latestTextRef.current = fullCurrentText
        setInterimText(fullCurrentText)
        scheduleSilenceCommit(fullCurrentText)
      }
    }

    r.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted' || e.error === 'network') {
        const spoken = latestTextRef.current || accumulated.current
        if (spoken && spoken.trim()) {
          commit(spoken.trim())
          return
        }
        active.current = false
        setIsListening(false)
        clearTimers()
        return
      }
      active.current = false
      setIsListening(false)
      clearTimers()
      const msgs = {
        'not-allowed'         : 'Microphone blocked. Click the lock icon in your browser address bar → Allow microphone.',
        'audio-capture'       : 'No microphone found. Please connect one.',
        'service-not-allowed' : 'Please use Google Chrome or Microsoft Edge.',
      }
      onError?.(msgs[e.error] ?? `Voice error: ${e.error}`)
    }

    r.onend = () => {
      if (active.current) {
        const spoken = latestTextRef.current || accumulated.current
        if (spoken && spoken.trim()) {
          commit(spoken.trim())
          return
        }
        restartTimer.current = setTimeout(() => {
          if (active.current) {
            try { r.start() } catch { setIsListening(false) }
          }
        }, 100)
      } else {
        setIsListening(false)
      }
    }

    try { r.start() } catch { onError?.('Could not start microphone. Please try again.') }
  }, [onError, scheduleSilenceCommit, commit])

  const startListening = useCallback(() => {
    accumulated.current  = ''
    latestTextRef.current = ''
    active.current       = true
    clearTimers()
    setInterimText('')
    setTranscript('')
    setIsListening(false)
    createAndStart()
  }, [createAndStart])

  const stopListening = useCallback(() => {
    clearTimers()
    active.current = false
    const text = (latestTextRef.current || accumulated.current).trim()
    if (text) {
      commit(text)
    } else {
      try { recognitionRef.current?.stop() } catch {}
      setIsListening(false)
    }
  }, [commit])

  const startUtterance = useCallback((text, lang) => {
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = lang
    utt.rate = 0.85
    utt.pitch = 1

    utt.onboundary = (e) => {
      if (e.name === 'word') {
        remainingTextRef.current = text.substring(e.charIndex)
      }
    }

    const tick = setInterval(() => { 
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume() 
      }
    }, 10000)

    utt.onend = () => { 
      clearInterval(tick)
      if (!isManuallyPaused.current) {
        setIsSpeaking(false)
        setIsPaused(false)
      }
    }
    utt.onerror = () => { 
      clearInterval(tick)
      if (!isManuallyPaused.current) {
        setIsSpeaking(false)
        setIsPaused(false)
      }
    }
    window.speechSynthesis.speak(utt)
  }, [])

  const speak = useCallback((text, speakLang = 'en-IN') => {
    isManuallyPaused.current = false
    window.speechSynthesis.cancel()
    setIsSpeaking(true)
    setIsPaused(false)
    setHasSpokenText(true)
    lastSpokenText.current = text
    remainingTextRef.current = text
    currentLang.current = speakLang
    
    startUtterance(text, speakLang)
  }, [startUtterance])

  const stopSpeaking = useCallback(() => {
    isManuallyPaused.current = false
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [])

  const pauseSpeaking = useCallback(() => {
    isManuallyPaused.current = true
    window.speechSynthesis.cancel() // Immediately kills audio to avoid lag
    setIsPaused(true)
  }, [])

  const resumeSpeaking = useCallback(() => {
    isManuallyPaused.current = false
    setIsPaused(false)
    if (remainingTextRef.current) {
      startUtterance(remainingTextRef.current, currentLang.current)
    }
  }, [startUtterance])

  const replaySpeaking = useCallback(() => {
    if (lastSpokenText.current) {
      speak(lastSpokenText.current, currentLang.current)
    }
  }, [speak])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { 
    isListening, isSpeaking, isPaused, hasSpokenText, 
    interimText, transcript, startListening, stopListening, 
    speak, stopSpeaking, pauseSpeaking, resumeSpeaking, replaySpeaking, setTranscript 
  }
}