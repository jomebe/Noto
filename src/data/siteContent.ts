export const siteContent = {
  meta: {
    title: 'noto — AI Layered Note',
    description:
      '교재는 깨끗하게, 지식은 두껍게. 호버 기반 지능형 학습과 발표 지원을 한곳에서.',
  },
  nav: {
    brand: 'noto',
    links: [
      { id: 'concept', label: '컨셉' },
      { id: 'features', label: '기능' },
      { id: 'flow', label: '사용 흐름' },
      { id: 'demo', label: '호버 데모' },
    ],
    cta: '시작하기',
  },
  hero: {
    eyebrow: 'AI Layered Note',
    titleLetters: [
      { char: 'n', accent: false },
      { char: 'o', accent: false },
      { char: 't', accent: false },
      { char: 'o', accent: true },
    ],
    sloganParts: [
      { text: '필기 없이, ', emphasis: false },
      { text: 'AI', emphasis: true },
      { text: '가 완성하는 완벽한 학습', emphasis: false },
    ],
    sub:
      'PDF 위에 직접 덧대지 않고, AI 마크와 호버 인사이트로 가독성과 깊이를 동시에 잡는 학습·발표 경험.',
    primaryCta: '제품 살펴보기',
    secondaryCta: '호버 데모',
  },
  concept: {
    id: 'concept',
    heading: '핵심 컨셉',
    quote: '교재는 깨끗하게, 지식은 두껍게',
    body:
      '강의와 발표에 몰입하도록 설계했습니다. 중요한 순간은 AI가 마킹하고, 여백의 설명은 마우스 한 번으로 펼쳐집니다.',
  },
  features: {
    id: 'features',
    heading: '핵심 기능',
    items: [
      {
        title: 'AI 오디오 매핑',
        desc: 'STT로 강의 음성을 실시간 분석해 PDF의 관련 문단과 자동 연결합니다.',
        tag: 'STT',
      },
      {
        title: 'AI 인텔리전트 마킹',
        desc: '강조 톤·반복으로 하이라이트, “중요·시험” 키워드로 별표 마크를 자동 배치합니다.',
        tag: 'Mark',
      },
      {
        title: 'Hover Insight',
        desc: '교재 밖 보충 설명은 AI 마크로 표시하고, 호버 시 요약 팝업으로 빠르게 복습합니다.',
        tag: 'Hover',
      },
      {
        title: '자동 요약 섹션',
        desc: '강의 종료 후 마지막 장에 키워드·요약 리포트를 자동 생성합니다.',
        tag: 'Summary',
      },
    ],
  },
  presentationFlow: {
    id: 'flow',
    heading: '발표·학습 흐름',
    phases: [
      {
        title: '발표 전',
        accent: true,
        steps: [
          '자료 업로드 · PPT 피드백',
          '슬라이드별 스크립트 생성·수정',
          '예상 질문 · 핵심 키워드',
          '선택: 음성/아바타 스타일, FAQ·참고자료',
        ],
      },
      {
        title: '발표 중',
        accent: false,
        steps: [
          '실시간 피드백·스크립트·키워드 정리',
          '선택: AI 발표 시작, 슬라이드 동기 설명·아바타',
          '질문 수집(음성·텍스트) → 분석·자료 탐색·답변·TTS',
          '관련 슬라이드·시각 자료와 함께 응답',
        ],
      },
      {
        title: '발표 후',
        accent: false,
        steps: [
          '질문 목록 저장 · 빈도 분석',
          '개선 포인트 추천 · 리포트·FAQ',
          '연습 모드에서 AI 피드백',
        ],
      },
    ],
  },
  hoverDemo: {
    id: 'demo',
    heading: '호버 인사이트 체험',
    hint: '보라색 밑줄 구간에 마우스를 올려 보세요.',
    docTitle: '강의 노트 · 샘플 페이지',
    paragraphs: [
      {
        text: '이 구간은 강사가 교재에 없는 예시를 길게 설명했습니다.',
        mark: {
          label: 'AI 보충',
          insight:
            '실무에서는 캐시 무효화 전략으로 stale-while-revalidate 패턴을 자주 씁니다. 시험에서는 “일관성 vs 지연” 트레이드오프만 정리해도 만점 라인입니다.',
        },
      },
      {
        text: '정의는 교재 그대로이며 추가 설명이 거의 없었습니다.',
        mark: null,
      },
      {
        text: '여기서 “반드시 암기”라는 표현이 세 번 반복되었습니다.',
        mark: {
          label: '강조 감지',
          insight:
            '강사가 반복한 구간으로 자동 하이라이트 후보입니다. 별표 마크와 함께 복습 큐에 올라갑니다.',
        },
      },
    ],
  },
  footer: {
    line: 'noto — AI Layered Note',
    note: '브랜드와 UI는 제품 톤에 맞춰 지속적으로 다듬어집니다.',
  },
} as const

export type SiteContent = typeof siteContent
export type HoverDemoSection = typeof siteContent.hoverDemo
export type HoverDemoParagraph = HoverDemoSection['paragraphs'][number]
