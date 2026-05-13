import type { OverlayMark } from '../../types/noto'

function buildFallbackInsight(mark: OverlayMark): string {
  const t = mark.transcriptSnippet
  const m = mark.matchedText
  const prefix =
    mark.kind === 'important'
      ? '강사가 중요하게 다룬 것으로 보이는 구간입니다.'
      : '강의 설명이 교재 문구와 연결된 구간입니다.'
  return [
    `${prefix} PDF의 「${m.slice(0, 48)}${m.length > 48 ? '…' : ''}」와 전사가 연결되었습니다.`,
    t
      ? `최근 전사 맥락: ${t.slice(0, 120)}${t.length > 120 ? '…' : ''}`
      : '전사 맥락이 짧습니다. 조금 더 길게 설명하면 인사이트가 풍부해집니다.',
  ].join(' ')
}

export async function resolveInsight(mark: OverlayMark): Promise<string> {
  try {
    const res = await fetch('/api/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchedText: mark.matchedText,
        transcriptSnippet: mark.transcriptSnippet,
        kind: mark.kind,
        reason: mark.reason,
      }),
    })

    if (!res.ok) {
      return buildFallbackInsight(mark)
    }

    const data = (await res.json()) as {
      insight?: string
    }
    const text = data.insight?.trim()
    return text && text.length > 0 ? text : buildFallbackInsight(mark)
  } catch {
    return buildFallbackInsight(mark)
  }
}
