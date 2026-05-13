interface SpeechRecognitionAlternative {
  readonly transcript: string
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
}

interface WebSpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  onaudiostart: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onaudioend: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onsoundstart: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onsoundend: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onspeechstart: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onspeechend: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onstart: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onresult: ((this: WebSpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
  onerror:
    | ((this: WebSpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null
  onend: ((this: WebSpeechRecognition, ev: Event) => void) | null
  onnomatch: ((this: WebSpeechRecognition, ev: Event) => void) | null
}

type SpeechRecognitionCtor = new () => WebSpeechRecognition

interface Window {
  SpeechRecognition?: SpeechRecognitionCtor
  webkitSpeechRecognition?: SpeechRecognitionCtor
  webkitAudioContext?: typeof AudioContext
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
