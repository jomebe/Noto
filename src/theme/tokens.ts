export const theme = {
  fontFamily:
    "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  colors: {
    primary: '#7B61FF',
    primaryHover: '#6848F5',
    primarySoft: '#E8E4FF',
    lavender: '#F5F3FF',
    ink: '#1E293B',
    inkMuted: '#64748B',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAFF',
    border: 'rgba(30, 41, 59, 0.09)',
    shadow: 'rgba(123, 97, 255, 0.18)',
    glow: 'rgba(123, 97, 255, 0.35)',
  },
  radius: {
    sm: '12px',
    md: '18px',
    lg: '26px',
    xl: '36px',
    pill: '999px',
  },
  space: {
    sectionY: 'clamp(4rem, 10vw, 7rem)',
    gutter: 'clamp(1.25rem, 4vw, 2.5rem)',
  },
} as const

export type Theme = typeof theme
