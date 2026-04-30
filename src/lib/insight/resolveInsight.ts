import type { OverlayMark } from '../../types/noto'

function buildFallbackInsight(mark: OverlayMark): string {
  const t = mark.transcriptSnippet
  const m = mark.matchedText
  return [
    `PDF 구간 「${m.slice(0, 48)}${m.length > 48 ? '…' : ''}」와 전사가 연결되었습니다.`,
    t
      ? `최근 전사 맥락: ${t.slice(0, 120)}${t.length > 120 ? '…' : ''}`
      : '전사 맥락이 짧습니다. 조금 더 길게 설명하면 인사이트가 풍부해집니다.',
  ].join(' ')
}

export async function resolveInsight(mark: OverlayMark): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  if (!apiKey?.trim()) {
    return buildFallbackInsight(mark)
  }

  const model =
    (import.meta.env.VITE_OPENAI_MODEL as string | undefined)?.trim() || 'gpt-4o-mini'

  const body = {
    model,
    messages: [
      {
        role: 'system' as const,
        content:
          '당신은 강의 복습 도우미입니다. 한국어로 2~4문장, 핵심만 간결히 설명합니다.',
      },
      {
        role: 'user' as const,
        content: `다음은 PDF에서 집은 짧은 문구와, 강사 전사의 최근 맥락입니다. 학습자에게 도움이 되는 보충 설명을 써 주세요.\n\n[PDF 발췌]\n${mark.matchedText}\n\n[전사 맥락]\n${mark.transcriptSnippet}`,
      },
    ],
    max_tokens: 220,
    temperature: 0.4,
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return buildFallbackInsight(mark)
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const text = data.choices?.[0]?.message?.content?.trim()
    return text && text.length > 0 ? text : buildFallbackInsight(mark)
  } catch {
    return buildFallbackInsight(mark)
  }
}
