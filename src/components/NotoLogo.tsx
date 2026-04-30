import { useId } from 'react'

type NotoLogoProps = {
  className?: string
  size?: number
  'aria-label'?: string
}

export function NotoLogo({
  className,
  size = 48,
  'aria-label': ariaLabel = 'noto 로고',
}: NotoLogoProps) {
  const gradId = useId().replace(/:/g, '')
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--noto-primary)" />
          <stop offset="100%" stopColor="var(--noto-primary-hover)" />
        </linearGradient>
      </defs>
      <rect
        x="6"
        y="10"
        width="36"
        height="28"
        rx="6"
        fill="var(--noto-surface)"
        stroke="var(--noto-border)"
        strokeWidth="1"
      />
      <path
        d="M24 10v28"
        stroke="var(--noto-border)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <rect x="8" y="14" width="13" height="20" rx="3" fill="var(--noto-lavender)" />
      <path
        d="M11 18l1.2 1.2L14 17"
        stroke="var(--noto-primary)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="10" y="22" width="9" height="2" rx="1" fill="var(--noto-primary-soft)" />
      <rect x="10" y="26" width="7" height="2" rx="1" fill="var(--noto-primary-soft)" />
      <rect x="10" y="30" width="8" height="2" rx="1" fill="var(--noto-primary-soft)" />
      <rect x="26" y="14" width="13" height="20" rx="3" fill={`url(#${gradId})`} />
      <circle cx="30" cy="22" r="1.4" fill="var(--noto-surface)" />
      <circle cx="35" cy="22" r="1.4" fill="var(--noto-surface)" />
      <path
        d="M29 27c1.2 1.6 3.4 1.6 4.6 0"
        stroke="var(--noto-surface)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
