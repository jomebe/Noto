export const siteContent = {
  meta: {
    title: 'Noto — 수업 음성을 PDF 위의 필기로 바꾸는 AI 노트',
    description:
      'PDF를 업로드하고 수업 음성을 받으면, AI가 중요한 부분을 하이라이트하고 호버 요약을 제공합니다.',
  },
  nav: {
    brand: 'Noto',
    links: [
      { id: 'product', label: '제품' },
      { id: 'features', label: '기능' },
      { id: 'flow', label: '흐름' },
    ],
    cta: 'PDF로 시작',
  },
  hero: {
    eyebrow: 'AI Lecture Notes on Your PDF',
    title: '수업이 끝나면 PDF 위에 필기가 완성됩니다',
    sub:
      '교재를 새 노트로 복사하지 않습니다. 수업 음성을 PDF 텍스트와 매칭해 중요한 개념은 하이라이트하고, 설명은 호버 요약으로 남깁니다.',
    primaryCta: '워크스페이스 열기',
    secondaryCta: '작동 방식 보기',
  },
  product: {
    id: 'product',
    heading: '업로드, 녹음, 자동 하이라이트',
    body:
      'Noto는 브라우저 안에서 PDF를 읽고 수업 전사를 분석합니다. 강조 표현과 반복 언급은 노란색, 보충 설명이 붙은 개념은 초록색으로 구분합니다.',
  },
  features: {
    id: 'features',
    heading: 'MVP에 필요한 핵심만 넣었습니다',
    items: [
      {
        title: 'PDF 업로드와 텍스트 좌표 추출',
        desc: 'PDF.js로 페이지를 렌더링하고 텍스트 위치 위에 하이라이트 레이어를 정확히 얹습니다.',
        tag: 'PDF',
      },
      {
        title: '브라우저 마이크 전사',
        desc: 'Chrome/Edge의 Web Speech API로 수업 음성을 받아 PDF 문구와 실시간으로 연결합니다.',
        tag: 'Voice',
      },
      {
        title: '중요도 기반 하이라이트',
        desc: '시험, 중요, 반드시 같은 강조 표현과 반복 언급을 기준으로 자동 하이라이트를 생성합니다.',
        tag: 'Highlight',
      },
      {
        title: '호버 요약',
        desc: '하이라이트에 마우스를 올리면 해당 PDF 문구와 전사 맥락을 바탕으로 짧은 요약을 보여줍니다.',
        tag: 'AI',
      },
    ],
  },
  flow: {
    id: 'flow',
    heading: '수업 전 30초 세팅',
    steps: [
      {
        title: '1. PDF 업로드',
        desc: '교재나 강의자료 PDF를 올리면 페이지와 텍스트 위치를 분석합니다.',
      },
      {
        title: '2. 녹음 시작',
        desc: '마이크 권한을 허용하고 수업을 들으면 전사가 쌓입니다.',
      },
      {
        title: '3. 하이라이트 확인',
        desc: '중요 개념과 보충 설명을 PDF 위에서 바로 확인합니다.',
      },
    ],
  },
  footer: {
    line: 'Noto — AI Lecture Notes on PDF',
    note: '현재 MVP는 텍스트 추출 가능한 PDF와 Chrome/Edge 브라우저에 최적화되어 있습니다.',
  },
} as const

export type SiteContent = typeof siteContent
export type HoverDemoSection = {
  id: string
  heading: string
  hint: string
  docTitle: string
  paragraphs: HoverDemoParagraph[]
}
export type HoverDemoParagraph = {
  text: string
  mark: { label: string; insight: string } | null
}
