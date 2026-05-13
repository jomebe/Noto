import { markingRules } from '../config/markingRules'
import { normalizeToken, tokenizeTranscript } from './normalizeText'
import type { MarkKind, OverlayMark, PdfTextBox } from '../types/noto'

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

function chunkHasAny(chunk: string, words: readonly string[]): boolean {
  return words.some((w) => chunk.includes(w))
}

function isUsefulToken(token: string): boolean {
  const normalized = normalizeToken(token)
  if (normalized.length < markingRules.minTokenLength) return false
  if (/^\d+$/.test(normalized)) return false
  return !markingRules.stopwords.some((word) => normalized.includes(normalizeToken(word)))
}

function previousMentionCount(token: string, existing: OverlayMark[]): number {
  const normalized = normalizeToken(token)
  return existing.filter((mark) => normalizeToken(mark.matchedText).includes(normalized))
    .length
}

function classifyMark(chunk: string, token: string, existing: OverlayMark[]): {
  kind: MarkKind
  confidence: number
  reason: string
} {
  const hasImportantCue = chunkHasAny(chunk, markingRules.importantTriggers)
  const hasExplanationCue = chunkHasAny(chunk, markingRules.explanationTriggers)
  const repeated = previousMentionCount(token, existing) > 0

  if (hasImportantCue || repeated) {
    return {
      kind: 'important',
      confidence: hasImportantCue && repeated ? 0.88 : hasImportantCue ? 0.8 : 0.72,
      reason: hasImportantCue
        ? '강조 표현이 포함된 전사 구간과 PDF 문구가 일치했습니다.'
        : '같은 개념이 반복 언급되어 중요도가 높다고 판단했습니다.',
    }
  }

  return {
    kind: 'explanation',
    confidence: hasExplanationCue ? 0.74 : 0.62,
    reason: hasExplanationCue
      ? '예시·비유·정리 표현이 포함된 설명 구간과 연결했습니다.'
      : '강의 전사와 PDF 문구가 의미 있게 겹쳐 보충 설명 후보로 표시했습니다.',
  }
}

export function matchTranscriptChunkToMarks(
  finalChunk: string,
  boxes: PdfTextBox[],
  existing: OverlayMark[],
): OverlayMark[] {
  const tokens = tokenizeTranscript(finalChunk).filter(isUsefulToken)
  const added: OverlayMark[] = []
  const seen = new Set(
    existing.map((m) => `${m.pageIndex}:${Math.round(m.left)}:${Math.round(m.top)}`),
  )

  const countOnPage = (pageIndex: number) =>
    existing.filter((m) => m.pageIndex === pageIndex).length +
    added.filter((m) => m.pageIndex === pageIndex).length

  const uniqueTokens = [...new Set(tokens.map(normalizeToken))].slice(
    0,
    markingRules.maxMarksPerChunk,
  )

  for (const token of uniqueTokens) {
    for (const box of boxes) {
      if (!boxMatchesToken(box, token)) continue
      const key = `${box.pageIndex}:${Math.round(box.left)}:${Math.round(box.top)}`
      if (seen.has(key)) continue
      if (countOnPage(box.pageIndex) >= markingRules.maxMarksPerPage) continue
      if (existing.length + added.length >= markingRules.maxMarksTotal) break

      const classification = classifyMark(finalChunk, token, existing)
      added.push({
        id: newId(),
        pageIndex: box.pageIndex,
        left: box.left,
        top: box.top,
        width: Math.max(box.width, 8),
        height: Math.max(box.height, 8),
        kind: classification.kind,
        matchedText: box.text,
        transcriptSnippet: finalChunk.trim().slice(-160),
        confidence: classification.confidence,
        reason: classification.reason,
      })
      seen.add(key)
      break
    }
  }

  return added
}
