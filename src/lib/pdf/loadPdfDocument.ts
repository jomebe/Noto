import { getDocument, type PDFDocumentProxy } from 'pdfjs-dist'
import { setupPdfWorker } from '../../pdf/setupPdfWorker'

export async function loadPdfDocument(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  setupPdfWorker()
  const loadingTask = getDocument({ data: new Uint8Array(data) })
  return loadingTask.promise
}
