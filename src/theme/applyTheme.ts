import { theme } from './tokens'

export function applyTheme(): void {
  const root = document.documentElement
  const { colors, radius, space, fontFamily } = theme

  root.style.setProperty('--noto-font', fontFamily)
  root.style.setProperty('--noto-primary', colors.primary)
  root.style.setProperty('--noto-primary-hover', colors.primaryHover)
  root.style.setProperty('--noto-primary-soft', colors.primarySoft)
  root.style.setProperty('--noto-lavender', colors.lavender)
  root.style.setProperty('--noto-ink', colors.ink)
  root.style.setProperty('--noto-ink-muted', colors.inkMuted)
  root.style.setProperty('--noto-surface', colors.surface)
  root.style.setProperty('--noto-surface-elevated', colors.surfaceElevated)
  root.style.setProperty('--noto-border', colors.border)
  root.style.setProperty('--noto-shadow', colors.shadow)
  root.style.setProperty('--noto-glow', colors.glow)

  root.style.setProperty('--noto-radius-sm', radius.sm)
  root.style.setProperty('--noto-radius-md', radius.md)
  root.style.setProperty('--noto-radius-lg', radius.lg)
  root.style.setProperty('--noto-radius-xl', radius.xl)
  root.style.setProperty('--noto-radius-pill', radius.pill)

  root.style.setProperty('--noto-section-y', space.sectionY)
  root.style.setProperty('--noto-gutter', space.gutter)
}
