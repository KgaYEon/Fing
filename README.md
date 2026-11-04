# Fing

피그마 디자인을 단계별로 퍼블리싱하는 프로젝트. 현재 단계: **디자인시스템 — 기초 7종 + 컴포넌트 15종**

## 실행

```bash
npm install
npm run dev
```

- 앱 (스플래시부터): http://localhost:5173
- 디자인시스템: http://localhost:5173/ds

## 피그마 ↔ 프로젝트 실시간 동기화

피그마에서 변수·텍스트 스타일·이펙트 스타일·아이콘을 추가·삭제·수정하면 디자인시스템 페이지에 바로 반영돼요.
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
ds/ + src/design-system/   디자인시스템 페이지 (주소 /ds)
figma/text-styles.raw.json 피그마 텍스트 스타일 원본 (직접 수정 X)
src/styles/typography.css  자동 생성 글자 스타일 (.t-title-1 등)
src/styles/spacing.css     자동 생성 간격 (--space-4 ~ --space-64, 4px 단위)
src/styles/radius.css      자동 생성 둥글기 (--radius-4 ~ --radius-24, --radius-full)
figma/effect-styles.raw.json 피그마 이펙트 스타일 원본 (직접 수정 X)
src/styles/effects.css     자동 생성 그림자 (--shadow-sm, --shadow-md)
figma/components.raw.json  피그마 컴포넌트 원본 (직접 수정 X)
tokens/components.json     코드로 만들 컴포넌트 목록 (직접 수정 O)
src/components/            자동 생성 컴포넌트 CSS (.button)
src/ui/                    직접 만든 컴포넌트 (toggle, chip, badge, tab-bar, modal 등) — 토큰을 써서 색·간격은 피그마를 따라감
figma/icons.raw.json       피그마 아이콘 원본 (직접 수정 X)
src/icons/                 자동 생성 아이콘 (svg 파일, icon() 함수)
figma-plugin/              개발용 피그마 동기화 플러그인
```

## 앱 (리액트)

주소마다 화면 컴포넌트가 하나씩 있어요. 화면 안의 덩어리도 컴포넌트로 나눴어요.

```
src/app/main.jsx            시작점 (토큰·공통 스타일 불러오기)
src/app/App.jsx             주소 ↔ 화면 연결
src/app/routes.js           화면 주소 모음 (ready: 만든 화면인지)
src/app/components/         여러 화면이 같이 쓰는 컴포넌트
  Icon · Logo · Button · Chip(Badge) · ChipTabs · Segmented · BackHeader · MenuList · Toggle · Modal · IconBox · Choice · OptionRow · SocialButton · TabBar · Sheet
src/app/screens/
  Splash/      /            스플래시
  Login/       /login       로그인 + 약관 시트 (LegalLinks · LegalSheet)
  Onboarding/  /onboarding/…  단계마다 화면 하나 (steps/: Welcome · Permission · PermissionDone · Nickname · Intro · Question · Done)
  Home/        /home        HomeHeader(TrackerPopover) · WaveInfo(FitDonut) · GoalCard · BestRecords · RecentRecords · MetricSheet
  Report/      /report      종합(summary/: MetricChart · BestGrid · FirstRecords) · 서핑별(sessions/: SessionCard)
  My/          /my          마이(MyPage) · /my/profile 프로필 수정 · /my/account 계정 관리(DataManage · Withdraw) · /my/inquiry 문의 · /my/terms 약관(LegalDoc)
               /report/compare?ids=…  두 기록 비교 · /report/session/:id  기록 하나 상세 (compare/: GlanceCard · BarPair · DetailRows · ConditionCompare · ConditionTable)
```

화면 CSS는 각 화면 폴더 안에, 공통 컴포넌트 CSS는 `src/ui/`(디자인시스템과 같이 써요)에 있어요.

## 화면에서 쓰는 법

시멘틱 토큰만 쓰고, 원색(`--color-neutral-*`, `--color-primary-*`)은 직접 쓰지 않아요.

```css
.button { background: var(--color-btn-default); color: var(--color-txt-white); }
```

글자:

```html
<h1 class="t-title-1">오늘의 기록</h1>
```

간격 (4px 단위):

```css
.card { padding: var(--space-16) var(--space-20); gap: var(--space-12); }
```

둥글기:

```css
.card { border-radius: var(--radius-16); }
.tag  { border-radius: var(--radius-full); }
```

그림자:

```css
.card { box-shadow: var(--shadow-sm); }
```

버튼:

```html
<button class="button">확인</button>
<button class="button button--danger">삭제</button>
```

그 밖의 컴포넌트 (자세한 코드는 디자인시스템 페이지 Components 메뉴):

```html
<input type="checkbox" class="toggle" role="switch">
<button class="chip" aria-pressed="false">칩</button>
<span class="badge badge--warn">주의</span>
```

아이콘:

```js
import { icon } from '/src/icons/icons.js';
button.innerHTML = icon('home');                       // 글자색을 따라감
button.innerHTML = icon('arr-right', { size: 20, label: '다음' });
```

> 피그마 플러그인을 새로 고쳤으면 피그마에서 플러그인을 한 번 껐다 켜주세요.
