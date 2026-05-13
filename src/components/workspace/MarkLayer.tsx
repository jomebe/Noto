import { useCallback, useId, useState } from 'react'
import type { OverlayMark } from '../../types/noto'
import { resolveInsight } from '../../lib/insight/resolveInsight'
import { getCachedInsight, setCachedInsight } from '../../lib/insight/insightCache'
import { workspaceStrings } from '../../data/workspaceStrings'

type MarkLayerProps = {
  marks: OverlayMark[]
}

type Pop = {
  mark: OverlayMark
  text: string
  x: number
  y: number
  placement: 'below' | 'above'
}

export function MarkLayer({ marks }: MarkLayerProps) {
  const [pop, setPop] = useState<Pop | null>(null)
  const popId = useId()

  const close = useCallback(() => setPop(null), [])

  const openForMark = useCallback(
    async (el: HTMLElement, mark: OverlayMark) => {
      const rect = el.getBoundingClientRect()
      const pad = 12
      const tooltipWidth = Math.min(360, window.innerWidth - pad * 2)
      let x = rect.left + rect.width / 2
      const estimatedH = 160
      let placement: 'below' | 'above' = 'below'
      let y = rect.bottom + pad
      if (y + estimatedH > window.innerHeight - pad) {
        placement = 'above'
        y = rect.top - pad
      }
      const minX = pad + tooltipWidth / 2
      const maxX = window.innerWidth - pad - tooltipWidth / 2
      if (x < minX) x = minX
      if (x > maxX) x = maxX

      const cached = getCachedInsight(mark.id)
      if (cached) {
        setPop({ mark, text: cached, x, y, placement })
        return
      }

      setPop({
        mark,
        text: workspaceStrings.insightLoading,
        x,
        y,
        placement,
      })
      try {
        const text = await resolveInsight(mark)
        setCachedInsight(mark.id, text)
        setPop({ mark, text, x, y, placement })
      } catch {
        const msg = '인사이트를 불러오지 못했습니다.'
        setCachedInsight(mark.id, msg)
        setPop({ mark, text: msg, x, y, placement })
      }
    },
    [],
  )

  return (
    <>
      <div className="pdf-page__marks" aria-hidden={marks.length === 0}>
        {marks.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`pdf-mark pdf-mark--${m.kind}`}
            style={{
              left: m.left,
              top: m.top,
              width: m.width,
              height: m.height,
            }}
            aria-label={m.kind === 'important' ? '중요 하이라이트' : '보충 설명 하이라이트'}
            onMouseEnter={(e) => void openForMark(e.currentTarget, m)}
            onMouseLeave={close}
            onFocus={(e) => void openForMark(e.currentTarget, m)}
            onBlur={close}
          />
        ))}
      </div>

      {pop ? (
        <div
          id={popId}
          role="tooltip"
          className={`pdf-insight pdf-insight--${pop.placement}`}
          style={{ left: pop.x, top: pop.y }}
        >
          <span className={`pdf-insight__label pdf-insight__label--${pop.mark.kind}`}>
            {pop.mark.kind === 'important' ? '중요 하이라이트' : '보충 설명'}
          </span>
          <strong className="pdf-insight__term">{pop.mark.matchedText}</strong>
          <p className="pdf-insight__body">{pop.text}</p>
          <p className="pdf-insight__meta">
            신뢰도 {Math.round(pop.mark.confidence * 100)}% · {pop.mark.reason}
          </p>
        </div>
      ) : null}
    </>
  )
}
