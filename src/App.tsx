import { useEffect } from 'react'
import { HoverPdfDemo } from './components/HoverPdfDemo'
import { NotoLogo } from './components/NotoLogo'
import { siteContent } from './data/siteContent'
import './App.css'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  useEffect(() => {
    document.title = siteContent.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', siteContent.meta.description)
  }, [])

  const { nav, hero, concept, features, presentationFlow, hoverDemo, footer } =
    siteContent

  return (
    <div className="noto">
      <header className="noto-nav">
        <div className="noto-nav__inner">
          <a href="#" className="noto-nav__brand" onClick={(e) => e.preventDefault()}>
            <NotoLogo size={40} />
            <span className="noto-nav__brand-text">{nav.brand}</span>
          </a>
          <nav className="noto-nav__links" aria-label="페이지 섹션">
            {nav.links.map((link) => (
              <button
                key={link.id}
                type="button"
                className="noto-nav__link"
                onClick={() => scrollToId(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <button type="button" className="noto-btn noto-btn--primary noto-nav__cta">
            {nav.cta}
          </button>
        </div>
      </header>

      <main>
        <section className="noto-hero">
          <div className="noto-hero__glow" aria-hidden />
          <p className="noto-eyebrow">{hero.eyebrow}</p>
          <h1 className="noto-hero__title">
            {hero.titleLetters.map((part, i) => (
              <span
                key={i}
                className={part.accent ? 'noto-hero__title-accent' : undefined}
              >
                {part.char}
              </span>
            ))}
          </h1>
          <p className="noto-hero__slogan">
            {hero.sloganParts.map((part, i) =>
              part.emphasis ? (
                <span key={i} className="noto-hero__slogan-em">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
          <p className="noto-hero__sub">{hero.sub}</p>
          <div className="noto-hero__actions">
            <button
              type="button"
              className="noto-btn noto-btn--primary noto-btn--lg"
              onClick={() => scrollToId(features.id)}
            >
              {hero.primaryCta}
            </button>
            <button
              type="button"
              className="noto-btn noto-btn--ghost noto-btn--lg"
              onClick={() => scrollToId(hoverDemo.id)}
            >
              {hero.secondaryCta}
            </button>
          </div>
        </section>

        <section id={concept.id} className="noto-section noto-concept">
          <div className="noto-section__head">
            <h2>{concept.heading}</h2>
          </div>
          <blockquote className="noto-concept__quote">{concept.quote}</blockquote>
          <p className="noto-concept__body">{concept.body}</p>
        </section>

        <section id={features.id} className="noto-section noto-features">
          <div className="noto-section__head">
            <h2>{features.heading}</h2>
          </div>
          <ul className="noto-feature-grid">
            {features.items.map((item) => (
              <li key={item.title} className="noto-card">
                <span className="noto-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id={presentationFlow.id} className="noto-section noto-flow">
          <div className="noto-section__head">
            <h2>{presentationFlow.heading}</h2>
          </div>
          <div className="noto-flow__grid">
            {presentationFlow.phases.map((phase) => (
              <article
                key={phase.title}
                className={`noto-flow-card${phase.accent ? ' noto-flow-card--accent' : ''}`}
              >
                <h3>{phase.title}</h3>
                <ol>
                  {phase.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <section id={hoverDemo.id} className="noto-section noto-demo-wrap">
          <div className="noto-section__head">
            <h2>{hoverDemo.heading}</h2>
          </div>
          <HoverPdfDemo section={hoverDemo} />
        </section>
      </main>

      <footer className="noto-footer">
        <p className="noto-footer__brand">{footer.line}</p>
        <p className="noto-footer__note">{footer.note}</p>
      </footer>
    </div>
  )
}
