import { useCallback, useEffect, useRef, useState } from 'react'

export type SttUiState = {
  supported: boolean
  listening: boolean
  interim: string
  liveText: string
  finalText: string
  error: string | null
  status: string
  micLevel: number
  micActive: boolean
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
  const [micLevel, setMicLevel] = useState(0)
  const [micActive, setMicActive] = useState(false)
  const recRef = useRef<WebSpeechRecognition | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserFrameRef = useRef<number | null>(null)
  const restartTimerRef = useRef<number | null>(null)
  const shouldListenRef = useRef(false)
  const finalBufferRef = useRef('')
  const langRef = useRef(lang)
  const onFinalChunkRef = useRef(onFinalChunk)
  const startRecognitionRef = useRef<() => void>(() => {})

  useEffect(() => {
    langRef.current = lang
    onFinalChunkRef.current = onFinalChunk
  }, [lang, onFinalChunk])

  const stopMicMonitor = useCallback(() => {
    if (analyserFrameRef.current !== null) {
      window.cancelAnimationFrame(analyserFrameRef.current)
      analyserFrameRef.current = null
    }
    micStreamRef.current?.getTracks().forEach((track) => track.stop())
    micStreamRef.current = null
    void audioContextRef.current?.close()
    audioContextRef.current = null
    setMicLevel(0)
    setMicActive(false)
  }, [])

  const startMicMonitor = useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('이 브라우저는 마이크 접근을 지원하지 않습니다.')
      setStatus('마이크 접근 불가')
      return false
    }

    if (micStreamRef.current) return true

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const value of data) {
          const centered = value - 128
          sum += centered * centered
        }
        const rms = Math.sqrt(sum / data.length)
        setMicLevel(Math.min(1, rms / 32))
        analyserFrameRef.current = window.requestAnimationFrame(tick)
      }

      micStreamRef.current = stream
      audioContextRef.current = audioContext
      setMicActive(true)
      tick()
      return true
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? '마이크 권한이 거부되었습니다. 브라우저 주소창의 마이크 권한을 허용해주세요.'
          : '마이크를 열지 못했습니다. 입력 장치와 브라우저 권한을 확인해주세요.'
      setError(message)
      setStatus('마이크 오류')
      setMicActive(false)
      return false
    }
  }, [])

  const stop = useCallback(() => {
    shouldListenRef.current = false
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
    const rec = recRef.current
    recRef.current = null
    try {
      rec?.stop()
    } catch {
      /* already stopped */
    }
    setListening(false)
    setInterim('')
    setLiveText('')
    stopMicMonitor()
    setStatus('중지됨')
  }, [stopMicMonitor])

  const startRecognition = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setError('SpeechRecognition 미지원')
      setStatus('이 브라우저는 음성 인식을 지원하지 않습니다.')
      shouldListenRef.current = false
      return
    }
    if (recRef.current) return

    setError(null)
    const rec = new Ctor()
    rec.lang = langRef.current
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onstart = () => {
      setListening(true)
      setStatus('녹음 중')
    }

    rec.onaudiostart = () => {
      setStatus('녹음 중')
    }

    rec.onsoundstart = () => {
      setStatus('녹음 중')
    }

    rec.onspeechstart = () => {
      setStatus('녹음 중')
    }

    rec.onspeechend = () => {
      setStatus('녹음 중')
    }

    rec.onaudioend = () => {
      if (shouldListenRef.current) setStatus('녹음 중')
    }

    rec.onnomatch = () => {
      setStatus('녹음 중')
    }

    rec.onresult = (event: SpeechRecognitionEvent) => {
      setStatus('전사 수신됨')
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
          setLiveText(trimmed)
          onFinalChunkRef.current(trimmed)
        }
      }

      let interimLine = ''
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i]
        if (!res.isFinal) {
          interimLine += res[0]?.transcript ?? ''
        }
      }
      const live = interimLine.trim()
      setInterim(live)
      if (live) setLiveText(live)
    }

    rec.onerror = (ev: SpeechRecognitionErrorEvent) => {
      if (ev.error === 'aborted') return
      if (ev.error === 'no-speech') {
        setStatus('녹음 중')
        return
      }
      if (
        ev.error === 'not-allowed' ||
        ev.error === 'service-not-allowed' ||
        ev.error === 'audio-capture'
      ) {
        shouldListenRef.current = false
        setListening(false)
      }
      setStatus(`오류: ${ev.error}`)
      setError(ev.error)
    }

    rec.onend = () => {
      setInterim('')
      recRef.current = null
      if (!shouldListenRef.current) {
        setListening(false)
        return
      }
      setStatus('녹음 중')
      restartTimerRef.current = window.setTimeout(() => {
        restartTimerRef.current = null
        if (shouldListenRef.current) {
          startRecognitionRef.current()
        }
      }, 250)
    }

    recRef.current = rec
    try {
      rec.start()
      setListening(true)
      setStatus('녹음 중')
    } catch {
      shouldListenRef.current = false
      recRef.current = null
      setListening(false)
      setError('시작 실패')
      setStatus('시작 실패')
    }
  }, [])

  useEffect(() => {
    startRecognitionRef.current = startRecognition
  }, [startRecognition])

  const start = useCallback(async () => {
    shouldListenRef.current = true
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
    setStatus('마이크 확인 중')
    const micReady = await startMicMonitor()
    if (!micReady) {
      shouldListenRef.current = false
      return
    }
    startRecognitionRef.current()
  }, [startMicMonitor])

  useEffect(() => {
    return () => {
      shouldListenRef.current = false
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current)
      }
      try {
        recRef.current?.stop()
      } catch {
        /* already stopped */
      }
      stopMicMonitor()
    }
  }, [stopMicMonitor])

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
    micLevel,
    micActive,
    start,
    stop,
    resetTranscript,
    replaceTranscript,
  }
}
