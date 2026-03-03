import { useState, useRef, useCallback } from 'react'

type AnyWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognition
  webkitSpeechRecognition?: new () => SpeechRecognition
}

interface UseVoiceOptions {
  lang?: string
  onResult?: (text: string) => void
  onError?: (error: string) => void
}

export const useVoice = ({ lang = 'ml-IN', onResult, onError }: UseVoiceOptions = {}) => {
  const [isListening, setIsListening]   = useState(false)
  const [interimText, setInterimText]   = useState('')
  const [transcript, setTranscript]     = useState('')

  const recognitionRef  = useRef<SpeechRecognition | null>(null)
  const accumulated     = useRef('')
  const silenceTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restartTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const active          = useRef(false)
  const langRef         = useRef(lang)
  langRef.current = lang

  // Track whether we've already fallen back to browser TTS to prevent double playback
  const ttsAborted      = useRef(false)
  const isSpeaking      = useRef(false)

  const clearTimers = () => {
    if (silenceTimer.current)  { clearTimeout(silenceTimer.current);  silenceTimer.current  = null }
    if (restartTimer.current)  { clearTimeout(restartTimer.current);  restartTimer.current  = null }
  }

  const commit = useCallback((text: string) => {
    clearTimers()
    active.current = false
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimText('')
    setTranscript(text)
    onResult?.(text)
  }, [onResult])

  const scheduleSilenceCommit = useCallback((text: string) => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current)
    silenceTimer.current = setTimeout(() => {
      if (text.trim()) commit(text.trim())
    }, 2000)
  }, [commit])

  const createAndStart = useCallback(() => {
    const w = window as AnyWindow
    const Cls = w.SpeechRecognition || w.webkitSpeechRecognition
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

    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      let final   = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t + ' '
        else interim += t
      }
      if (final) {
        accumulated.current = (accumulated.current + final).trim()
        setInterimText(accumulated.current)
        scheduleSilenceCommit(accumulated.current)
      } else if (interim) {
        setInterimText((accumulated.current + ' ' + interim).trim())
        if (silenceTimer.current) clearTimeout(silenceTimer.current)
      }
    }

    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return
      active.current = false
      setIsListening(false)
      clearTimers()
      const msgs: Record<string, string> = {
        'not-allowed'         : '🔒 Microphone blocked. Click the lock icon in your browser address bar → Allow microphone.',
        'audio-capture'       : '🎙️ No microphone found. Please connect one.',
        'network'             : '🌐 Network error. Check your internet connection.',
        'service-not-allowed' : 'Please use Google Chrome or Microsoft Edge.',
      }
      onError?.(msgs[e.error] ?? `Voice error: ${e.error}`)
    }

    r.onend = () => {
      if (active.current) {
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
  }, [onError, scheduleSilenceCommit])

  const startListening = useCallback(() => {
    accumulated.current = ''
    active.current      = true
    clearTimers()
    setInterimText('')
    setTranscript('')
    setIsListening(false)
    createAndStart()
  }, [createAndStart])

  const stopListening = useCallback(() => {
    clearTimers()
    active.current = false
    const text = accumulated.current.trim()
    if (text) commit(text)
    else {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
  }, [commit])

  const speak = useCallback((text: string, speakLang = 'ml-IN') => {
    // ── Cancel everything first ──────────────────────────────────────────────
    window.speechSynthesis.cancel()
    const w = window as unknown as { _ttsAudio?: HTMLAudioElement }
    if (w._ttsAudio) {
      w._ttsAudio.onended = null   // detach handlers BEFORE pausing
      w._ttsAudio.onerror = null   //  so they can't fire after cancel
      w._ttsAudio.pause()
      w._ttsAudio.src = ''
      w._ttsAudio = undefined
    }

    // Malayalam — proxy through backend, uses Google TTS voice
    if (speakLang === 'ml-IN' || speakLang === 'ml') {
      const MAX = 180
      const rawChunks = text.match(/[^.!?।\n]{1,180}[.!?।\n]?/g) || [text]
      const chunks: string[] = []
      let cur = ''
      for (const s of rawChunks) {
        if ((cur + s).length > MAX) { if (cur) chunks.push(cur.trim()); cur = s }
        else cur += s
      }
      if (cur.trim()) chunks.push(cur.trim())

      // Reset abort flag for this new speak() call
      ttsAborted.current = false
      isSpeaking.current = true

      let idx = 0

      const fallbackToBrowser = (fromIdx: number) => {
        // Guard: only fall back once — prevents double audio
        if (ttsAborted.current) return
        ttsAborted.current = true

        // Stop any audio element that may still be alive
        const wa = window as unknown as { _ttsAudio?: HTMLAudioElement }
        if (wa._ttsAudio) {
          wa._ttsAudio.onended = null
          wa._ttsAudio.onerror = null
          wa._ttsAudio.pause()
          wa._ttsAudio.src = ''
          wa._ttsAudio = undefined
        }

        // Cancel any browser TTS that might have snuck in
        window.speechSynthesis.cancel()

        const remaining = chunks.slice(fromIdx).join(' ')
        if (!remaining.trim()) return

        const utt = new SpeechSynthesisUtterance(remaining)
        utt.lang  = 'ml-IN'
        utt.rate  = 0.75
        window.speechSynthesis.speak(utt)
      }

      const playNext = () => {
        // If we already fell back to browser TTS, stop the audio chain
        if (ttsAborted.current) return
        if (idx >= chunks.length) return

        const chunkIdx = idx        // capture before increment
        const chunk    = chunks[idx++]

        const url   = `http://localhost:5000/tts?text=${encodeURIComponent(chunk)}&lang=ml`
        const audio = new Audio(url)
        ;(window as unknown as { _ttsAudio: HTMLAudioElement })._ttsAudio = audio

        audio.onended = () => {
          if (ttsAborted.current) return
          playNext()
        }

        audio.onerror = () => {
          // Backend failed — fall back to browser TTS for remaining text
          fallbackToBrowser(chunkIdx)
        }

        audio.play().catch(() => {
          // play() rejected (e.g. autoplay policy) — fall back
          fallbackToBrowser(chunkIdx)
        })
      }

      playNext()
      return
    }

    // English — browser TTS
    const utt   = new SpeechSynthesisUtterance(text)
    utt.lang    = speakLang
    utt.rate    = 0.85
    utt.pitch   = 1
    const tick  = setInterval(() => { if (window.speechSynthesis.speaking) window.speechSynthesis.resume() }, 10000)
    utt.onend   = () => clearInterval(tick)
    utt.onerror = () => clearInterval(tick)
    window.speechSynthesis.speak(utt)
  }, [])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel()
    const w = window as unknown as { _ttsAudio?: HTMLAudioElement }
    if (w._ttsAudio) {
      w._ttsAudio.onended = null
      w._ttsAudio.onerror = null
      w._ttsAudio.pause()
      w._ttsAudio.src = ''
      w._ttsAudio = undefined
    }
    ttsAborted.current = true
    isSpeaking.current = false
  }, [])

  const pauseSpeaking = useCallback(() => {
    window.speechSynthesis.pause()
    const w = window as unknown as { _ttsAudio?: HTMLAudioElement }
    if (w._ttsAudio) w._ttsAudio.pause()
    isSpeaking.current = false
  }, [])

  const resumeSpeaking = useCallback(() => {
    window.speechSynthesis.resume()
    const w = window as unknown as { _ttsAudio?: HTMLAudioElement }
    if (w._ttsAudio) w._ttsAudio.play()
    isSpeaking.current = true
  }, [])

  return { isListening, interimText, transcript, startListening, stopListening, speak, stopSpeaking, pauseSpeaking, resumeSpeaking, setTranscript }
}
