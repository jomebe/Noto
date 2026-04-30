import type { PDFPageProxy, PageViewport } from 'pdfjs-dist'
import type { PdfTextBox } from '../../types/noto'

function textItemToViewportRect(
  viewport: PageViewport,
  transform: number[],
  width: number,
  height: number,
): { left: number; top: number; width: number; height: number } {
  const x = transform[4]
  const y = transform[5]
  const w = width
  const h = height || Math.max(Math.abs(transform[3]), 8)
  const p1 = viewport.convertToViewportPoint(x, y)
  const p2 = viewport.convertToViewportPoint(x + w, y + h)
  const left = Math.min(p1[0], p2[0])
  const top = Math.min(p1[1], p2[1])
  return {
    left,
    top,
    width: Math.abs(p2[0] - p1[0]) || 4,
    height: Math.abs(p2[1] - p1[1]) || 4,
  }
}

export async function extractTextBoxesForPage(
  page: PDFPageProxy,
  pageIndex: number,
  scale: number,
): Promise<PdfTextBox[]> {
  const viewport = page.getViewport({ scale })
  const textContent = await page.getTextContent()
  const out: PdfTextBox[] = []

  for (const item of textContent.items) {
    if (!('str' in item) || typeof item.str !== 'string') continue
    const s = item.str.trim()
    if (!s) continue
    const height =
      typeof item.height === 'number' && item.height > 0 ? item.height : 0
    const rect = textItemToViewportRect(
      viewport,
      item.transform,
      item.width,
      height,
    )
    out.push({
      pageIndex,
      text: s,
      ...rect,
    })
  }

  return out
}

export async function extractAllTextBoxes(
  pageCount: number,
  getPage: (n: number) => Promise<PDFPageProxy>,
  scale: number,
): Promise<PdfTextBox[]> {
  const all: PdfTextBox[] = []
  for (let i = 1; i <= pageCount; i++) {
    const page = await getPage(i)
    const boxes = await extractTextBoxesForPage(page, i - 1, scale)
    all.push(...boxes)
  }
  return all
}
