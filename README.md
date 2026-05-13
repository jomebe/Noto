# Noto

무료로 사용할 수 있는 PDF 수업 하이라이트 웹앱입니다. PDF를 올리고 수업 음성을 받으면 브라우저 안에서 자동 하이라이트와 호버 요약을 만듭니다.

## 무료 모드

Noto MVP는 기본적으로 API 키가 필요 없습니다.

- PDF 렌더링: PDF.js
- 음성 전사: 브라우저 Web Speech API
- 중요/설명 하이라이트: 로컬 규칙 기반 분석
- 호버 요약: PDF 문구와 전사 맥락을 이용한 로컬 요약
- 배포: Vercel 정적 배포 가능

## 핵심 기능

- PDF 업로드 및 페이지 렌더링
- 녹음 시작/종료와 실시간 전사
- 전사 내용과 PDF 텍스트 매칭
- 중요 표현/반복 언급 기반 노란 하이라이트
- 보충 설명 후보 초록 하이라이트
- 하이라이트 호버 시 무료 로컬 요약 팝업
- 전사 텍스트 내보내기 및 세션 요약

## 빠른 시작

```bash
git clone https://github.com/jomebe/Noto.git
cd Noto
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

## 환경 변수

필요 없습니다. `.env.example`은 무료 모드 안내용으로만 남겨두었습니다.

## 사용 흐름

1. 메인 페이지에서 `워크스페이스 열기`를 클릭합니다.
2. 교재 또는 강의자료 PDF를 업로드합니다.
3. `녹음 시작`을 누르고 마이크 권한을 허용합니다.
4. 수업 음성이 전사되면 PDF 위에 자동 하이라이트가 생깁니다.
5. 하이라이트에 마우스를 올려 짧은 요약과 표시 근거를 확인합니다.

## 빌드

```bash
npm run build
npm run preview
```

## 배포

Vercel에 그대로 연결하면 됩니다.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: 없음

## 현재 MVP 한계

- Web Speech API 지원 브라우저(Chrome/Edge)에 최적화되어 있습니다.
- 텍스트 추출 가능한 PDF를 기준으로 동작합니다.
- 로컬 요약은 LLM 품질이 아니라 규칙 기반 요약입니다.
- 스캔 PDF OCR, 완전한 화자 분리, 장시간 백그라운드 녹음은 후속 범위입니다.
