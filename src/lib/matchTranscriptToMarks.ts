import { markingRules } from '../config/markingRules'
import { normalizeToken, tokenizeTranscript } from './normalizeText'
import type { OverlayMark, PdfTextBox } from '../types/noto'

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `m-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function boxMatchesToken(box: PdfTextBox, token: string): boolean {
  const nt = normalizeToken(token)
  if (nt.length < markingRules.minTokenLength) return false
  const nb = normalizeToken(box.text)
  if (!nb) return false
  return nb.includes(nt) || nt.includes(nb)
}

function chunkHasStarTrigger(chunk: string): boolean {
  return markingRules.starTriggers.some((w) => chunk.includes(w))
}

export function matchTranscriptChunkToMarks(
  finalChunk: string,
  boxes: PdfTextBox[],
  existing: OverlayMark[],
): OverlayMark[] {
  const tokens = tokenizeTranscript(finalChunk)
  const wantStar = chunkHasStarTrigger(finalChunk)
  const added: OverlayMark[] = []
  const seen = new Set(
    existing.map((m) => `${m.pageIndex}:${Math.round(m.left)}:${Math.round(m.top)}`),
  )

  const countOnPage = (pageIndex: number) =>
    existing.filter((m) => m.pageIndex === pageIndex).length +
    added.filter((m) => m.pageIndex === pageIndex).length

  for (const token of tokens) {
    if (normalizeToken(token).length < markingRules.minTokenLength) continue
    for (const box of boxes) {
      if (!boxMatchesToken(box, token)) continue
      const key = `${box.pageIndex}:${Math.round(box.left)}:${Math.round(box.top)}`
      if (seen.has(key)) continue
      if (countOnPage(box.pageIndex) >= markingRules.maxMarksPerPage) continue
      if (existing.length + added.length >= markingRules.maxMarksTotal) break

      const kind = wantStar ? 'star' : 'link'
      added.push({
        id: newId(),
        pageIndex: box.pageIndex,
        left: box.left,
        top: box.top,
        width: Math.max(box.width, 8),
        height: Math.max(box.height, 8),
        kind,
        matchedText: box.text,
        transcriptSnippet: finalChunk.trim().slice(-160),
      })
      seen.add(key)
      break
    }
  }

  return added
}
