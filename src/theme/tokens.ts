export const theme = {
  fontFamily:
    "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  colors: {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primarySoft: '#DBEAFE',
    lavender: '#F8FAFC',
    accent: '#0891B2',
    ink: '#0F172A',
    inkMuted: '#64748B',
    appBg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    border: 'rgba(30, 41, 59, 0.09)',
    shadow: 'rgba(15, 23, 42, 0.12)',
    glow: 'rgba(37, 99, 235, 0.28)',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    pill: '999px',
  },
  space: {
    sectionY: 'clamp(4rem, 10vw, 7rem)',
    gutter: 'clamp(1.25rem, 4vw, 2.5rem)',
  },
} as const

export type Theme = typeof theme
