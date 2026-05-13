# Noto

수업 음성을 PDF 위의 하이라이트와 호버 요약으로 바꾸는 AI 노트 웹앱입니다.

## 핵심 기능

- PDF 업로드 및 PDF.js 기반 페이지 렌더링
- 브라우저 마이크 전사(Web Speech API)
- 전사 내용과 PDF 텍스트 매칭
- 중요 표현/반복 언급 기반 노란 하이라이트
- 보충 설명 후보 초록 하이라이트
- 하이라이트 호버 시 AI 요약 팝업
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

호버 요약은 `/api/insight` 서버리스 함수에서 OpenAI API를 호출합니다. 키가 없으면 로컬 fallback 요약을 사용합니다.

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=sk_your_key_here
OPENAI_MODEL=gpt-4o-mini
```

Vercel 배포 시에도 같은 이름으로 Environment Variables에 등록합니다. OpenAI 키는 클라이언트 번들에 넣지 않습니다.

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

- Frontend: Vercel
- Serverless API: Vercel `/api/insight`
- Required env for AI insights: `OPENAI_API_KEY`
- Optional env: `OPENAI_MODEL`

## 현재 MVP 한계

- Web Speech API 지원 브라우저(Chrome/Edge)에 최적화되어 있습니다.
- 텍스트 추출 가능한 PDF를 기준으로 동작합니다.
- 스캔 PDF OCR, 완전한 화자 분리, 장시간 백그라운드 녹음은 후속 범위입니다.
