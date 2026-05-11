# 배포 가이드

이 문서는 Noto를 다양한 플랫폼에 배포하는 방법을 설명합니다.

## 📋 사전 요구사항

- Node.js 18+ 설치
- npm 또는 yarn
- 각 플랫폼의 계정 (Vercel, Render, 등)

---

## 🚀 Vercel에 배포 (추천)

### 1. Vercel CLI 설치

```bash
npm install -g vercel
```

### 2. 환경 변수 설정

Vercel 대시보드에서:
1. **Settings** → **Environment Variables**
2. 다음 변수 추가:
   - `VITE_OPENAI_API_KEY`: OpenAI API 키
   - `VITE_OPENAI_MODEL`: (선택사항) `gpt-4o-mini`

### 3. 배포

```bash
vercel
```

또는 GitHub와 연결하여 자동 배포:
1. Vercel 대시보드 → "New Project"
2. GitHub 저장소 선택
3. Import
4. 환경 변수 설정
5. Deploy

---

## 🎯 Render에 배포

### 1. render.yaml 파일 확인

프로젝트 루트의 `render.yaml` 파일이 올바르게 설정되었는지 확인하세요.

### 2. Render 대시보드에서

1. [render.com](https://render.com) 접속
2. "New +" → "Web Service"
3. "Connect a repository" → GitHub 선택
4. 저장소 선택 및 연결
5. 환경 변수 설정:
   - `VITE_OPENAI_API_KEY`
   - `VITE_OPENAI_MODEL` (선택사항)
6. Deploy

---

## 🐳 Docker로 배포

### 1. Dockerfile 빌드

```bash
docker build -t noto-app .
```

### 2. 로컬에서 실행

```bash
docker run -p 4173:3000 noto-app
```

### 3. 클라우드 배포

#### AWS ECS
```bash
aws ecr create-repository --repository-name noto-app
docker tag noto-app:latest <your-registry>/noto-app:latest
docker push <your-registry>/noto-app:latest
```

#### Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/<PROJECT-ID>/noto-app
gcloud run deploy noto-app --image gcr.io/<PROJECT-ID>/noto-app
```

---

## 📦 Self-Hosted 배포

### 1. 서버 준비

- Ubuntu 20.04 LTS 이상
- Node.js 18+ 설치
- 80/443 포트 개방

### 2. 애플리케이션 설치

```bash
git clone https://github.com/yourusername/Noto.git
cd Noto
npm install
npm run build
```

### 3. PM2로 실행

```bash
npm install -g pm2

pm2 start npm --name "noto" -- run preview

# 자동 시작 설정
pm2 startup
pm2 save
```

### 4. Nginx 설정

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL 인증서 (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔍 배포 후 확인

### 1. 헬스 체크

```bash
curl https://your-deployment-url/
```

### 2. 환경 변수 확인

- OpenAI API 키가 올바르게 설정되었는지 확인
- 브라우저 콘솔에서 에러 확인

### 3. 기능 테스트

- PDF 업로드 테스트
- 음성 인식 테스트 (Chrome/Edge)
- 인사이트 생성 테스트

---

## 🚨 문제 해결

### "Cannot find module" 에러

```bash
npm install
npm run build
```

### 포트 충돌

```bash
lsof -i :4173
kill -9 <PID>
```

### 높은 메모리 사용

Node.js 메모리 제한:
```bash
NODE_OPTIONS=--max-old-space-size=512 npm run preview
```

---

## 📊 성능 최적화

### 1. CDN 설정

모든 배포 플랫폼은 자동으로 CDN을 제공합니다:
- **Vercel**: Vercel Edge Network
- **Render**: Global CDN
- **AWS**: CloudFront
- **Google Cloud**: Cloud CDN

### 2. 압축 활성화

```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### 3. 캐싱 설정

정적 파일 캐싱 헤더:
```
Cache-Control: public, max-age=31536000
```

---

## 🔒 보안 체크리스트

- [ ] API 키 환경 변수로 설정
- [ ] HTTPS 활성화
- [ ] CORS 설정 확인
- [ ] 의존성 보안 업데이트: `npm audit`
- [ ] 민감한 정보 커밋되지 않음 확인

---

## 📞 지원

배포 문제가 있으면:
1. GitHub Issues에 보고
2. 배포 로그 확인
3. 각 플랫폼의 지원팀 연락

**Happy deploying! 🚀**
