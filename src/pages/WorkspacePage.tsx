import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { NotoLogo } from '../components/NotoLogo'
import { PdfPageCanvas } from '../components/workspace/PdfPageCanvas'
import { workspaceStrings } from '../data/workspaceStrings'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { clearInsightCache } from '../lib/insight/insightCache'
import { matchTranscriptChunkToMarks } from '../lib/matchTranscriptToMarks'
import { normalizeToken } from '../lib/normalizeText'
import { extractAllTextBoxes } from '../lib/pdf/extractTextBoxes'
import { loadPdfDocument } from '../lib/pdf/loadPdfDocument'
import { bulletSummaryLines, topKeywordsFromTranscript } from '../lib/summaryFromTranscript'
import type { OverlayMark, PdfTextBox } from '../types/noto'
import './WorkspacePage.css'

const DEFAULT_SCALE = 1.35

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function findUpdatedBox(mark: OverlayMark, boxes: PdfTextBox[]): PdfTextBox | null {
  const markText = normalizeToken(mark.matchedText)
  return (
    boxes.find(
      (box) =>
        box.pageIndex === mark.pageIndex &&
        normalizeToken(box.text) === markText,
    ) ??
    boxes.find((box) => {
      const boxText = normalizeToken(box.text)
      return (
        box.pageIndex === mark.pageIndex &&
        (boxText.includes(markText) || markText.includes(boxText))
      )
    }) ??
    null
  )
}

