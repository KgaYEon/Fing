// 디자인시스템 페이지 — src/tokens/tokens.json 을 읽어 자동으로 그립니다.
// 피그마에서 변수를 고치면 tokens.json 이 다시 만들어지고, 이 페이지도 그대로 따라 바뀝니다.
import data from '../tokens/tokens.json';
import iconData from '../icons/icons.json';
import typeData from '../tokens/typography.json';

const $app = document.getElementById('app');
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
const slugId = (name) => 'tok-' + name.replace(/[^\w가-힣]+/g, '-');

const collections = data.collections;
const primitives = collections.filter((c) => c.role === 'primitive');
const semantics = collections.filter((c) => c.role === 'semantic');
const all = collections.flatMap((c) => c.groups.flatMap((g) => g.tokens));
const flagged = new Map(); // 토큰 이름 → 점검 레벨
for (const l of data.lint) for (const t of l.tokens) if (l.rule !== 'all-scopes' && l.level !== 'ok' && !flagged.has(t)) flagged.set(t, l.level);

// 원색이 시멘틱에서 몇 번 쓰이는지
const usage = {};
for (const t of all) if (t.alias) (usage[t.alias.id] ||= []).push(t.name);

const onColor = (t) => (t.contrast.white >= t.contrast.black ? '#fff' : '#05080D');
const aaBadge = (ratio) => {
  if (ratio >= 7) return `<span class="badge ok">AAA ${ratio}</span>`;
  if (ratio >= 4.5) return `<span class="badge ok">AA ${ratio}</span>`;
  if (ratio >= 3) return `<span class="badge mid">AA Large ${ratio}</span>`;
  return `<span class="badge bad">${ratio}</span>`;
};
// 역할별 대비: 텍스트는 흰 배경 위, 배경/버튼은 그 위 글자, 테두리는 참고용 수치
const contrastCell = (t, group) => {
  if (group === 'txt') return t.contrast.white < 1.6 ? `<span class="badge plain">어두운 배경용</span>` : aaBadge(t.contrast.white);
  if (group === 'str') return `<span class="badge plain">흰 배경 ${t.contrast.white}</span>`;
  const onWhite = t.contrast.white >= t.contrast.black;
  return `${aaBadge(onWhite ? t.contrast.white : t.contrast.black)}<span class="badge-cap">${onWhite ? '흰' : '검은'} 글자</span>`;
};
const SCOPE_KO = { TEXT_FILL: '글자', FRAME_FILL: '프레임', SHAPE_FILL: '도형', STROKE_COLOR: '테두리', ALL_FILLS: '모든 채우기', ALL_SCOPES: '모든 속성' };
const scopeText = (t) => (t.scopes.length ? t.scopes.map((s) => SCOPE_KO[s] || s).join(' · ') : '목록에서 숨김');
const levelLabel = { error: '오류', warn: '확인 필요', info: '참고', ok: '의도함' };

// ---------- 화면 조각 ----------
function rampGroup(g) {
  return `
  <div class="group" data-group>
    <div class="group-head">
      <h3>${esc(g.label)}</h3>
      <code class="prefix">--color-${esc(g.cssKey)}-*</code>
      <span class="count">${g.tokens.length}</span>
    </div>
    <div class="ramp" style="--n:${g.tokens.length}">
      ${g.tokens.map((t) => {
        const used = usage[t.id]?.length || 0;
        return `
        <button class="chip" id="${slugId(t.name)}" data-search="${esc(`${t.name} ${t.cssVar} ${t.hex}`.toLowerCase())}" data-copy="var(${esc(t.cssVar)})"
          title="${esc(t.name)}${t.description ? ' · ' + esc(t.description) : ''}">
          <span class="chip-swatch" style="background:var(${esc(t.cssVar)});color:${onColor(t)}">
            <span class="chip-step">${esc(t.leaf)}</span>
            ${t.description.includes('메인') ? '<span class="chip-main">메인</span>' : ''}
          </span>
          <span class="chip-hex mono">${esc(t.hex)}</span>
          <span class="chip-use ${used ? 'on' : ''}">${used ? `시멘틱 ${used}` : '미사용'}</span>
        </button>`;
      }).join('')}
    </div>
  </div>`;
}

