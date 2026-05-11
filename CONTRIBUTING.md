# Noto 기여 가이드

Noto 프로젝트에 기여해주셔서 감사합니다! 이 가이드는 효과적으로 기여하는 방법을 설명합니다.

## 📝 시작하기

### 1. 저장소 Fork

[GitHub 저장소](https://github.com/yourusername/Noto)로 이동하여 "Fork" 클릭

### 2. 로컬 설정

```bash
git clone https://github.com/your-username/Noto.git
cd Noto
npm install
npm run dev
```

### 3. 브랜치 생성

```bash
git checkout -b feature/amazing-feature
```

---

## 🎯 기여 유형

### 🐛 버그 수정
- 버그를 발견했다면 GitHub Issues에 보고
- 이슈 번호 참조: `fix: #123`

### ✨ 새 기능
- 이슈를 먼저 생성하여 기능 아이디어 토론
- 큰 변경은 RFC (Request for Comments) 작성 권장

### 📚 문서 개선
- README, DEPLOYMENT.md 등 개선
- 오타 수정, 예시 추가 환영

### ♻️ 코드 정리
- 성능 최적화
- 타입 안정성 개선
- 테스트 추가

---

## 💻 개발 워크플로우

### 1. 코드 작성

```bash
npm run dev  # 개발 서버 시작
npm run type-check  # 타입 확인
npm run lint  # Lint 실행
```

### 2. 커밋

좋은 커밋 메시지 예시:
```
feat: AI 인사이트 캐싱 기능 추가

- 중복 API 호출 방지
- 로컬 스토리지 활용
- 성능 30% 개선
```

### 3. 푸시

```bash
git push origin feature/amazing-feature
```

### 4. Pull Request 생성

1. GitHub에서 Pull Request 생성
2. 제목과 설명 작성
3. 관련 이슈 참조 (#issue-number)
4. 변경사항 설명

---

## 🎨 코드 스타일

### TypeScript

```typescript
// ✅ 좋은 예
export function matchTranscriptChunkToMarks(
  chunk: string,
  boxes: PdfTextBox[],
  existing: OverlayMark[]
): OverlayMark[] {
  // ...
}

// ❌ 나쁜 예
export function matchTranscriptChunkToMarks(chunk, boxes, existing) {
  // ...
}
```

### React

```tsx
// ✅ 좋은 예
function MyComponent({ prop1, prop2 }: Props) {
  const [state, setState] = useState<StateType>(initial)
  
  return <div>{state}</div>
}

// ❌ 나쁜 예
function MyComponent(props) {
  const [state, setState] = useState(initial)
  
  return <div>{state}</div>
}
```

### CSS

```css
/* ✅ 좋은 예 */
.ws-panel {
  border-radius: var(--noto-radius-lg);
  background: var(--noto-surface);
}

/* ❌ 나쁜 예 */
.ws-panel {
  border-radius: 8px;
  background: #ffffff;
}
```

---

## 📋 PR 체크리스트

- [ ] 코드가 TypeScript strict 모드 통과
- [ ] `npm run lint` 오류 없음
- [ ] `npm run type-check` 통과
- [ ] 새 기능에 주석 추가
- [ ] README 또는 관련 문서 업데이트
- [ ] 모바일 반응성 테스트 (480px 이상)
- [ ] 브라우저 호환성 확인 (Chrome, Edge, Safari)

---

## 🧪 테스트

현재 프로젝트에서는 자동화된 테스트를 준비 중입니다.
추가되면 다음과 같이 테스트할 수 있습니다:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

---

## 📦 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/ko/) 사용

```
<type>: <subject>

<body>

<footer>
```

### Type 종류
- **feat**: 새 기능
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 포맷팅 (로직 변화 없음)
- **refactor**: 코드 리팩토링
- **perf**: 성능 개선
- **test**: 테스트 추가/수정
- **chore**: 설정 파일 등 변경

### 예시

```
feat: 마크 색상 커스터마이징 기능 추가

사용자가 마크 색상을 변경할 수 있도록 설정 추가
- Settings 페이지에 색상 선택 UI 추가
- 색상 선택사항 localStorage에 저장
- 기존 커스터마이징 기능과 통합

Closes #456
```

---

## 🚀 릴리스 프로세스

1. **버전 결정**
   - Semantic Versioning 준수 (MAJOR.MINOR.PATCH)
   - 예: 1.0.0 → 1.1.0 (기능 추가), 1.0.1 (버그 수정)

2. **변경 사항 정리**
   - CHANGELOG.md에 변경사항 추가
   - 주요 기능, 버그 수정, 변경사항 작성

3. **태그 생성**
   ```bash
   git tag -a v1.1.0 -m "Release version 1.1.0"
   git push origin v1.1.0
   ```

4. **GitHub Release 생성**
   - Release Notes 작성
   - 주요 변경사항 설명

---

## 💬 커뮤니케이션

### 토론
- GitHub Discussions: 아이디어 공유
- GitHub Issues: 버그 보고, 기능 요청

### 행동 강령
모든 참여자는 [Code of Conduct](CODE_OF_CONDUCT.md)를 따르세요.

---

## 🙏 감사의 말

Noto 프로젝트에 기여해주신 모든 분께 감사드립니다!

각 기여자는:
- README의 Contributors 섹션에 표시
- GitHub 기여도 통계에 반영

---

## 📚 추가 리소스

- [프로젝트 구조](README.md#-프로젝트-구조)
- [배포 가이드](DEPLOYMENT.md)
- [API 문서](docs/API.md) (준비 중)

---

## ❓ 질문이 있으신가요?

- 📧 이메일: support@noto-app.com
- 💬 GitHub Discussions
- 🐙 GitHub Issues

**Happy contributing! 🎉**
