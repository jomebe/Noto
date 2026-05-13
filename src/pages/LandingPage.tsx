import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { NotoLogo } from '../components/NotoLogo'
import { paths } from '../config/paths'
import { siteContent } from '../data/siteContent'
import '../App.css'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LandingPage() {
  useEffect(() => {
    document.title = siteContent.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', siteContent.meta.description)
  }, [])

  const { nav, hero, product, features, flow, footer } = siteContent

  return (
    <div className="noto">
      <header className="noto-nav">
        <div className="noto-nav__inner">
          <Link to={paths.home} className="noto-nav__brand">
            <NotoLogo size={38} />
            <span className="noto-nav__brand-text">{nav.brand}</span>
          </Link>
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
          <Link to={paths.workspace} className="noto-btn noto-btn--primary noto-nav__cta">
            {nav.cta}
          </Link>
        </div>
      </header>

      <main>
        <section className="noto-hero">
          <div className="noto-hero__copy">
            <p className="noto-eyebrow">{hero.eyebrow}</p>
            <h1 className="noto-hero__title">{hero.title}</h1>
            <p className="noto-hero__sub">{hero.sub}</p>
            <div className="noto-hero__actions">
              <Link
                to={paths.workspace}
                className="noto-btn noto-btn--primary noto-btn--lg"
              >
                {hero.primaryCta}
              </Link>
              <button
                type="button"
                className="noto-btn noto-btn--ghost noto-btn--lg"
                onClick={() => scrollToId(product.id)}
              >
                {hero.secondaryCta}
              </button>
            </div>
          </div>

          <div className="noto-product-preview" aria-label="Noto 제품 미리보기">
            <div className="noto-preview-top">
              <span />
              <span />
              <span />
              <strong>biology-chapter-03.pdf</strong>
            </div>
            <div className="noto-preview-body">
              <div className="noto-preview-page">
                <span className="noto-preview-line noto-preview-line--wide" />
                <span className="noto-preview-line" />
                <span className="noto-preview-line noto-preview-line--highlight" />
                <span className="noto-preview-line" />
                <span className="noto-preview-line noto-preview-line--insight" />
                <span className="noto-preview-line noto-preview-line--short" />
              </div>
              <aside className="noto-preview-side">
                <div>
                  <span className="noto-preview-label">LIVE</span>
                  <strong>녹음 중 12:48</strong>
                </div>
                <p>“이 개념은 시험에 자주 나오고, 쉽게 말하면 에너지 저장 방식입니다.”</p>
                <ul>
                  <li>중요 하이라이트 8개</li>
                  <li>호버 요약 5개</li>
                </ul>
              </aside>
            </div>
            <img src={heroImage} alt="" className="noto-preview-art" />
          </div>
        </section>

        <section id={product.id} className="noto-section noto-product">
          <div className="noto-section__head">
            <p className="noto-section__kicker">Product</p>
            <h2>{product.heading}</h2>
            <p>{product.body}</p>
          </div>
        </section>

        <section id={features.id} className="noto-section noto-features">
          <div className="noto-section__head">
            <p className="noto-section__kicker">Features</p>
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

        <section id={flow.id} className="noto-section noto-flow">
          <div className="noto-section__head">
            <p className="noto-section__kicker">Flow</p>
            <h2>{flow.heading}</h2>
          </div>
          <div className="noto-flow__grid">
            {flow.steps.map((step) => (
              <article key={step.title} className="noto-flow-card">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="noto-footer">
        <p className="noto-footer__brand">{footer.line}</p>
        <p className="noto-footer__note">{footer.note}</p>
      </footer>
    </div>
  )
}