function cardGroup(g) {
  return `
  <div class="group" data-group>
    <div class="group-head">
      <h3>${esc(g.label)}</h3>
      <code class="prefix">--color-${esc(g.cssKey)}-*</code>
      <span class="count">${g.tokens.length}</span>
    </div>
    <div class="cards">
      ${g.tokens.map((t) => `
        <button class="card-chip" id="${slugId(t.name)}" data-search="${esc(`${t.name} ${t.cssVar} ${t.hex}`.toLowerCase())}" data-copy="var(${esc(t.cssVar)})">
          <span class="card-swatch" style="background:var(${esc(t.cssVar)})"></span>
          <span class="card-body">
            <strong>${esc(t.leaf)}</strong>
            <code>${esc(t.cssVar)}</code>
            <span class="mono sub">${esc(t.hex)}${usage[t.id] ? ` · 시멘틱 ${usage[t.id].length}` : ''}</span>
          </span>
          ${flagged.has(t.name) ? `<span class="flag ${flagged.get(t.name)}" title="점검 항목 있음"></span>` : ''}
        </button>`).join('')}
    </div>
  </div>`;
}

function semanticGroup(g) {
  return `
  <div class="group" data-group>
    <div class="group-head">
      <h3>${esc(g.label)}</h3>
      <code class="prefix">--color-${esc(g.cssKey)}${g.tokens.length > 1 || g.tokens[0].leaf ? '-*' : ''}</code>
      <span class="count">${g.tokens.length}</span>
    </div>
    <div class="table" role="table">
      <div class="tr th" role="row">
        <span>토큰</span><span>참조하는 원색</span><span>값</span><span>${g.key === 'txt' ? '흰 배경 대비' : g.key === 'str' ? '대비(참고)' : '위에 올릴 글자 대비'}</span>
      </div>
      ${g.tokens.map((t) => `
        <div class="tr" role="row" id="${slugId(t.name)}" data-search="${esc(`${t.name} ${t.cssVar} ${t.hex} ${t.alias?.name ?? ''}`.toLowerCase())}">
          <span class="tok">
            <span class="sw" style="background:var(${esc(t.cssVar)})"></span>
            <span>
              <strong>${esc(t.name)}</strong>
              <button class="copy mono" data-copy="var(${esc(t.cssVar)})">${esc(t.cssVar)}</button>
              <span class="scope">쓰는 곳: ${esc(scopeText(t))}</span>
            </span>
            ${flagged.has(t.name) ? `<span class="flag ${flagged.get(t.name)}" title="점검 항목 있음"></span>` : ''}
          </span>
          <span class="ref">
            ${t.chain.length ? t.chain.map((n, i) => `<a href="#${slugId(n)}" class="ref-chip ${i === t.chain.length - 1 ? 'end' : 'mid'}">${esc(n)}</a>`).join('<span class="arrow">→</span>') : '<span class="sub">직접 값</span>'}
          </span>
          <span class="mono val">${esc(t.hex)}</span>
          <span class="cc">${contrastCell(t, g.key)}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

function lintCard(l) {
  const tokens = l.tokens.length > 8 ? `<span class="sub">${l.tokens.length}개 토큰 전체</span>` :
    l.tokens.map((n) => `<a class="ref-chip" href="#${slugId(n)}">${esc(n)}</a>`).join('');
  return `
  <article class="lint ${l.level}">
    <span class="lint-level">${levelLabel[l.level]}</span>
    <div>
      <h4>${esc(l.title)}</h4>
      <p>${esc(l.detail)}</p>
      ${l.acknowledged ? `<p class="ack">디자이너 확인${l.acknowledged.at ? ' · ' + esc(l.acknowledged.at) : ''}${l.acknowledged.note ? ' — ' + esc(l.acknowledged.note) : ''}</p>` : ''}
      ${l.tokens.length ? `<div class="lint-tokens">${tokens}</div>` : ''}
    </div>
  </article>`;
}

// ---------- 페이지 ----------
const m = data.meta;
const figmaUrl = m.fileKey ? `https://www.figma.com/design/${m.fileKey}/` : null;
const counts = {
  primitive: primitives.reduce((s, c) => s + c.count, 0),
  semantic: semantics.reduce((s, c) => s + c.count, 0),
  warn: data.lint.filter((l) => l.level === 'warn' || l.level === 'error').length,
};


// ---------- 아이콘 ----------
const icons = iconData.icons;
const iconFlag = new Map();
for (const l of iconData.lint) if (l.level !== 'ok') for (const k of l.keys) if (!iconFlag.has(k)) iconFlag.set(k, l.level);
// 로고처럼 원래 여러 색인 게 당연한 아이콘은 '여러 색' 표시를 안 해요
const HIDE_MULTI_TAG = new Set(['google']);
const ICON_COLORS = [
  ['txt/black', '--color-txt-black'],
  ['txt/semiblack', '--color-txt-semiblack'],
  ['txt/unselected', '--color-txt-unselected'],
  ['txt/placeholder', '--color-txt-placeholder'],
  ['txt/primary', '--color-txt-primary'],
  ['txt/white', '--color-txt-white'],
];
const iconLintCard = (l) => lintCard({ ...l, tokens: [] }).replace('</h4>', '</h4>').replace(/<\/p>\s*<\/div>\s*<\/article>$/, `</p>${l.keys.length ? `<div class="lint-tokens">${l.keys.map((k) => `<a class="ref-chip" href="#ico-${esc(k)}">${esc(k)}</a>`).join('')}</div>` : ''}</div></article>`);
const iconWarn = iconData.lint.filter((l) => l.level === 'warn' || l.level === 'error').length;
const im = iconData.meta || {};
const iconFigmaUrl = im.fileKey ? `https://www.figma.com/design/${im.fileKey}/?node-id=${(im.frame || '').replace(':', '-')}` : null;

const iconView = () => `
    <header class="page-head">
      <p class="eyebrow">Foundations</p>
      <h1>Icon</h1>
      <p class="lead">피그마에서 이름이 <code>ic/</code>로 시작하는 아이콘 컴포넌트를 그대로 가져왔어요. 한 가지 색으로 된 아이콘은 놓인 곳의 글자색을 따라가서, 시멘틱 텍스트 토큰으로 색을 바꿀 수 있어요. 아이콘을 누르면 코드가 복사돼요.</p>
      <div class="meta">
        ${iconFigmaUrl ? `<a class="pill" href="${iconFigmaUrl}" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(im.exportedAt)}</span>
      </div>
    </header>

    <div class="stats">
      <div class="stat"><span>전체</span><strong>${icons.length}</strong></div>
      <div class="stat"><span>색 바꿀 수 있음</span><strong>${icons.filter((i) => i.type === 'mono').length}</strong></div>
      <a href="#icon-health" class="stat ${iconWarn ? 'warn' : ''}"><span>확인 필요</span><strong>${iconWarn}</strong></a>
    </div>

    <div class="search icon-tools">
      <input id="q" type="search" placeholder="아이콘 이름으로 찾기 (예: arr, star, batt)" autocomplete="off" />
      <div class="tool-row">
        <div class="seg" role="group" aria-label="미리보기 색">
          ${ICON_COLORS.map(([n, v], i) => `<button class="seg-btn swatch-btn ${i === 0 ? 'on' : ''}" data-ico-color="${v}" title="${n}" aria-label="${n}"><span style="background:var(${v})"></span></button>`).join('')}
        </div>
        <div class="seg" role="group" aria-label="크기">
          ${[16, 20, 24, 32].map((n) => `<button class="seg-btn ${n === 24 ? 'on' : ''}" data-ico-size="${n}">${n}</button>`).join('')}
        </div>
      </div>
    </div>

    <section class="section">
      <div class="icon-grid" id="iconGrid" style="--ico-color: var(--color-txt-black); --ico-size: 24px">
        ${icons.map((i) => `
          <button class="ico" id="ico-${esc(i.key)}" data-search="${esc(`${i.key} ${i.figmaName}`.toLowerCase())}" data-copy="icon('${esc(i.key)}')" title="${esc(i.figmaName)}">
            <span class="ico-art ${i.type}">${i.svg.replace('<svg', '<svg aria-hidden="true"')}</span>
            <span class="ico-name">${esc(i.key)}</span>
            ${i.type === 'multi' && !HIDE_MULTI_TAG.has(i.key) ? '<span class="ico-tag">여러 색</span>' : ''}
            ${iconFlag.has(i.key) ? `<span class="flag ${iconFlag.get(i.key)}" title="점검 항목 있음"></span>` : ''}
          </button>`).join('')}
      </div>
      <p class="sub legend">"여러 색" 아이콘은 피그마 색을 그대로 써서 미리보기 색이 바뀌지 않아요.</p>
    </section>

    <section id="icon-health" class="section">
      <div class="section-head">
        <h2>점검 <span class="sub">${iconData.lint.filter((l) => l.level !== 'ok').length}개 항목</span></h2>
        <p>아이콘을 동기화할 때마다 다시 검사해요.</p>
      </div>
      <div class="lints">${iconData.lint.filter((l) => l.level !== 'ok').map(iconLintCard).join('') || '<p class="sub">발견된 문제가 없어요.</p>'}</div>
      ${iconData.lint.some((l) => l.level === 'ok') ? `<h3 class="lint-sub">의도한 결정</h3><div class="lints">${iconData.lint.filter((l) => l.level === 'ok').map(iconLintCard).join('')}</div>` : ''}
    </section>

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>import { icon } from '/src/icons/icons.js';

