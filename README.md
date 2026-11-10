# neungae-hub

https://neungae.com 루트 페이지. 는개의 뜻과 서브도메인 목록.

- 호스팅: Cloudflare Workers(정적 자산). `main` 푸시 → 자동 배포. 빌드 없음.
- 도메인: `neungae.com`, `www.neungae.com` (wrangler.jsonc routes)

## 수정하는 법

| 하고 싶은 것 | 고칠 파일 |
|---|---|
| 서브도메인 카드 추가·수정 | `projects.json` — `{ name, host, emoji, desc, status: "live" \| "soon" }` |
| 메인 배경 사진 넣기 | `img/hero.jpg` 를 추가하면 자동으로 사진 배경으로 바뀜 (없으면 비 애니메이션만) |
| 문구 | `index.html` |
| 색·레이아웃 | `style.css` |
