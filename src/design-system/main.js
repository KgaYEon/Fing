// 디자인시스템 페이지 — src/tokens/tokens.json 을 읽어 자동으로 그립니다.
// 피그마에서 변수를 고치면 tokens.json 이 다시 만들어지고, 이 페이지도 그대로 따라 바뀝니다.
import data from '../tokens/tokens.json';
import iconData from '../icons/icons.json';
import typeData from '../tokens/typography.json';
import compData from '../components/components.json';
import spaceData from '../tokens/spacing.json';
import radiusData from '../tokens/radius.json';
import effectData from '../tokens/effects.json';
import { components as uiComponents } from '../ui/registry.js';
import { enhance } from '../ui/ui.js';

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
  if (ratio >= 7) return `<span class="ds-badge ok">AAA ${ratio}</span>`;
  if (ratio >= 4.5) return `<span class="ds-badge ok">AA ${ratio}</span>`;
  if (ratio >= 3) return `<span class="ds-badge mid">AA Large ${ratio}</span>`;
  return `<span class="ds-badge bad">${ratio}</span>`;
};
// 역할별 대비: 텍스트는 흰 배경 위, 배경/버튼은 그 위 글자, 테두리는 참고용 수치
const contrastCell = (t, group) => {
  if (group === 'txt') return t.contrast.white < 1.6 ? `<span class="ds-badge plain">어두운 배경용</span>` : aaBadge(t.contrast.white);
  if (group === 'str') return `<span class="ds-badge plain">흰 배경 ${t.contrast.white}</span>`;
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
        <button class="ds-chip" id="${slugId(t.name)}" data-search="${esc(`${t.name} ${t.cssVar} ${t.hex}`.toLowerCase())}" data-copy="var(${esc(t.cssVar)})"
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

// ---------- 컴포넌트 ----------
const compLintFor = (set) => compData.lint.filter((l) => l.title.startsWith(set.name));
const tokenChip = (c) => (c ? `<span class="tchip"><span class="sw sm" style="background:${c.css}"></span>${c.token ? esc(c.token) : `<em>${esc(c.hex)}</em>`}</span>` : '<span class="sub">—</span>');
const componentView = (set) => () => {
  const colorKey = set.otherKeys[0];
  const colors = colorKey ? set.options[colorKey] : [null];
  const states = set.stateKey ? set.options[set.stateKey] : [null];
  const find = (c, st) => set.variants.find((v) => (!colorKey || v.props[colorKey] === c) && (!set.stateKey || v.props[set.stateKey] === st));
  const stateCls = (st) => (st && st !== set.defaults[set.stateKey] ? ` is-${st}` : '');
  const lints = compLintFor(set);
  const warn = lints.filter((l) => l.level === 'warn' || l.level === 'error').length;
  const v0 = set.variants[0];
  return `
    <header class="page-head">
      <p class="eyebrow">Components</p>
      <h1>${esc(set.name)}</h1>
      <p class="lead">피그마 ${esc(set.name)} 컴포넌트에서 자동으로 만들어졌어요. 아래 버튼은 진짜 코드 버튼이라 눌러볼 수 있어요. 클래스 이름을 누르면 복사돼요.</p>
      <div class="meta">
        ${compData.meta?.fileKey ? `<a class="pill" href="https://www.figma.com/design/${compData.meta.fileKey}/?node-id=${set.id.replace(':', '-')}" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(compData.meta?.exportedAt)}</span>
      </div>
    </header>

    <div class="stats">
      <div class="stat"><span>${esc(colorKey || 'variant')}</span><strong>${colors.length}</strong></div>
      <div class="stat"><span>${esc(set.stateKey || 'state')}</span><strong>${states.length}</strong></div>
      <a href="#comp-health" class="stat ${warn ? 'warn' : ''}"><span>확인 필요</span><strong>${warn}</strong></a>
    </div>

    <div class="search">
      <input id="btnLabel" type="text" value="${esc(set.textProp)}" placeholder="버튼 글자" autocomplete="off" aria-label="버튼 글자" />
    </div>

    <section class="section">
      <div class="comp-grid" style="--cols:${states.length}">
        <div class="comp-head"><span></span>${states.map((st) => `<span>${esc(st || '')}${st === set.defaults[set.stateKey] ? ' (기본)' : ''}</span>`).join('')}</div>
        ${colors.map((c) => {
          const base = find(c, set.defaults[set.stateKey]);
          const cls = `${set.className}${base?.modifier ? ' ' + base.modifier : ''}`;
          return `
          <div class="comp-row">
            <div class="comp-label">
              <strong>${esc(c || set.name)}</strong>
              <button class="copy mono" data-copy='class="${esc(cls)}"'>.${esc(cls.replace(/ /g, '.'))}</button>
            </div>
            ${states.map((st) => {
              const v = find(c, st);
              if (!v) return `<div class="comp-cell empty"><span>피그마에 없음</span></div>`;
              return `<div class="comp-cell">
                <button class="${esc(cls)}${stateCls(st)}" type="button" data-label>${esc(set.textProp)}</button>
                <div class="comp-tokens">${tokenChip(v.bg)}${tokenChip(v.fg)}</div>
              </div>`;
            }).join('')}
          </div>`;
        }).join('')}
      </div>
      <p class="sub legend">각 칸 아래는 배경 색 · 글자 색 토큰이에요. 기울어진 글씨는 토큰에 연결 안 된 색이에요.</p>
    </section>

    <section class="section">
      <div class="section-head"><h2>공통 규격</h2></div>
      <div class="spec-row">
        <span><em>높이</em>${v0.height}px</span>
        <span><em>너비</em>꽉 차게 (피그마 ${v0.width}px)</span>
        <span><em>안쪽 여백</em>${v0.padding[0]} / ${v0.padding[1]}px</span>
        <span><em>모서리</em>${v0.radius}px</span>
        <span><em>글자</em>${esc(v0.textStyle || '—')}</span>
      </div>
    </section>

    <section id="comp-health" class="section">
      <div class="section-head">
        <h2>점검 <span class="sub">${lints.filter((l) => l.level !== 'ok').length}개 항목</span></h2>
        <p>컴포넌트를 동기화할 때마다 다시 검사해요.</p>
      </div>
      <div class="lints">${lints.filter((l) => l.level !== 'ok').map((l) => lintCard({ ...l, tokens: [] })).join('') || '<p class="sub">발견된 문제가 없어요.</p>'}</div>
      ${lints.some((l) => l.level === 'ok') ? `<h3 class="lint-sub">의도한 결정</h3><div class="lints">${lints.filter((l) => l.level === 'ok').map((l) => lintCard({ ...l, tokens: [] })).join('')}</div>` : ''}
    </section>

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>&lt;button class="${esc(set.className)}"&gt;확인&lt;/button&gt;
${colors.filter((c) => c && c !== set.defaults[colorKey]).map((c) => `&lt;button class="${esc(set.className)} ${esc(set.className)}--${esc(c)}"&gt;확인&lt;/button&gt;`).join('\n')}</code></pre>
    </section>
  `;
};

// ---------- 간격 ----------
const spaceView = () => {
  const steps = spaceData.steps;
  const max = Math.max(...steps.map((s) => s.value), 1);
  const lints = spaceData.lint;
  const warn = lints.filter((l) => l.level === 'warn' || l.level === 'error').length;
  return `
    <header class="page-head">
      <p class="eyebrow">Foundations</p>
      <h1>Spacing</h1>
      <p class="lead">모든 간격은 <strong>${spaceData.base}px 단위</strong>로 맞춰요. 피그마 Spacing 변수에서 자동으로 만들어졌고, 피그마에서는 여백·간격 자리에서만 고를 수 있어요. 이름을 누르면 복사돼요.</p>
      <div class="meta">
        ${spaceData.meta?.fileKey ? `<a class="pill" href="https://www.figma.com/design/${spaceData.meta.fileKey}/" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(spaceData.meta?.exportedAt)}</span>
      </div>
    </header>

    <div class="stats">
      <div class="stat"><span>기준 단위</span><strong>${spaceData.base}px</strong></div>
      <div class="stat"><span>단계</span><strong>${steps.length}</strong></div>
      <div class="stat ${warn ? 'warn' : ''}"><span>확인 필요</span><strong>${warn}</strong></div>
    </div>

    <section class="section">
      <div class="space-list">
        <div class="space-row space-head"><span>토큰</span><span>값</span><span>크기</span></div>
        ${steps.map((s) => `
          <div class="space-row" id="space-${esc(s.key)}">
            <span class="space-name">
              <strong>${esc(s.name)}</strong>
              <button class="copy mono" data-copy="var(${esc(s.cssVar)})">${esc(s.cssVar)}</button>
            </span>
            <span class="space-val mono">${s.value}px <em>${s.value / spaceData.base}칸</em></span>
            <span class="space-bar-wrap"><span class="space-bar" style="width:calc(${(s.value / max) * 100}% );min-width:${s.value}px;max-width:100%"></span></span>
          </div>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>어디에 쓰나요</h2><p>같은 값이라도 이렇게 나눠 쓰면 화면 리듬이 일정해져요. 정해진 규칙은 아니고 출발점이에요.</p></div>
      <div class="space-guide">
        <div><strong>4 · 8</strong><span>아이콘과 글자 사이, 칩 안쪽처럼 아주 가까운 것</span></div>
        <div><strong>12 · 16</strong><span>목록 항목 사이, 카드 안쪽 여백</span></div>
        <div><strong>20 · 24</strong><span>화면 좌우 여백, 버튼 안쪽 여백</span></div>
        <div><strong>32 이상</strong><span>섹션과 섹션 사이</span></div>
      </div>
    </section>

    ${lints.length ? `<section class="section"><div class="section-head"><h2>점검</h2></div><div class="lints">${lints.map((l) => lintCard({ ...l, tokens: [] })).join('')}</div></section>` : ''}

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>.card {
  padding: var(--space-16) var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}</code></pre>
    </section>
  `;
};

// ---------- 둥글기 ----------
const radiusView = () => {
  const steps = radiusData.steps;
  const warn = radiusData.lint.filter((l) => l.level === 'warn' || l.level === 'error').length;
  const usage = { '4': '작은 배지, 체크박스', '8': '칩, 작은 입력칸', '12': '작은 카드, 썸네일', '16': '버튼, 카드', '24': '시트, 모달 윗부분', full: '알약 모양 버튼·태그, 동그란 프로필' };
  return `
    <header class="page-head">
      <p class="eyebrow">Foundations</p>
      <h1>Radius</h1>
      <p class="lead">모서리 둥글기는 <strong>${steps.length}단계</strong>만 써요. 피그마 Radius 변수에서 자동으로 만들어졌고, 피그마에서는 모서리 둥글기 자리에서만 고를 수 있어요. 이름을 누르면 복사돼요.</p>
      <div class="meta">
        ${radiusData.meta?.fileKey ? `<a class="pill" href="https://www.figma.com/design/${radiusData.meta.fileKey}/" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(radiusData.meta?.exportedAt)}</span>
      </div>
    </header>

    <div class="stats">
      <div class="stat"><span>단계</span><strong>${steps.length}</strong></div>
      <div class="stat"><span>가장 많이 쓰는 값</span><strong>16px</strong></div>
      <div class="stat ${warn ? 'warn' : ''}"><span>확인 필요</span><strong>${warn}</strong></div>
    </div>

    <section class="section">
      <div class="radius-grid">
        ${steps.map((s) => `
          <button class="radius-card" id="radius-${esc(s.key)}" data-copy="var(${esc(s.cssVar)})">
            <span class="radius-demo" style="border-radius:var(${esc(s.cssVar)})"></span>
            <span class="radius-meta">
              <strong>${esc(s.name)}</strong>
              <code>${esc(s.cssVar)}</code>
              <span class="sub">${s.key === 'full' ? `${s.value}px · 완전히 둥글게` : `${s.value}px`}</span>
              ${usage[s.key] ? `<span class="radius-use">${usage[s.key]}</span>` : ''}
            </span>
          </button>`).join('')}
      </div>
    </section>

    ${radiusData.lint.length ? `<section class="section"><div class="section-head"><h2>점검</h2></div><div class="lints">${radiusData.lint.map((l) => lintCard({ ...l, tokens: [] })).join('')}</div></section>` : ''}

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>.card { border-radius: var(--radius-16); }
.tag  { border-radius: var(--radius-full); }</code></pre>
    </section>
  `;
};

// ---------- 그림자 ----------
const effectView = () => {
  const styles = effectData.styles;
  return `
    <header class="page-head">
      <p class="eyebrow">Foundations</p>
      <h1>Effect</h1>
      <p class="lead">그림자는 <strong>${styles.length}단계</strong>만 써요. 피그마 이펙트 스타일에서 자동으로 만들어졌어요. 이름을 누르면 복사돼요.</p>
      <div class="meta">
        ${effectData.meta?.fileKey ? `<a class="pill" href="https://www.figma.com/design/${effectData.meta.fileKey}/" target="_blank" rel="noopener">피그마 원본 열기 ↗</a>` : ''}
        <span class="pill ghost">마지막 동기화 ${fmtDate(effectData.meta?.exportedAt)}</span>
      </div>
    </header>

    <section class="section">
      <div class="effect-grid">
        ${styles.map((s) => `
          <button class="effect-card" id="effect-${esc(s.key)}" data-copy="var(${esc(s.cssVar)})">
            <span class="effect-stage"><span class="effect-demo" style="box-shadow:var(${esc(s.cssVar)})"></span></span>
            <span class="effect-meta">
              <strong>${esc(s.name)}</strong>
              <code>${esc(s.cssVar)}</code>
              ${s.description ? `<span class="sub">${esc(s.description)}</span>` : ''}
              ${s.layers.map((l) => `<span class="effect-spec mono">y ${l.y} · 흐림 ${l.blur} · ${esc(l.rgba)}</span>`).join('')}
            </span>
          </button>`).join('')}
      </div>
    </section>

    ${effectData.lint.length ? `<section class="section"><div class="section-head"><h2>점검</h2></div><div class="lints">${effectData.lint.map((l) => lintCard({ ...l, tokens: [] })).join('')}</div></section>` : ''}

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2></div>
      <pre class="code"><code>.card   { box-shadow: var(--shadow-sm); }
.header { box-shadow: var(--shadow-md); }</code></pre>
    </section>
  `;
};

// ---------- 직접 만든 컴포넌트 ----------
const FIGMA_KEY = 'ePI19exWQwYPCHpC27V2G8';
const uiView = (c) => () => `
    <header class="page-head">
      <p class="eyebrow">Components</p>
      <h1>${esc(c.name)}</h1>
      <p class="lead">${esc(c.lead)}</p>
      <div class="meta">
        <a class="pill" href="https://www.figma.com/design/${FIGMA_KEY}/?node-id=${c.figmaId.replace(':', '-')}" target="_blank" rel="noopener">피그마 "${esc(c.figma)}" 열기 ↗</a>
        <span class="pill ghost">코드로 직접 만듦 · src/ui/${esc(c.file)}</span>
      </div>
    </header>

    <section class="section">
      <div class="ui-demos ${c.wide ? 'is-wide' : ''}">
        ${c.demos.map((d) => `<figure class="ui-demo"><div class="ui-stage">${d.html}</div><figcaption>${esc(d.label)}</figcaption></figure>`).join('')}
      </div>
    </section>

    ${c.notes.length ? `
    <section class="section">
      <div class="section-head"><h2>피그마에서 확인할 점 <span class="sub">${c.notes.length}개</span></h2><p>코드로 옮기다가 발견한 거예요. 피그마에서 고치면 다음 동기화 때 반영할게요.</p></div>
      <ul class="ui-notes">${c.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    </section>` : ''}

    <section class="section">
      <div class="section-head"><h2>코드에서 쓰는 법</h2><p>색·간격·글자·둥글기는 토큰을 써서 피그마를 따라가요. 모양(구조)을 바꾸면 말씀해 주세요.</p></div>
      <pre class="code"><code>${c.codeHtml}</code></pre>
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
    <div class="brand"><span class="ds-logo"></span><span>Fing <em>Design System</em></span></div>
    <nav aria-label="디자인시스템 메뉴">
      <details class="nav-group" data-group="foundations" open>
        <summary class="nav-title">Foundations <span class="nav-count">6</span></summary>
        <div class="nav-items">
          <a href="#color" data-view="color">Color <span class="nav-n">${all.length}</span></a>
          <a href="#type" data-view="type">Typography <span class="nav-n">${typeData.styles.length}</span></a>
          <a href="#space" data-view="space">Spacing <span class="nav-n">${spaceData.steps.length}</span></a>
          <a href="#radius" data-view="radius">Radius <span class="nav-n">${radiusData.steps.length}</span></a>
          <a href="#effect" data-view="effect">Effect <span class="nav-n">${effectData.styles.length}</span></a>
          <a href="#icon" data-view="icon">Icon <span class="nav-n">${iconData.icons.length}</span></a>
        </div>
      </details>
      <details class="nav-group" data-group="components" open>
        <summary class="nav-title">Components <span class="nav-count">${compData.sets.length + uiComponents.length}</span></summary>
        <div class="nav-items">
          ${compData.sets.map((c) => `<a href="#c-${esc(c.className)}" data-view="c-${esc(c.className)}">${esc(c.name)} <span class="nav-n">${c.variants.length}</span></a>`).join('')}
          ${uiComponents.map((c) => `<a href="#u-${c.key}" data-view="u-${c.key}">${esc(c.name)}</a>`).join('')}
        </div>
      </details>
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
const VIEWS = { color: colorView, type: typeView, space: spaceView, radius: radiusView, effect: effectView, icon: iconView };
for (const set of compData.sets) VIEWS[`c-${set.className}`] = componentView(set);
for (const c of uiComponents) VIEWS[`u-${c.key}`] = uiView(c);
const main = document.getElementById('top');
let current = null;
function route() {
  const name = location.hash.slice(1);
  if (current && !VIEWS[name]) return; // 화면 안의 이동 링크(#primitive 등)는 그대로 둠
  const view = VIEWS[name] ? name : 'color';
  if (view === current) return;
  current = view;
  main.innerHTML = VIEWS[view]();
  document.querySelectorAll('.side nav a[data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === view));
  const activeLink = document.querySelector(`.side nav a[data-view="${view}"]`);
  if (activeLink) { const g = activeLink.closest('details'); if (g && !g.open) g.open = true; activeLink.scrollIntoView({ block: 'nearest' }); }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

// 메뉴 묶음 접기/펴기 — 내 브라우저에 기억해둬요
const NAV_KEY = 'fing-ds-nav';
let navState = {};
try { navState = JSON.parse(localStorage.getItem(NAV_KEY) || '{}'); } catch {}
document.querySelectorAll('.nav-group').forEach((g) => {
  if (navState[g.dataset.group] === false) g.open = false;
  g.addEventListener('toggle', () => {
    navState[g.dataset.group] = g.open;
    try { localStorage.setItem(NAV_KEY, JSON.stringify(navState)); } catch {}
  });
});
route();

// ---------- 동작 ----------
enhance(document);
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
  if (e.target.id === 'btnLabel') {
    const v = e.target.value || ' ';
    document.querySelectorAll('[data-label]').forEach((el) => (el.textContent = v));
    return;
  }
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