// 기본 24px, 놓인 곳의 글자색을 따라가요
button.innerHTML = icon('home');

// 크기 지정 + 화면낭독기용 이름
button.innerHTML = icon('arr-right', { size: 20, label: '다음' });

/* 색은 CSS로 */
.tab.active { color: var(--color-txt-primary); }</code></pre>
    </section>
`;

// ---------- 타이포그래피 ----------
const tstyles = typeData.styles;
const typeFlag = new Map();
for (const l of typeData.lint) if (l.level !== 'ok') for (const k of l.keys) if (!typeFlag.has(k) && l.rule !== 'type-case') typeFlag.set(k, l.level);
const keyLintCard = (prefix) => (l) => lintCard({ ...l, tokens: [] }).replace(/<\/p>\s*<\/div>\s*<\/article>$/, `</p>${l.keys.length && l.keys.length <= 8 ? `<div class="lint-tokens">${l.keys.map((k) => `<a class="ref-chip" href="#${prefix}${esc(k)}">${esc(k)}</a>`).join('')}</div>` : ''}</div></article>`);
const typeWarn = typeData.lint.filter((l) => l.level === 'warn' || l.level === 'error').length;
const tm = typeData.meta || {};
const SAMPLE = '핑으로 오늘을 기록해요 Fing 2026';

const typeView = () => `
    <header class="page-head">
      <p class="eyebrow">Foundations</p>
      <h1>Typography</h1>
      <p class="lead">피그마 텍스트 스타일에서 자동으로 만들어진 글자 스타일이에요. 클래스 이름을 누르면 복사돼요.</p>
      <div class="meta">
        ${tm.fileKey ? `<a class="pill" href="https://www.figma.com/design/${tm.fileKey}/" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(tm.exportedAt)}</span>
      </div>
    </header>

    <div class="stats">
      <div class="stat"><span>스타일</span><strong>${tstyles.length}</strong></div>
      <div class="stat"><span>글꼴</span><strong>${new Set(tstyles.map((t) => t.family)).size}</strong></div>
      <a href="#type-health" class="stat ${typeWarn ? 'warn' : ''}"><span>확인 필요</span><strong>${typeWarn}</strong></a>
    </div>

    <div class="search">
      <input id="sample" type="text" value="${SAMPLE}" placeholder="미리 볼 문장을 입력하세요" autocomplete="off" aria-label="미리보기 문장" />
    </div>

    <section class="section">
      <div class="type-list">
        ${tstyles.map((t) => `
          <article class="type-row" id="type-${esc(t.key)}">
            <div class="type-meta">
              <strong>${esc(t.name)}</strong>
              <button class="copy mono" data-copy="${esc(t.className)}">.${esc(t.className)}</button>
              <div class="type-specs">
                <span>${esc(t.family)} ${esc(t.style)} · ${t.weight}</span>
                <span>${t.size} / ${t.lineHeightPx}</span>
                ${t.letterSpacing !== '0' ? `<span>자간 ${esc(t.letterSpacing)}</span>` : ''}
              </div>
              ${typeFlag.has(t.key) ? `<span class="flag ${typeFlag.get(t.key)}" title="점검 항목 있음"></span>` : ''}
            </div>
            <p class="type-sample ${esc(t.className)}" data-sample>${SAMPLE}</p>
          </article>`).join('')}
      </div>
    </section>

    <section id="type-health" class="section">
      <div class="section-head">
        <h2>점검 <span class="sub">${typeData.lint.filter((l) => l.level !== 'ok').length}개 항목</span></h2>
        <p>텍스트 스타일을 동기화할 때마다 다시 검사해요.</p>
      </div>
      <div class="lints">${typeData.lint.filter((l) => l.level !== 'ok').map(keyLintCard('type-')).join('') || '<p class="sub">발견된 문제가 없어요.</p>'}</div>
      ${typeData.lint.some((l) => l.level === 'ok') ? `<h3 class="lint-sub">의도한 결정</h3><div class="lints">${typeData.lint.filter((l) => l.level === 'ok').map(keyLintCard('type-')).join('')}</div>` : ''}
    </section>

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>&lt;!-- 클래스로 --&gt;
&lt;h1 class="t-title-1"&gt;오늘의 기록&lt;/h1&gt;

/* CSS에서 직접 */
.card-title {
  font: var(--text-title-3);
  color: var(--color-txt-black);
}</code></pre>
    </section>
`;

const colorView = () => `
    <header class="page-head">
      <p class="eyebrow">Foundations</p>
      <h1>Color</h1>
      <p class="lead">피그마 <strong>${esc(m.fileName)}</strong> 파일의 변수에서 자동으로 만들어진 색상 토큰이에요. 칩이나 변수 이름을 누르면 <code>var(--…)</code>가 복사돼요.</p>
      <div class="meta">
        ${figmaUrl ? `<a class="pill" href="${figmaUrl}" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(m.exportedAt)}</span>
        ${m.counts.other ? `<span class="pill ghost">색상 외 변수 ${m.counts.other}개는 다음 단계에서</span>` : ''}
      </div>
    </header>

    <div class="stats">
      <a href="#primitive" class="stat"><span>원색</span><strong>${counts.primitive}</strong></a>
      <a href="#semantic" class="stat"><span>시멘틱</span><strong>${counts.semantic}</strong></a>
      <a href="#health" class="stat ${counts.warn ? 'warn' : ''}"><span>확인 필요</span><strong>${counts.warn}</strong></a>
    </div>

    <div class="search">
      <input id="q" type="search" placeholder="이름, CSS 변수, HEX로 찾기 (예: 400, txt, #1769FF)" autocomplete="off" />
    </div>

    ${primitives.map((c) => `
    <section id="primitive" class="section">
      <div class="section-head">
        <h2>${esc(c.label)} <span class="sub">${esc(c.name)}</span></h2>
        <p>실제 색 값이 들어있는 기본 팔레트예요. 화면에서는 직접 쓰지 않고, 아래 시멘틱 토큰이 이 색들을 참조해요.</p>
      </div>
      ${c.groups.map((g) => (g.isRamp ? rampGroup(g) : cardGroup(g))).join('')}
    </section>`).join('')}

    ${semantics.map((c) => `
    <section id="semantic" class="section">
      <div class="section-head">
        <h2>${esc(c.label)} <span class="sub">${esc(c.name)}</span></h2>
        <p>용도에 이름을 붙인 토큰이에요. 화면을 퍼블리싱할 때는 이 토큰만 써요. 참조 경로를 누르면 원색으로 이동해요.</p>
      </div>
      ${c.groups.map(semanticGroup).join('')}
    </section>`).join('')}

    <section id="health" class="section">
      <div class="section-head">
        <h2>점검 <span class="sub">${data.lint.filter((l) => l.level !== 'ok').length}개 항목</span></h2>
        <p>동기화할 때마다 자동으로 다시 검사해요. 피그마에서 고치면 이 목록에서 사라져요.</p>
      </div>
      <div class="lints">${data.lint.filter((l) => l.level !== 'ok').map(lintCard).join('') || '<p class="sub">발견된 문제가 없어요.</p>'}</div>
      ${data.lint.some((l) => l.level === 'ok') ? `
      <h3 class="lint-sub">의도한 결정 <span class="sub">${data.lint.filter((l) => l.level === 'ok').length}개</span></h3>
      <p class="sub lint-sub-desc">점검에 걸렸지만 일부러 그렇게 정한 항목이에요. tokens/lint-config.json에서 관리해요.</p>
      <div class="lints">${data.lint.filter((l) => l.level === 'ok').map(lintCard).join('')}</div>` : ''}
    </section>

    <section id="usage" class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>.button-primary {
  background: var(--color-btn-default);
  color: var(--color-txt-white);
}
.button-primary:active {
  background: var(--color-btn-default-press);
}</code></pre>
    </section>
