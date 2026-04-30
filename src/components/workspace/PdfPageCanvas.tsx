import { useEffect, useRef } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { OverlayMark } from '../../types/noto'
import { MarkLayer } from './MarkLayer'

type PdfPageCanvasProps = {
  doc: PDFDocumentProxy
  pageNumber: number
  scale: number
  marks: OverlayMark[]
}

export function PdfPageCanvas({ doc, pageNumber, scale, marks }: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const taskRef = useRef<{ cancel?: () => void } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false

    void (async () => {
      const page = await doc.getPage(pageNumber)
      const viewport = page.getViewport({ scale })
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
        canvas,
      })
      taskRef.current = renderTask
      try {
        await renderTask.promise
      } catch {
        /* cancelled */
      }
      if (cancelled) return
    })()

    return () => {
      cancelled = true
      taskRef.current?.cancel?.()
      taskRef.current = null
    }
  }, [doc, pageNumber, scale])

  const pageMarks = marks.filter((m) => m.pageIndex === pageNumber - 1)

  return (
    <div className="pdf-page">
      <canvas ref={canvasRef} className="pdf-page__canvas" />
      <MarkLayer marks={pageMarks} />
    </div>
  )
}
