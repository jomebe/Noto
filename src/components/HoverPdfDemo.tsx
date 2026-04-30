import { useCallback, useId, useState } from 'react'
import type { HoverDemoParagraph, HoverDemoSection } from '../data/siteContent'

type HoverPdfDemoProps = {
  section: HoverDemoSection
}

type PopoverState = {
  x: number
  y: number
  placement: 'below' | 'above'
  paragraph: HoverDemoParagraph
} | null

export function HoverPdfDemo({ section }: HoverPdfDemoProps) {
  const [open, setOpen] = useState<PopoverState>(null)
  const popoverId = useId()

  const close = useCallback(() => setOpen(null), [])

  const openForMark = useCallback(
    (el: HTMLElement, paragraph: HoverDemoParagraph) => {
      if (!paragraph.mark) return
      const rect = el.getBoundingClientRect()
      const pad = 12
      let x = rect.left + rect.width / 2
      const estimatedW = 280
      const estimatedH = 140
      let placement: 'below' | 'above' = 'below'
      let y = rect.bottom + pad
      if (x + estimatedW / 2 > window.innerWidth - pad) {
        x = window.innerWidth - estimatedW / 2 - pad
      }
      if (x - estimatedW / 2 < pad) {
        x = estimatedW / 2 + pad
      }
      if (y + estimatedH > window.innerHeight - pad) {
        placement = 'above'
        y = rect.top - pad
      }
      setOpen({ x, y, placement, paragraph })
    },
    [],
  )

  return (
    <div className="hover-demo">
      <p className="hover-demo__hint">{section.hint}</p>
      <div className="hover-demo__sheet" role="article" aria-label={section.docTitle}>
        <header className="hover-demo__sheet-head">
          <span className="hover-demo__dot" />
          <span className="hover-demo__dot" />
          <span className="hover-demo__title">{section.docTitle}</span>
        </header>
        <div className="hover-demo__body">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="hover-demo__para">
              {p.mark ? (
                <>
                  <span
                    className="hover-demo__mark"
                    tabIndex={0}
                    aria-describedby={open?.paragraph === p ? popoverId : undefined}
                    onMouseEnter={(e) => openForMark(e.currentTarget, p)}
                    onMouseLeave={close}
                    onFocus={(e) => openForMark(e.currentTarget, p)}
                    onBlur={close}
                  >
                    {p.text}
                  </span>
                </>
              ) : (
                p.text
              )}
            </p>
          ))}
        </div>
      </div>

      {open?.paragraph.mark ? (
        <div
          id={popoverId}
          role="tooltip"
          className={`hover-demo__popover hover-demo__popover--${open.placement}`}
          style={{ left: open.x, top: open.y }}
        >
          <span className="hover-demo__popover-tag">{open.paragraph.mark.label}</span>
          <p className="hover-demo__popover-text">{open.paragraph.mark.insight}</p>
        </div>
      ) : null}
    </div>
  )
}