`;

$app.innerHTML = `
<div class="layout">
  <aside class="side">
    <div class="brand"><span class="logo"></span><span>Fing <em>Design System</em></span></div>
    <nav>
      <p class="nav-title">Foundations</p>
      <a href="#color" data-view="color">Color <span class="nav-n">${all.length}</span></a>
      <a href="#type" data-view="type">Typography <span class="nav-n">${typeData.styles.length}</span></a>
      <a href="#icon" data-view="icon">Icon <span class="nav-n">${iconData.icons.length}</span></a>
      <span class="soon">Spacing</span>
      <span class="soon">Radius</span>
      <span class="soon">Effect</span>
      <p class="nav-title">Components</p>
      <span class="soon">Button</span>
      <span class="soon">Input</span>
    </nav>
    <div class="sync" id="sync">
      <span class="dot"></span>
      <span class="sync-text">정적 미리보기</span>
    </div>
  </aside>

  <main id="top"></main>

</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
`;


// ---------- 화면 전환 (#color / #icon) ----------
const VIEWS = { color: colorView, type: typeView, icon: iconView };
const main = document.getElementById('top');
let current = null;
function route() {
  const name = location.hash.slice(1);
  if (current && !VIEWS[name]) return; // 화면 안의 이동 링크(#primitive 등)는 그대로 둠
  const view = VIEWS[name] ? name : 'color';
  if (view === current) return;
  current = view;
  main.innerHTML = VIEWS[view]();
  document.querySelectorAll('nav a[data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === view));
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();

// ---------- 동작 ----------
const toast = document.getElementById('toast');
let toastTimer;
const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
};

document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-copy]');
  if (!el) return;
  try { await navigator.clipboard.writeText(el.dataset.copy); showToast(`${el.dataset.copy} 복사됨`); }
  catch { showToast(el.dataset.copy); }
});

// 참조 칩을 누르면 해당 토큰으로 이동 + 깜빡임
document.addEventListener('click', (e) => {
  const a = e.target.closest('a.ref-chip');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.classList.remove('flash');
  void target.offsetWidth;
  target.classList.add('flash');
});

// 검색
document.addEventListener('input', (e) => {
  if (e.target.id === 'sample') {
    const v = e.target.value || ' ';
    document.querySelectorAll('[data-sample]').forEach((el) => (el.textContent = v));
    return;
  }
  if (e.target.id !== 'q') return;
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('[data-search]').forEach((el) => el.classList.toggle('dim', !!q && !el.dataset.search.includes(q)));
  document.querySelectorAll('[data-group]').forEach((g) => {
    const items = g.querySelectorAll('[data-search]');
    g.classList.toggle('hidden', !!q && [...items].every((i) => i.classList.contains('dim')));
  });
});

// 아이콘 미리보기 색·크기
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-ico-color],[data-ico-size]');
  if (!b) return;
  const grid = document.getElementById('iconGrid');
  if (b.dataset.icoColor) {
    grid.style.setProperty('--ico-color', `var(${b.dataset.icoColor})`);
    grid.classList.toggle('on-dark', b.dataset.icoColor === '--color-txt-white');
  } else grid.style.setProperty('--ico-size', b.dataset.icoSize + 'px');
  b.parentElement.querySelectorAll('.seg-btn').forEach((x) => x.classList.toggle('on', x === b));
});

// 개발 서버에서 열었으면 동기화 연결 상태 표시
if (import.meta.env.DEV) {
  const box = document.getElementById('sync');
  const check = async () => {
    try {
      const r = await fetch('/__figma-sync');
      const j = await r.json();
      box.className = 'sync live';
      box.querySelector('.sync-text').textContent = j.error ? `동기화 오류: ${j.error}` : '피그마 동기화 대기 중';
    } catch {
      box.className = 'sync';
      box.querySelector('.sync-text').textContent = '동기화 서버 연결 안 됨';
    }
  };
  check();
}
