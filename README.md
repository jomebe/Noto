# 📚 Noto: AI Layered Note

> **"교재는 깨끗하게, 지식은 두껍게"**

**Noto**는 PDF 강의 자료 위에 AI 기반 마킹과 호버 기반 인사이트를 제공하는 인터랙티브 필기 솔루션입니다. 음성 인식, 자동 마킹, 그리고 AI 요약을 통해 강의 효율을 극대화합니다.

---

## ✨ 핵심 기능

### 🎤 **AI 오디오 매핑 (STT)**
- 강의 음성을 실시간 분석
- PDF의 관련 문단과 자동 연결
- 웹 Speech Recognition API 기반

### 🎨 **AI 인텔리전트 마킹**
- **하이라이트**: 강사의 강조 표현 감지 시 자동 형광펜
- **별표(★)**: 특정 키워드 감지 시 여백에 자동 마킹
- 최대 200개 마크까지 지원

### 💡 **호버 상세 설명 (Hover Insight)**
- 강사의 추가 설명을 AI 마크로 표시
- 마우스 호버로 보충 설명 팝업 표시
- OpenAI API 기반 지능형 설명 생성

### 📊 **자동 요약 섹션**
- 핵심 키워드 추출
- 주요 포인트 요약 생성
- 트랜스크립트 텍스트 파일 다운로드

---

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- 선택사항: OpenAI API 키 (인사이트 기능용)

### 설치

```bash
git clone https://github.com/yourusername/Noto.git
cd Noto
npm install
```

### 개발 환경 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 환경 설정

OpenAI 기반 인사이트 기능을 사용하려면:

```bash
cp .env.example .env.local
```

`.env.local` 파일 수정:
```
VITE_OPENAI_API_KEY=sk_your_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini  # 선택사항
```

API 키는 [OpenAI 플랫폼](https://platform.openai.com/api-keys)에서 발급받으세요.

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 📖 사용 방법

### 1️⃣ **PDF 업로드**
강의 자료 선택 후 지난 후 인식

### 2️⃣ **음성 녹음 시작**
"녹음 시작" 버튼 클릭

### 3️⃣ **자동 마킹 확인**
강사의 강조 표현과 키워드가 자동으로 감지되어 마크됨

### 4️⃣ **호버로 인사이트 확인**
마크된 텍스트에 마우스를 올리면 AI 설명 팝업 표시

### 5️⃣ **요약 및 내보내기**
핵심 키워드와 요약 확인, 트랜스크립트 다운로드

---

## 🏗️ 프로젝트 구조

```
src/
├── components/           # React 컴포넌트
│   └── workspace/
│       ├── MarkLayer.tsx       # 마크 오버레이
│       └── PdfPageCanvas.tsx   # PDF 렌더링
├── pages/               # 페이지 컴포넌트
│   ├── LandingPage.tsx
│   └── WorkspacePage.tsx       # 메인 워크스페이스
├── lib/                # 유틸리티 함수
│   ├── matchTranscriptToMarks.ts    # 음성-텍스트 매칭
│   ├── summaryFromTranscript.ts     # 요약 생성
│   └── insight/
│       ├── resolveInsight.ts        # AI 인사이트 생성
│       └── insightCache.ts          # 캐싱
├── hooks/              # React 훅
│   └── useSpeechRecognition.ts      # STT 훅
└── config/             # 설정
    └── markingRules.ts             # 마킹 규칙
```

---

## 🌐 배포

### Vercel에 배포 (추천)

```bash
npm install -g vercel
vercel
```

Vercel 대시보드 Settings → Environment Variables에서 설정하세요:
- `VITE_OPENAI_API_KEY`
- `VITE_OPENAI_MODEL` (선택사항)

### Docker 배포

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🔧 기술 스택

- **프런트엔드**: React 19 + TypeScript
- **빌드**: Vite
- **PDF**: PDF.js
- **음성인식**: Web Speech Recognition API
- **AI**: OpenAI API (gpt-4o-mini)
- **배포**: Vercel / Render

---

## 📝 라이선스

MIT License

---

## 🤝 기여하기

개선 사항이나 버그 리포트는 언제나 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 감사의 말

- PDF.js 개발팀
- OpenAI 팀
- 모든 기여자와 사용자분들

**Made with ❤️ for learners everywhere**

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
