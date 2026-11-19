// Guidelines › Naming — 피그마 이름 규칙
// 규칙을 바꾸면 이 파일의 데이터만 고치면 됩니다.

const FIGMA_KEY = 'ePI19exWQwYPCHpC27V2G8';
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const code = (s) => `<code class="nm-code">${esc(s)}</code>`;

const PRINCIPLES = [
  { n: '01', title: '영어로 씁니다', desc: '개발자가 코드에서 그대로 가져다 쓸 수 있고, 컴포넌트·변수 이름과도 맞출 수 있습니다.' },
  { n: '02', title: '파스칼 케이스 하나만', desc: '단어마다 첫 글자를 대문자로 쓰고 붙여 씁니다.', ex: ['MyPage', 'GameDetail'] },
  { n: '03', title: '띄어쓰기 없이', desc: '이름 안에서는 띄어쓰기를 쓰지 않습니다.' },
  { n: '04', title: '같은 대상은 같은 이름', desc: 'MyPage로 정했다면 끝까지 MyPage로 부르고, Profile로 바꿔 부르지 않습니다.' },
];

const SYMBOLS = [
  { sym: '_', name: '언더바', role: '덩어리 나누기', detail: '번호 / 화면 / 상태 사이', ex: '02_Home_Empty' },
  { sym: '-', name: '하이픈', role: '번호 안에서만', detail: '하위 화면을 이어 붙일 때', ex: '06-2-1_MyData' },
  { sym: '/', name: '슬래시', role: '폴더처럼 묶기', detail: '컴포넌트·변수 이름에서', ex: 'Button/Primary/Disabled' },
];

const STATES = [
  ['Default', '기본 (보통 생략)'], ['Loading', '불러오는 중'], ['Empty', '내용 없음'], ['Error', '오류'],
  ['Success', '완료'], ['Modal', '팝업이 떠 있음'], ['Sheet', '바텀시트가 떠 있음'], ['Answer', '답변이 나온 상태'],
  ['Paused', '멈춘 상태 (휴식 중)'], ['Selected', '항목을 고른 상태'], ['Filtered', '필터를 건 상태'],
];

const SCREEN_DO = ['04-1_ReportBySession_Selected', '06-2-2_Withdraw_Modal', 'M_02_Home'];
const SCREEN_DONT = [
  ['리포트 - 서핑별 /선택', '한글·띄어쓰기·기호가 섞여 있습니다'],
  ['04_report_selected', '소문자입니다. 파스칼 케이스로 씁니다'],
  ['04-1 ReportBySession', '띄어쓰기 대신 _를 씁니다'],
  ['마이-수정', '이름만으로는 어떤 화면인지 알 수 없습니다'],
];

// 컴포넌트 — 이름은 파스칼 케이스, 크기는 단어로
const COMPONENT_RULES = [
  { title: '종류 / 모양 / 상태 순서로 묶습니다', desc: '피그마 에셋 패널에서 폴더처럼 정리됩니다.', ex: ['Button/Primary/Default', 'Button/Primary/Pressed', 'Chip/White/Selected'] },
  { title: '크기는 숫자 대신 단어로', desc: 'Small · Medium · Large를 씁니다. 1, 2, 3으로는 무엇이 큰지 알 수 없습니다.', ex: ['Button/Large', 'Button/Small'], bad: ['chip 1', 'chip 2'] },
  { title: '부품 이름은 역할로', desc: '컴포넌트 안의 부품은 하는 일로 부릅니다.', ex: ['Head', 'Label', 'Icon', 'Value'], bad: ['cont', 'txt', 'Frame 660'] },
  { title: 'Variant 속성도 파스칼 케이스', desc: '속성 이름과 값 모두 대문자로 시작합니다. 코드로 옮기면 size="small" 같은 prop이 됩니다.', ex: ['Size=Small', 'State=Pressed', 'On=True'], bad: ['on=true', 'color=ver2 primary'] },
];

