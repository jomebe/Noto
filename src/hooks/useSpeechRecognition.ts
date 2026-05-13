import { useCallback, useRef, useState } from 'react'

export type SttUiState = {
  supported: boolean
  listening: boolean
  interim: string
  liveText: string
  finalText: string
  error: string | null
  status: string
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
  replaceTranscript: (text: string) => void
} {
  const [supported] = useState(() => getRecognitionCtor() !== null)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [liveText, setLiveText] = useState('')
  const [finalText, setFinalText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('대기 중')
  const recRef = useRef<WebSpeechRecognition | null>(null)
  const finalBufferRef = useRef('')

  const stop = useCallback(() => {
    recRef.current?.stop()
    recRef.current = null
    setListening(false)
    setInterim('')
    setLiveText('')
    setStatus('중지됨')
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setError('SpeechRecognition 미지원')
      setStatus('이 브라우저는 음성 인식을 지원하지 않습니다.')
      return
    }

    setError(null)
    setStatus('마이크 권한 확인 중')
    stop()

    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onstart = () => {
      setListening(true)
      setStatus('녹음 중')
    }

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let piece = ''
      let interimLine = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        const transcript = res[0]?.transcript ?? ''
        if (res.isFinal) {
          piece += transcript
        } else {
          interimLine += transcript
        }
      }

      const live = interimLine.trim()
      if (live) {
        setInterim(live)
        setLiveText(live)
        setStatus('실시간 인식 중')
      }

      const trimmed = piece.trim()
      if (trimmed) {
        finalBufferRef.current = `${finalBufferRef.current} ${trimmed}`.trim()
        setFinalText(finalBufferRef.current)
        setInterim('')
        setLiveText(trimmed)
        setStatus('전사 수신됨')
        onFinalChunk(trimmed)
      }
    }

    rec.onerror = (ev: SpeechRecognitionErrorEvent) => {
      if (ev.error === 'aborted' || ev.error === 'no-speech') return
      setStatus(`오류: ${ev.error}`)
      setError(ev.error)
    }

    rec.onend = () => {
      setListening(false)
      setInterim('')
      recRef.current = null
      setStatus('중지됨')
    }

    recRef.current = rec
    try {
      rec.start()
      setListening(true)
      setStatus('녹음 중')
    } catch {
      setError('시작 실패')
      setStatus('시작 실패')
    }
  }, [lang, onFinalChunk, stop])

  const resetTranscript = useCallback(() => {
    finalBufferRef.current = ''
    setFinalText('')
    setInterim('')
    setLiveText('')
    setError(null)
    setStatus('대기 중')
  }, [])

  const replaceTranscript = useCallback((text: string) => {
    const next = text.trim()
    finalBufferRef.current = next
    setFinalText(next)
    setInterim('')
    setLiveText(next)
    setError(null)
    setStatus(next ? '수동 전사 입력됨' : '대기 중')
  }, [])

  return {
    supported,
    listening,
    interim,
    liveText,
    finalText,
    error,
    status,
    start,
    stop,
    resetTranscript,
    replaceTranscript,
  }
}
