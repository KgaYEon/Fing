# Fing

피그마 디자인을 단계별로 퍼블리싱하는 프로젝트. 현재 단계: **디자인시스템 — 색상**

## 실행

```bash
npm install
npm run dev
```

- 홈: http://localhost:5173
- 디자인시스템: http://localhost:5173/design-system/

## 피그마 ↔ 프로젝트 실시간 동기화

피그마에서 변수를 추가·삭제·수정하면 디자인시스템 페이지에 바로 반영돼요.

**처음 한 번 설정 (피그마 데스크톱 앱 필요)**
1. 피그마 데스크톱 앱 → 메뉴 `Plugins` → `Development` → `Import plugin from manifest…`
2. 이 프로젝트의 `figma-plugin/manifest.json` 선택

**매번 쓸 때**
1. 터미널에서 `npm run dev`
2. 피그마에서 `Plugins` → `Development` → `Fing Token Sync` 실행
3. 플러그인 창을 열어둔 채로 변수를 고치면 1~2초 안에 페이지가 자동으로 새로고침돼요.

플러그인을 안 쓸 때는 Claude에게 "피그마 변수 다시 동기화해줘"라고 하면 MCP로 읽어와서 같은 파일을 갱신해요.

## 파일 구조

```
figma/variables.raw.json   피그마 변수 원본 (플러그인/MCP가 덮어씀 — 직접 수정 X)
tokens/name-map.json       한글 그룹명 → 영문 CSS 이름 사전 (직접 수정 O)
scripts/build-tokens.mjs   원본 → CSS 변수 + 점검 규칙
src/styles/tokens.css      자동 생성 CSS 변수 (직접 수정 X)
src/tokens/tokens.json     자동 생성 페이지용 데이터 (직접 수정 X)
src/design-system/         디자인시스템 페이지
figma-plugin/              개발용 피그마 동기화 플러그인
```

## 화면에서 쓰는 법

시멘틱 토큰만 쓰고, 원색(`--color-neutral-*`, `--color-primary-*`)은 직접 쓰지 않아요.

```css
.button { background: var(--color-btn-default); color: var(--color-txt-white); }
```
