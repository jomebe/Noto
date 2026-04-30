import { useCallback, useRef, useState } from 'react'

export type SttUiState = {
  supported: boolean
  listening: boolean
  interim: string
  finalText: string
  error: string | null
}

function getRecognitionCtor(): (new () => WebSpeechRecognition) | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition(
  lang: string,
  onFinalChunk: (chunk: string) => void,
): SttUiState & {
  start: () => void
  stop: () => void
  resetTranscript: () => void
} {
  const [supported] = useState(() => getRecognitionCtor() !== null)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [finalText, setFinalText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recRef = useRef<WebSpeechRecognition | null>(null)
  const finalBufferRef = useRef('')

  const stop = useCallback(() => {
    recRef.current?.stop()
    recRef.current = null
    setListening(false)
    setInterim('')
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setError('SpeechRecognition 미지원')
      return
    }
    setError(null)
    stop()
    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let piece = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        const transcript = res[0]?.transcript ?? ''
        if (res.isFinal) {
          piece += transcript
        }
      }
      if (piece) {
        const trimmed = piece.trim()
        if (trimmed) {
          finalBufferRef.current = `${finalBufferRef.current} ${trimmed}`.trim()
          setFinalText(finalBufferRef.current)
          onFinalChunk(trimmed)
        }
      }

      let interimLine = ''
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i]
        if (!res.isFinal) {
          interimLine += res[0]?.transcript ?? ''
        }
      }
      setInterim(interimLine.trim())
    }

    rec.onerror = (ev: SpeechRecognitionErrorEvent) => {
      if (ev.error === 'aborted' || ev.error === 'no-speech') return
      setError(ev.error)
    }

    rec.onend = () => {
      setListening(false)
      setInterim('')
      recRef.current = null
    }

    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setError('시작 실패')
    }
  }, [lang, onFinalChunk, stop])

  const resetTranscript = useCallback(() => {
    finalBufferRef.current = ''
    setFinalText('')
    setInterim('')
    setError(null)
  }, [])

  return {
    supported,
    listening,
    interim,
    finalText,
    error,
    start,
    stop,
    resetTranscript,
  }
}
