import { normalizeToken, tokenizeTranscript } from './normalizeText'

export function topKeywordsFromTranscript(text: string, limit: number): string[] {
  const tokens = tokenizeTranscript(text)
  const counts = new Map<string, number>()
  for (const raw of tokens) {
    const k = normalizeToken(raw)
    if (k.length < 2) continue
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => k)
}

export function bulletSummaryLines(text: string, maxLines: number): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  const parts = cleaned.split(/(?<=[.!?。])\s+/).filter((p) => p.length > 4)
  if (parts.length === 0) {
    return [cleaned.slice(0, 200) + (cleaned.length > 200 ? '…' : '')].slice(0, maxLines)
  }
  const pick = [...parts.slice(0, Math.max(1, maxLines - 1)), parts[parts.length - 1]]
  const uniq = [...new Set(pick)]
  return uniq.slice(0, maxLines)
}
