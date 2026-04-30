import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { NotoLogo } from '../components/NotoLogo'
import { PdfPageCanvas } from '../components/workspace/PdfPageCanvas'
import { workspaceStrings } from '../data/workspaceStrings'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { clearInsightCache } from '../lib/insight/insightCache'
import { matchTranscriptChunkToMarks } from '../lib/matchTranscriptToMarks'
import { extractAllTextBoxes } from '../lib/pdf/extractTextBoxes'
import { loadPdfDocument } from '../lib/pdf/loadPdfDocument'
import { bulletSummaryLines, topKeywordsFromTranscript } from '../lib/summaryFromTranscript'
import type { OverlayMark, PdfTextBox } from '../types/noto'
import './WorkspacePage.css'

const DEFAULT_SCALE = 1.35

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

  const handleScaleChange = (next: number) => {
    setScale(next)
    setMarks([])
    clearInsightCache()
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
    } catch {
      setPdfError('PDF를 불러오지 못했습니다.')
      setDoc(null)
      setNumPages(0)
    } finally {
      setPdfLoading(false)
    }
  }

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goNext = () => setCurrentPage((p) => Math.min(numPages, p + 1))

  const keywords = topKeywordsFromTranscript(speech.finalText, 10)
  const bullets = bulletSummaryLines(speech.finalText, 4)

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
            <p className="ws-placeholder">{workspaceStrings.noPdf}</p>
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
                    onClick={() => speech.start()}
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
                      clearInsightCache()
                    }}
                  >
                    {workspaceStrings.clearTranscript}
                  </button>
                </div>
                {speech.error ? <p className="ws-error">{speech.error}</p> : null}
                <div className="ws-transcript">
                  <p>{speech.finalText}</p>
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
