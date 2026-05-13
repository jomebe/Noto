import type { OverlayMark } from '../../types/noto'
import { normalizeToken, tokenizeTranscript } from '../normalizeText'

function trimText(text: string, max: number): string {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  return cleaned.length > max ? `${cleaned.slice(0, max)}…` : cleaned
}

function pickContextSentence(mark: OverlayMark): string {
  const snippet = mark.transcriptSnippet.replace(/\s+/g, ' ').trim()
  if (!snippet) return ''

  const markTokens = tokenizeTranscript(mark.matchedText)
    .map(normalizeToken)
    .filter((token) => token.length >= 2)

  const sentences = snippet
    .split(/(?<=[.!?。！？])\s+|(?<=요)\s+|(?<=다)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const matched = sentences.find((sentence) => {
    const normalized = normalizeToken(sentence)
    return markTokens.some((token) => normalized.includes(token))
  })

  return trimText(matched ?? snippet, 130)
}

function localInsight(mark: OverlayMark): string {
  const term = trimText(mark.matchedText, 42)
  const context = pickContextSentence(mark)

  if (mark.kind === 'important') {
    return context
      ? `「${term}」는 강의에서 중요하게 다뤄진 부분입니다. 전사 맥락상 "${context}" 흐름과 연결되므로, 복습할 때 정의와 이유를 먼저 확인하세요.`
      : `「${term}」는 강조 표현이나 반복 언급을 근거로 중요 표시된 부분입니다. 복습할 때 먼저 확인할 후보로 남겨두세요.`
  }

  return context
    ? `「${term}」에는 강의 중 보충 설명이 붙은 것으로 보입니다. "${context}" 내용을 함께 보면 교재 문구만 읽을 때보다 개념의 쓰임을 더 빠르게 떠올릴 수 있습니다.`
    : `「${term}」는 PDF 문구와 강의 전사가 연결된 보충 설명 후보입니다. 관련 전사를 더 길게 남기면 요약 품질이 좋아집니다.`
}

export async function resolveInsight(mark: OverlayMark): Promise<string> {
  return localInsight(mark)
}
