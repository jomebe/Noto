const fallback = (payload) => {
  const matchedText = String(payload?.matchedText ?? '').slice(0, 80)
  const transcriptSnippet = String(payload?.transcriptSnippet ?? '').slice(0, 180)
  const kind = payload?.kind === 'important' ? '중요하게 다룬' : '보충 설명과 연결된'
  return `${kind} PDF 문구입니다. 「${matchedText}」를 중심으로 복습하고, 전사 맥락(${transcriptSnippet})에서 강사가 덧붙인 설명을 함께 확인하세요.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  const payload = req.body ?? {}

  if (!apiKey) {
    res.status(200).json({ insight: fallback(payload), source: 'fallback' })
    return
  }

  const matchedText = String(payload.matchedText ?? '').trim().slice(0, 500)
  const transcriptSnippet = String(payload.transcriptSnippet ?? '').trim().slice(0, 1200)
  const kind = payload.kind === 'important' ? '중요 하이라이트' : '보충 설명'
  const reason = String(payload.reason ?? '').trim().slice(0, 300)

  if (!matchedText && !transcriptSnippet) {
    res.status(400).json({ error: 'Missing insight payload' })
    return
  }

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              '당신은 한국어 강의 복습 도우미입니다. 학생이 PDF 하이라이트에 마우스를 올렸을 때 볼 설명을 씁니다. 2~3문장, 과장 없이 핵심만 설명하세요.',
          },
          {
            role: 'user',
            content: [
              `[하이라이트 종류]\n${kind}`,
              `[PDF 문구]\n${matchedText}`,
              `[전사 맥락]\n${transcriptSnippet}`,
              `[표시 근거]\n${reason}`,
            ].join('\n\n'),
          },
        ],
        max_tokens: 220,
        temperature: 0.35,
      }),
    })

    if (!openaiRes.ok) {
      res.status(200).json({ insight: fallback(payload), source: 'fallback' })
      return
    }

    const data = await openaiRes.json()
    const insight = data?.choices?.[0]?.message?.content?.trim()
    res.status(200).json({
      insight: insight || fallback(payload),
      source: insight ? 'openai' : 'fallback',
    })
  } catch {
    res.status(200).json({ insight: fallback(payload), source: 'fallback' })
  }
}