// 변수 — 원색(scale)과 역할(semantic) 두 층으로
const TOKEN_LAYERS = [
  { layer: 'Scale', ko: '원색', desc: '색 이름과 숫자 단계로 짓습니다. 어디에 쓰는지는 담지 않습니다.', ex: ['Color/Primary/500', 'Color/Neutral/100'] },
  { layer: 'Semantic', ko: '역할', desc: '쓰는 곳을 먼저 쓰고, 그다음 의미와 상태를 씁니다. 화면에는 이 변수만 씁니다.', ex: ['Text/Primary', 'Bg/Default', 'Button/Primary/Pressed'] },
];
const TOKEN_TODO = [
  ['뉴트럴/100', 'Color/Neutral/100'],
  ['프라이머리/500', 'Color/Primary/500'],
  ['txt/black', 'Text/Black'],
  ['str/gray', 'Stroke/Gray'],
  ['btn/default-press', 'Button/Default/Pressed'],
  ['시멘틱/danger light', 'Status/Danger/Light'],
  ['spacing/16', 'Spacing/16'],
];

// 레이어 이름 사전 — 자동으로 붙은 숫자 이름(Frame 1171279250 등) 대신
const LAYERS = [
  { group: '구조', items: [
    ['Content', '화면의 본문 영역 전체'], ['Section', '제목이 있는 묶음 (RecentSection처럼 앞에 붙입니다)'],
    ['Head', '묶음의 제목줄'], ['List · Row · Grid', '여러 개가 나열된 영역'], ['Table', '표'],
    ['Summary', '요약 영역'], ['Values', '숫자 두 개가 나란히 있는 곳'],
  ] },
  { group: '그래프', items: [
    ['GridLine', '그래프 눈금선'], ['ChartLine', '꺾은선 그래프의 선'], ['BarItem · BarGraph', '막대그래프 한 줄 · 막대 부분'],
    ['Track · Fill', '막대·원형 그래프의 바탕 · 채워진 부분'], ['Progress', '원형 그래프의 진행 부분'],
  ] },
  { group: '모양', items: [
    ['Divider', '구분선'], ['Separator', '글자 사이의 짧은 세로선'], ['Dot', '작은 점'],
    ['Bubble · Pointer', '말풍선 · 말풍선 꼬리'], ['Handle', '바텀시트 손잡이'], ['Knob', '토글 안의 동그라미'],
    ['Placeholder', '와이어프레임의 회색 상자'],
  ] },
];

// 핑 화면 지도
const SCREENS = [
  { no: '01', name: 'Onboarding', children: [], todo: true },
  { no: '02', name: 'Home', children: ['02_Home_Sheet'] },
  { no: '03', name: 'Record', children: ['03_Record_Paused'] },
  { no: '04', name: 'Report', children: ['04-1_ReportBySession', '04-1_ReportBySession_Selected', '04-1_ReportBySession_Filtered', '04-2_ReportCompare', '04-3_ReportDetail'] },
  { no: '05', name: 'AI', children: ['05_AI_Loading', '05_AI_Answer'] },
  { no: '06', name: 'MyPage', children: ['06-1_ProfileEdit', '06-2_Account', '06-2-1_MyData', '06-2-2_Withdraw', '06-2-2_Withdraw_Modal', '06-3_Inquiry', '06-4_Terms', '06-4-1_TermsOfService', '06-4-2_PrivacyPolicy'] },
];

const TODO = [
  ['온보딩 화면 이름 정하기', '온보딩 화면은 내용을 확인한 뒤 이름을 붙일 예정입니다.'],
  ['마이페이지 팝업 5개 이름 정하기', '어떤 팝업인지 확인한 뒤 06-…_Modal 형식으로 바꿉니다.'],
  ['숫자 없는 자동 이름 정리', 'Text · Container · Paragraph · Vector처럼 웹에서 가져올 때 붙은 이름입니다.'],
  ['소문자 레이어 이름 바꾸기', 'chip 2, cont, txt 같은 이름을 파스칼 케이스로 바꿉니다.'],
  ['변수 이름 맞추기', '위 "변수" 표대로 피그마 변수 이름을 바꾸고, 코드 이름은 tokens/name-map.json으로 그대로 유지합니다.'],
];

