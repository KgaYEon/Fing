# Fing

피그마 디자인을 단계별로 퍼블리싱하는 프로젝트. 현재 단계: **디자인시스템 — 색상, 타이포그래피, 아이콘, 버튼**

## 실행

```bash
npm install
npm run dev
```

- 홈: http://localhost:5173
- 디자인시스템: http://localhost:5173/design-system/

## 피그마 ↔ 프로젝트 실시간 동기화

피그마에서 변수·텍스트 스타일·아이콘을 추가·삭제·수정하면 디자인시스템 페이지에 바로 반영돼요.
아이콘은 이름이 `ic/`로 시작하는 컴포넌트만 가져와요.
컴포넌트는 `tokens/components.json`에 적힌 이름만 가져와요 (지금은 Button).

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
figma/text-styles.raw.json 피그마 텍스트 스타일 원본 (직접 수정 X)
src/styles/typography.css  자동 생성 글자 스타일 (.t-title-1 등)
figma/components.raw.json  피그마 컴포넌트 원본 (직접 수정 X)
tokens/components.json     코드로 만들 컴포넌트 목록 (직접 수정 O)
src/components/            자동 생성 컴포넌트 CSS (.button 등)
figma/icons.raw.json       피그마 아이콘 원본 (직접 수정 X)
src/icons/                 자동 생성 아이콘 (svg 파일, icon() 함수)
figma-plugin/              개발용 피그마 동기화 플러그인
```

## 화면에서 쓰는 법

시멘틱 토큰만 쓰고, 원색(`--color-neutral-*`, `--color-primary-*`)은 직접 쓰지 않아요.

```css
.button { background: var(--color-btn-default); color: var(--color-txt-white); }
```

글자:

```html
<h1 class="t-title-1">오늘의 기록</h1>
```

버튼:

```html
<button class="button">확인</button>
<button class="button button--danger">삭제</button>
```

아이콘:

```js
import { icon } from '/src/icons/icons.js';
button.innerHTML = icon('home');                       // 글자색을 따라감
button.innerHTML = icon('arr-right', { size: 20, label: '다음' });
```

> 피그마 플러그인을 새로 고쳤으면 피그마에서 플러그인을 한 번 껐다 켜주세요.