export default function WorkspacePage() {
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(DEFAULT_SCALE)
  const [boxes, setBoxes] = useState<PdfTextBox[]>([])
  const [marks, setMarks] = useState<OverlayMark[]>([])
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const boxesRef = useRef<PdfTextBox[]>([])

  useEffect(() => {
    boxesRef.current = boxes
  }, [boxes])

  const onFinalChunk = useCallback((chunk: string) => {
    setMarks((prev) => {
      const next = matchTranscriptChunkToMarks(chunk, boxesRef.current, prev)
      if (next.length === 0) return prev
      return [...prev, ...next]
    })
  }, [])

  const speech = useSpeechRecognition('ko-KR', onFinalChunk)

  useEffect(() => {
    if (!speech.listening) return
    const id = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [speech.listening])

  useEffect(() => {
    if (!doc) {
      startTransition(() => setBoxes([]))
      return
    }
    let cancelled = false
    void (async () => {
      setExtracting(true)
      try {
        const b = await extractAllTextBoxes(
          doc.numPages,
          (n) => doc.getPage(n),
          scale,
        )
        if (!cancelled) setBoxes(b)
      } catch {
        if (!cancelled) setBoxes([])
      } finally {
        if (!cancelled) setExtracting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [doc, scale])

  useEffect(() => {
    if (boxes.length === 0 || marks.length === 0) return
    const frame = window.requestAnimationFrame(() => {
      setMarks((prev) => {
        let changed = false
        const next = prev.map((mark) => {
          const box = findUpdatedBox(mark, boxes)
          if (!box) return mark
          if (
            Math.abs(mark.left - box.left) < 0.5 &&
            Math.abs(mark.top - box.top) < 0.5 &&
            Math.abs(mark.width - box.width) < 0.5 &&
            Math.abs(mark.height - box.height) < 0.5
          ) {
            return mark
          }
          changed = true
          return {
            ...mark,
            left: box.left,
            top: box.top,
            width: Math.max(box.width, 8),
            height: Math.max(box.height, 8),
          }
        })
        return changed ? next : prev
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [boxes, marks.length])

  const handleScaleChange = (next: number) => {
    setScale(next)
  }

  const handleFile = async (file: File | null) => {
    if (!file || file.type !== 'application/pdf') {
      setPdfError('PDF 파일만 업로드할 수 있습니다.')
      return
    }
    setPdfError(null)
    setPdfLoading(true)
    setBoxes([])
    setMarks([])
    clearInsightCache()
    try {
      const buf = await file.arrayBuffer()
      const loaded = await loadPdfDocument(buf)
      setDoc(loaded)
      setNumPages(loaded.numPages)
      setCurrentPage(1)
      setPdfName(file.name)
    } catch (error) {
      console.error('PDF 로드 실패:', error)
      setPdfError('PDF를 불러오지 못했습니다. 파일이 올바른 형식인지 확인해주세요.')
      setDoc(null)
      setNumPages(0)
    } finally {
      setPdfLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      void handleFile(files[0])
    }
  }

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goNext = () => setCurrentPage((p) => Math.min(numPages, p + 1))

  const keywords = topKeywordsFromTranscript(speech.finalText, 10)
  const bullets = bulletSummaryLines(speech.finalText, 4)
  const importantCount = marks.filter((mark) => mark.kind === 'important').length
  const explanationCount = marks.filter((mark) => mark.kind === 'explanation').length
  const statusLabel = !doc
    ? 'PDF 대기'
    : extracting
      ? '텍스트 분석'
      : speech.listening
        ? '녹음 중'
        : marks.length > 0
          ? '하이라이트 생성'
          : '준비 완료'

  const exportTxt = () => {
    const blob = new Blob([speech.finalText || '(비어 있음)'], {
      type: 'text/plain;charset=utf-8',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${pdfName ?? 'noto'}-transcript.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="ws">
      <header className="ws-nav">
        <Link to="/" className="ws-nav__brand">
          <NotoLogo size={36} />
          <span>{workspaceStrings.backHome}</span>
        </Link>
        <span className="ws-nav__title">{workspaceStrings.title}</span>
      </header>

      <section className="ws-studio-head">
        <div>
          <p className="ws-kicker">PDF Lecture Workspace</p>
          <h1>PDF를 올리고 수업을 들으면, 중요한 부분이 바로 표시됩니다.</h1>
          <p>
            브라우저 마이크 전사를 PDF 텍스트와 매칭해 핵심 개념을 노란/초록
            하이라이트로 정리합니다.
          </p>
        </div>
        <div className="ws-live-card" aria-label="현재 작업 상태">
          <span className={`ws-live-dot${speech.listening ? ' ws-live-dot--on' : ''}`} />
          <strong>{statusLabel}</strong>
          <span>{formatDuration(recordingSeconds)}</span>
        </div>
      </section>

      <div className="ws-layout">
        <section className="ws-main" aria-label="PDF 뷰어">
          <div className="ws-toolbar">
            <label className="noto-btn noto-btn--primary ws-upload">
              <input
                type="file"
                accept="application/pdf"
                className="ws-upload__input"
                onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
              />
              {workspaceStrings.uploadLabel}
            </label>
            {pdfName ? <span className="ws-filename">{pdfName}</span> : null}
            {pdfLoading ? <span className="ws-status">불러오는 중…</span> : null}
            {extracting ? <span className="ws-status">텍스트 분석 중…</span> : null}
            {pdfError ? <span className="ws-error">{pdfError}</span> : null}
          </div>

          <div className="ws-scale">
            <label htmlFor="ws-scale">{workspaceStrings.scaleLabel}</label>
            <input
              id="ws-scale"
              type="range"
              min={1}
              max={2.2}
              step={0.05}
              value={scale}
              onChange={(e) => handleScaleChange(Number(e.target.value))}
            />
            <span>{scale.toFixed(2)}×</span>
          </div>

          {!doc ? (
            <label
              className="ws-placeholder"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                className="ws-upload__input"
                onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
              />
              <span className="ws-placeholder__icon">PDF</span>
              <strong>{workspaceStrings.noPdf}</strong>
              <p>
                교재 PDF를 선택하거나 이 영역으로 끌어오세요. 업로드 후 바로
                녹음을 시작할 수 있습니다.
              </p>
            </label>
          ) : (
            <>
              <div className="ws-pagebar">
                <button
                  type="button"
                  className="noto-btn noto-btn--ghost"
                  disabled={currentPage <= 1}
                  onClick={goPrev}
                >
                  {workspaceStrings.prevPage}
                </button>
                <span className="ws-pagebar__label">
                  {workspaceStrings.pageIndicator(currentPage, numPages)}
                </span>
                <button
                  type="button"
                  className="noto-btn noto-btn--ghost"
                  disabled={currentPage >= numPages}
                  onClick={goNext}
                >
                  {workspaceStrings.nextPage}
                </button>
              </div>
              <div className="ws-canvas-wrap">
                <PdfPageCanvas
                  doc={doc}
                  pageNumber={currentPage}
                  scale={scale}
                  marks={marks}
                />
              </div>
            </>
          )}
        </section>

        <aside className="ws-side" aria-label="전사 및 요약">
          <div className="ws-panel ws-panel--stats">
            <div>
              <span>중요</span>
              <strong>{importantCount}</strong>
            </div>
            <div>
              <span>설명</span>
              <strong>{explanationCount}</strong>
            </div>
            <div>
              <span>PDF 텍스트</span>
              <strong>{boxes.length}</strong>
            </div>
          </div>

          <div className="ws-panel">
            <h2 className="ws-panel__title">{workspaceStrings.transcriptHeading}</h2>
            {!speech.supported ? (
              <p className="ws-muted">{workspaceStrings.sttUnsupported}</p>
            ) : (
              <>
                <p className="ws-hint">{workspaceStrings.sttHint}</p>
                <div className="ws-row">
                  <button
                    type="button"
                    className="noto-btn noto-btn--primary"
                    disabled={!doc || speech.listening}
                    onClick={() => {
                      setRecordingSeconds(0)
                      speech.start()
                    }}
                  >
                    {workspaceStrings.listenStart}
                  </button>
                  <button
                    type="button"
                    className="noto-btn noto-btn--ghost"
                    disabled={!speech.listening}
                    onClick={() => speech.stop()}
                  >
                    {workspaceStrings.listenStop}
                  </button>
                  <button
                    type="button"
                    className="noto-btn noto-btn--ghost"
                    onClick={() => {
                      speech.resetTranscript()
                      setMarks([])
                      setRecordingSeconds(0)
                      clearInsightCache()
                    }}
                  >
                    {workspaceStrings.clearTranscript}
                  </button>
                </div>
                <div className={`ws-wave${speech.listening ? ' ws-wave--active' : ''}`} aria-hidden>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                {speech.error ? <p className="ws-error">{speech.error}</p> : null}
                <div className="ws-transcript">
                  <p>{speech.finalText || '녹음을 시작하면 전사 내용이 여기에 쌓입니다.'}</p>
                  {speech.interim ? <p className="ws-interim">{speech.interim}</p> : null}
                </div>
                <button type="button" className="noto-btn noto-btn--ghost" onClick={exportTxt}>
                  {workspaceStrings.exportTranscript}
                </button>
              </>
            )}
          </div>

          <div className="ws-panel">
            <h2 className="ws-panel__title">{workspaceStrings.summaryHeading}</h2>
            <p className="ws-muted">{workspaceStrings.keywordsLabel}</p>
            <ul className="ws-keywords">
              {keywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
            <ul className="ws-bullets">
              {bullets.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