const anatomy = () => `
  <div class="nm-anatomy" aria-label="화면 이름 구조 예시">
    <div class="nm-part p1"><span class="nm-part-val">04-1</span><span class="nm-part-cap">번호</span></div>
    <span class="nm-joint">_</span>
    <div class="nm-part p2"><span class="nm-part-val">ReportBySession</span><span class="nm-part-cap">화면</span></div>
    <span class="nm-joint">_</span>
    <div class="nm-part p3"><span class="nm-part-val">Selected</span><span class="nm-part-cap">상태</span></div>
  </div>`;

const exList = (arr, cls = '') => `<span class="nm-exs">${arr.map((e) => `<code class="nm-code ${cls}">${esc(e)}</code>`).join('')}</span>`;

export const namingView = () => `
  <header class="page-head">
    <p class="eyebrow">Guidelines</p>
    <h1>Naming</h1>
    <p class="lead">피그마의 화면·컴포넌트·변수·레이어 이름을 짓는 규칙입니다. 이름을 누르면 복사됩니다.</p>
    <div class="meta">
      <a class="pill" href="https://www.figma.com/design/${FIGMA_KEY}/" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>
    </div>
  </header>

  <section class="section nm-hero">
    <div class="nm-formula">
      <span class="nm-formula-cap">한 줄 요약</span>
      <p>화면은 ${code('번호_Screen_State')}, 단어는 <strong>파스칼 케이스</strong>, 기호는 역할마다 하나씩만 씁니다.</p>
    </div>
    ${anatomy()}
  </section>

  <section class="section">
    <div class="section-head"><h2>기본 원칙</h2></div>
    <div class="nm-grid four">
      ${PRINCIPLES.map((p) => `
        <article class="nm-card">
          <span class="nm-num">${p.n}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          ${p.ex ? exList(p.ex) : ''}
        </article>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>기호 역할</h2><p>기호마다 할 일이 하나씩 정해져 있습니다. <strong>-는 번호 외에는 쓰지 않습니다.</strong></p></div>
    <div class="nm-grid three">
      ${SYMBOLS.map((s) => `
        <article class="nm-card nm-sym">
          <span class="nm-sym-mark mono">${esc(s.sym)}</span>
          <div>
            <h3>${esc(s.role)}</h3>
            <p>${esc(s.name)} · ${esc(s.detail)}</p>
            <button class="copy mono nm-copy" data-copy="${esc(s.ex)}">${esc(s.ex)}</button>
          </div>
        </article>`).join('')}
    </div>
  </section>

  <section class="section" id="nm-screen">
    <div class="section-head"><h2>화면 이름</h2><p>번호는 화면 흐름 순서대로 두 자리로 씁니다. 하위 화면은 <code class="nm-code">-</code>로 잇고, 같은 화면의 다른 상태는 번호를 그대로 두고 뒤에 상태만 붙입니다.</p></div>

    <div class="nm-tree-demo">
      <div><code class="nm-code">06_MyPage</code><span class="sub">화면</span></div>
      <div class="d1"><code class="nm-code">06-2_Account</code><span class="sub">하위 화면</span></div>
      <div class="d2"><code class="nm-code">06-2-2_Withdraw</code><span class="sub">하위의 하위</span></div>
      <div class="d2"><code class="nm-code nm-state">06-2-2_Withdraw_Modal</code><span class="sub">같은 화면 + 상태</span></div>
    </div>

    <h3 class="nm-sub">상태 단어 <span class="sub">${STATES.length}개</span></h3>
    <p class="nm-sub-desc sub">기본 화면에는 붙이지 않습니다. 이 목록에 있는 단어만 쓰고, 새 단어가 필요하면 먼저 여기에 추가합니다.</p>
    <div class="nm-states">
      ${STATES.map(([k, v]) => `<button class="nm-state-chip" data-copy="${esc(k)}"><strong class="mono">${esc(k)}</strong><span>${esc(v)}</span></button>`).join('')}
    </div>

    <h3 class="nm-sub">기기가 여러 개일 때</h3>
    <p class="nm-sub-desc sub">필요할 때만 맨 앞에 붙입니다. ${code('M_')} 모바일, ${code('W_')} 웹</p>

    <div class="nm-dodont">
      <div class="nm-do">
        <span class="nm-tag do">Do</span>
        ${SCREEN_DO.map((s) => `<button class="copy mono nm-copy" data-copy="${esc(s)}">${esc(s)}</button>`).join('')}
      </div>
      <div class="nm-dont">
        <span class="nm-tag dont">Don't</span>
        ${SCREEN_DONT.map(([s, why]) => `<div class="nm-bad"><code class="nm-code bad">${esc(s)}</code><span>${esc(why)}</span></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>컴포넌트 이름</h2><p>컴포넌트 이름은 파스칼 케이스로 쓰고, 크기와 모양은 숫자 대신 단어로 씁니다.</p></div>
    <div class="nm-grid two">
      ${COMPONENT_RULES.map((r) => `
        <article class="nm-card">
          <h3>${esc(r.title)}</h3>
          <p>${esc(r.desc)}</p>
          ${exList(r.ex)}
          ${r.bad ? `<span class="nm-bad-row"><span class="nm-tag dont sm">Don't</span>${exList(r.bad, 'bad')}</span>` : ''}
        </article>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>변수 이름</h2><p>변수는 두 층으로 나눕니다. 원색은 값을, 역할은 쓰는 곳을 이름에 담습니다. 화면에는 역할 변수만 씁니다.</p></div>
    <div class="nm-grid two">
      ${TOKEN_LAYERS.map((t) => `
        <article class="nm-card nm-layer">
          <span class="nm-layer-tag">${esc(t.layer)} <em>${esc(t.ko)}</em></span>
          <p>${esc(t.desc)}</p>
          ${exList(t.ex)}
        </article>`).join('')}
    </div>

    <h3 class="nm-sub">지금 핑 변수 → 맞출 이름 <span class="ds-badge mid">다음 단계</span></h3>
    <p class="nm-sub-desc sub">아직 바꾸지 않았습니다. 피그마에서 바꿔도 코드의 CSS 변수 이름은 <span class="mono">tokens/name-map.json</span>으로 그대로 유지할 수 있습니다.</p>
    <div class="nm-table">
      <div class="nm-tr nm-th"><span>지금</span><span></span><span>맞출 이름</span></div>
      ${TOKEN_TODO.map(([a, b]) => `
        <div class="nm-tr">
          <code class="nm-code bad">${esc(a)}</code>
          <span class="arrow">→</span>
          <button class="copy mono nm-copy" data-copy="${esc(b)}">${esc(b)}</button>
        </div>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>레이어 이름</h2><p>${code('Frame 1171279250')}, ${code('Rectangle 240653509')}처럼 자동으로 붙은 숫자 이름은 남기지 않습니다. 그 레이어가 <strong>하는 일</strong>로 이름을 붙입니다.</p></div>
    <div class="nm-grid three">
      ${LAYERS.map((g) => `
        <article class="nm-card nm-dict">
          <h3>${esc(g.group)}</h3>
          <dl>
            ${g.items.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
          </dl>
        </article>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>핑 화면 지도</h2><p>현재 피그마 UI 페이지의 화면 이름입니다.</p></div>
    <div class="nm-map">
      ${SCREENS.map((s) => `
        <article class="nm-map-col">
          <div class="nm-map-head"><span class="nm-num">${s.no}</span><strong>${esc(s.name)}</strong></div>
          ${s.todo ? '<span class="sub nm-map-todo">정리 예정</span>' : ''}
          ${s.children.map((c) => `<button class="copy mono nm-copy" data-copy="${esc(c)}">${esc(c)}</button>`).join('')}
        </article>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>남은 정리 <span class="sub">${TODO.length}개</span></h2></div>
    <div class="lints">
      ${TODO.map(([t, d]) => `
        <article class="lint info">
          <span class="lint-level">할 일</span>
          <div><h4>${esc(t)}</h4><p>${esc(d)}</p></div>
        </article>`).join('')}
    </div>
  </section>
`;
