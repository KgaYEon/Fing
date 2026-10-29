// 디자인시스템 페이지 — src/tokens/tokens.json 을 읽어 자동으로 그립니다.
// 피그마에서 변수를 고치면 tokens.json 이 다시 만들어지고, 이 페이지도 그대로 따라 바뀝니다.
import data from '../tokens/tokens.json';

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

$app.innerHTML = `
<div class="layout">
  <aside class="side">
    <div class="brand"><span class="logo"></span><span>Fing <em>Design System</em></span></div>
    <nav>
      <p class="nav-title">Foundations</p>
      <a class="active" href="#top">Color <span class="nav-n">${all.length}</span></a>
      <span class="soon">Typography</span>
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

  <main id="top">
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
  </main>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

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
document.getElementById('q').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('[data-search]').forEach((el) => el.classList.toggle('dim', !!q && !el.dataset.search.includes(q)));
  document.querySelectorAll('[data-group]').forEach((g) => {
    const items = g.querySelectorAll('[data-search]');
    g.classList.toggle('hidden', !!q && [...items].every((i) => i.classList.contains('dim')));
  });
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
