// 피그마 컴포넌트(figma/components.raw.json) → 코드용 CSS
//   - src/components/components.css  : .button, .button--secondary 같은 클래스
//   - src/components/components.json : 디자인시스템 페이지용 데이터 (+ 점검 결과)
// 규칙
//   - 클래스 이름 = 컴포넌트 이름 (Button → .button)
//   - 기본값 조합(color=primary, state=default)이 .button 자체 모양
//   - 다른 variant 값은 .button--값 (예: .button--danger)
//   - state=hover/pressed → :hover, :active / state=disabled → :disabled
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastSyncOf } from './figma-raw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/components.raw.json'),
  list: resolve(ROOT, 'tokens/components.json'),
  tokens: resolve(ROOT, 'src/tokens/tokens.json'),
  type: resolve(ROOT, 'src/tokens/typography.json'),
  spacing: resolve(ROOT, 'src/tokens/spacing.json'),
  radius: resolve(ROOT, 'src/tokens/radius.json'),
  lintConfig: resolve(ROOT, 'tokens/lint-config.json'),
  css: resolve(ROOT, 'src/components/components.css'),
  json: resolve(ROOT, 'src/components/components.json'),
};
const read = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };
const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const STATE_SEL = {
  hover: [':hover', ':active', '.is-hover'],
  pressed: [':active', '.is-pressed'],
  active: [':active', '.is-active'],
  focus: [':focus-visible', '.is-focus'],
  disabled: [':disabled', '.is-disabled'],
};

export function buildComponents({ write = true } = {}) {
  if (!existsSync(P.raw)) return { components: 0, lint: 0 };
  const raw = read(P.raw);
  const tokens = read(P.tokens);
  const type = read(P.type);
  const spacing = read(P.spacing);
  const spaceBy = Object.fromEntries((spacing?.steps || []).map((s) => [s.value, s]));
  const BASE = spacing?.base || 4;
  // 간격 값 → 토큰이 있으면 var(--space-N), 없으면 px 그대로
  const radiusBy = Object.fromEntries((read(P.radius)?.steps || []).map((s) => [s.value, s]));
  const rd = (n) => (!n ? '0' : radiusBy[n] ? `var(${radiusBy[n].cssVar})` : `${n}px`);
  const sp = (n) => (n === 0 ? '0' : spaceBy[n] ? `var(${spaceBy[n].cssVar})` : `${n}px`);
  const tokenByName = {};
  for (const c of tokens?.collections || []) for (const g of c.groups) for (const t of g.tokens) tokenByName[t.name] = t;
  const typeByName = Object.fromEntries((type?.styles || []).map((s) => [s.name, s]));

  const lint = [];
  const css = ['/* ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 피그마 컴포넌트를 고치고 동기화하세요. */', ''];
  const sets = [];

  for (const set of raw.componentSets) {
    const cls = slug(set.name);
    const variantProps = Object.entries(set.props).filter(([, d]) => d.type === 'VARIANT');
    const stateKey = variantProps.find(([k]) => k.toLowerCase() === 'state')?.[0];
    const otherKeys = variantProps.map(([k]) => k).filter((k) => k !== stateKey);
    const defaults = Object.fromEntries(variantProps.map(([k, d]) => [k, d.defaultValue]));

    const color = (paint, where, v) => {
      if (!paint) return null;
      if (paint.var && tokenByName[paint.var]) return { css: `var(${tokenByName[paint.var].cssVar})`, token: paint.var, hex: paint.hex };
      lint.push({ level: 'warn', rule: 'comp-unbound', title: `${set.name} "${v.name}"의 ${where} 색이 토큰에 연결 안 돼 있어요`, detail: `${paint.hex}가 직접 들어가 있어요. 피그마에서 색 변수를 연결하면 색을 바꿀 때 같이 바뀌어요. 코드에서는 일단 ${paint.hex}를 그대로 썼어요.`, keys: [v.name] });
      return { css: paint.hex, token: null, hex: paint.hex };
    };

    // 같은 조합이 두 번 있는지
    const seen = {};
    const variants = [];
    for (const v of set.variants) {
      const sig = variantProps.map(([k]) => `${k}=${v.props[k]}`).join(', ');
      if (seen[sig]) {
        lint.push({ level: 'warn', rule: 'comp-duplicate', title: `${set.name}에 "${sig}"가 두 개 있어요`, detail: '피그마에서 같은 조합의 variant가 겹치면 어느 쪽이 쓰일지 정해지지 않아요. 하나는 지우거나 이름을 바꿔주세요. 코드는 먼저 나온 것을 썼어요.', keys: [sig] });
        continue;
      }
      seen[sig] = v;
      const bg = color(v.fill, '배경', v);
      const fg = v.text ? color(v.text.fill, '글자', v) : null;
      const border = v.stroke ? color(v.stroke, '테두리', v) : null;
      if (v.text?.fill?.var && !v.text.fill.var.startsWith('txt/') && tokenByName[v.text.fill.var] && v.text.fill.var.split('/')[0] !== '시멘틱')
        lint.push({ level: 'info', rule: 'comp-text-token', title: `${set.name} "${sig}" 글자에 "${v.text.fill.var}"를 쓰고 있어요`, detail: '버튼 배경용 토큰을 글자 색에 쓰고 있어요. 색은 같으니 지금은 괜찮지만, 같은 색인 txt/primary로 바꾸면 나중에 버튼 색만 바꿀 때 글자가 같이 바뀌는 일이 없어요.', keys: [sig] });
      const ts = v.text?.style ? typeByName[v.text.style] : null;
      variants.push({ ...v, sig, bg, fg, border, textStyle: ts ? { name: ts.name, cssVar: ts.cssVar, letterSpacing: ts.letterSpacing } : null });
    }

    // 간격이 4px 단위인지 (모든 variant의 값 모아서 한 번만)
    if (spacing?.steps?.length) {
      const offs = new Map();
      for (const v of variants) {
        const vals = [['안쪽 여백', ...v.padding], ['간격', v.layout && v.layout !== 'NONE' && v.align?.[0] !== 'SPACE_BETWEEN' ? v.gap : 0]];
        for (const [label, ...nums] of vals) for (const n of nums) if (n && n % BASE !== 0) offs.set(`${label} ${n}px`, n);
      }
      const onlyGap = [...offs.keys()].every((k) => k.startsWith('간격'));
      if (offs.size)
        lint.push({ level: onlyGap ? 'info' : 'warn', extra: onlyGap ? ' 지금은 안에 글자 하나뿐이라 화면엔 차이가 없지만, 아이콘을 같이 넣으면 이 간격이 보여요.' : '', rule: 'comp-space-grid', title: `${set.name} 간격 중 ${BASE}px 단위가 아닌 값이 있어요`, detail: `${[...offs.keys()].join(', ')}. ${[...new Set(offs.values())].map((n) => `${n}px → ${Math.round(n / BASE) * BASE || BASE}px`).join(', ')} 로 맞추는 걸 추천해요.`, keys: [...offs.keys()] });
      if (lint.at(-1)?.extra !== undefined) { lint.at(-1).detail += lint.at(-1).extra; delete lint.at(-1).extra; }
      else {
        const loose = new Set();
        for (const v of variants) for (const n of [...v.padding, v.gap]) if (n && !spaceBy[n]) loose.add(n);
        if (loose.size) lint.push({ level: 'info', rule: 'comp-space-token', title: `${set.name} 간격 ${[...loose].join(', ')}px에 맞는 토큰이 없어요`, detail: 'Spacing에 해당 값을 추가하거나 가까운 값으로 바꿔주세요.', keys: [...loose].map(String) });
      }
    }

    // 빠진 state 조합
    if (stateKey && otherKeys.length) {
      const states = set.props[stateKey].options;
      for (const val of set.props[otherKeys[0]].options) {
        const have = variants.filter((v) => v.props[otherKeys[0]] === val).map((v) => v.props[stateKey]);
        const missing = states.filter((s) => !have.includes(s));
        if (missing.length)
          lint.push({ level: 'info', rule: 'comp-missing-state', title: `${set.name} ${otherKeys[0]}=${val}에 ${missing.join(', ')} 상태가 없어요`, detail: `눌렀을 때 모양이 정해지지 않아서, 코드에서는 기본 모양 그대로 보여요. ${val}가 누를 수 없는 상태라면 괜찮아요.`, keys: [`${otherKeys[0]}=${val}`] });
      }
    }

    // ---------- CSS ----------
    const isDefault = (v, keys) => keys.every((k) => v.props[k] === defaults[k]);
    const base = variants.find((v) => isDefault(v, variantProps.map(([k]) => k))) || variants[0];
    const decl = (v, full) => {
      const out = [];
      const diff = (f) => full || f(v) !== f(base);
      if (full) {
        out.push('display: flex', `flex-direction: ${v.layout === 'HORIZONTAL' ? 'row' : 'column'}`, 'align-items: center', 'justify-content: center', 'width: 100%', 'border: 0', 'cursor: pointer', 'text-decoration: none', 'transition: background-color .15s ease, color .15s ease');
      }
      if (diff((x) => x.padding.join())) out.push(`padding: ${v.padding.map(sp).join(' ')}`);
      if (diff((x) => x.gap)) out.push(`gap: ${sp(v.gap)}`);
      if (diff((x) => x.radius)) out.push(`border-radius: ${rd(v.radius)}`);
      if (v.textStyle && diff((x) => x.textStyle?.cssVar)) out.push(`font: var(${v.textStyle.cssVar})`, `letter-spacing: ${v.textStyle.letterSpacing}`);
      if (v.bg && (full || v.bg.css !== base.bg?.css)) out.push(`background: ${v.bg.css}`);
      if (v.fg && (full || v.fg.css !== base.fg?.css)) out.push(`color: ${v.fg.css}`);
      if (v.border && (full || v.border.css !== base.border?.css)) out.push(`box-shadow: inset 0 0 0 ${v.strokeWeight}px ${v.border.css}`);
      return out;
    };
    const rule = (sel, list) => list.length && css.push(`${sel} {\n${list.map((d) => `  ${d};`).join('\n')}\n}`);

    css.push(`/* ===== ${set.name} ===== */`);
    rule(`.${cls}`, decl(base, true));
    css.push(`.${cls}:focus-visible { outline: 2px solid var(--color-str-primary, #1769FF); outline-offset: 2px; }`);
    const modOf = (v) => otherKeys.filter((k) => v.props[k] !== defaults[k]).map((k) => `.${cls}--${slug(v.props[k])}`).join('');
    const stateOf = (v) => (stateKey && v.props[stateKey] !== defaults[stateKey] ? STATE_SEL[slug(v.props[stateKey])] || [`.is-${slug(v.props[stateKey])}`] : null);
    // 기본 state 먼저, 그다음 다른 state
    const ordered = [...variants.filter((v) => !stateOf(v)), ...variants.filter((v) => stateOf(v))];
    for (const v of ordered) {
      if (v === base) continue;
      const mod = modOf(v);
      const st = stateOf(v);
      // 기본 색(primary)의 상태는 다른 색 버튼에 번지지 않게 :not(.button--다른색) 을 붙임
      const notOthers = mod ? '' : otherKeys.flatMap((k) => set.props[k].options.filter((o) => o !== defaults[k]).map((o) => `:not(.${cls}--${slug(o)})`)).join('');
      const sel = st ? st.map((s) => `.${cls}${mod}${notOthers}${s}`).join(',\n') : `.${cls}${mod}`;
      // 상태(hover 등)는 색을 항상 다 적어서 어떤 조합에서도 확실히 바뀌게
      const list = st
        ? [...decl(v, false).filter((d) => !/^(background|color|box-shadow)/.test(d)), v.bg && `background: ${v.bg.css}`, v.fg && `color: ${v.fg.css}`, v.border && `box-shadow: inset 0 0 0 ${v.strokeWeight}px ${v.border.css}`].filter(Boolean)
        : decl(v, false);
      rule(sel, list);
    }
    css.push('');

    sets.push({
      name: set.name, id: set.id, className: cls, stateKey, otherKeys, defaults,
      options: Object.fromEntries(variantProps.map(([k, d]) => [k, d.options])),
      textProp: Object.entries(set.props).find(([, d]) => d.type === 'TEXT')?.[1]?.defaultValue || set.name,
      variants: variants.map((v) => ({ sig: v.sig, props: v.props, modifier: modOf(v).replace(/\./g, ' ').trim(), bg: v.bg, fg: v.fg, border: v.border, width: v.width, height: v.height, radius: v.radius, padding: v.padding, textStyle: v.textStyle?.name || null })),
    });
  }

  // 의도한 결정
  const acks = read(P.lintConfig)?.acknowledged || [];
  for (const l of lint) {
    const ack = acks.find((a) => a.rule === l.rule && [...(a.variants || [])].sort().join('|') === [...l.keys].sort().join('|'));
    if (ack) { l.acknowledged = { note: ack.note || '', at: ack.at || '' }; l.level = 'ok'; }
  }
  const order = { error: 0, warn: 1, info: 2, ok: 3 };
  lint.sort((a, b) => order[a.level] - order[b.level]);

  if (write) {
    mkdirSync(dirname(P.css), { recursive: true });
    writeFileSync(P.css, css.join('\n') + '\n');
    writeFileSync(P.json, JSON.stringify({ meta: { ...raw.source, exportedAt: lastSyncOf(P.raw) }, sets, lint }, null, 2));
  }
  return { components: sets.length, lint: lint.filter((l) => l.level !== 'ok').length };
}

export const COMPONENT_PATHS = P;
export const componentList = () => read(P.list)?.sets || [];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildComponents();
  console.log(`✓ 컴포넌트 ${r.components}개 생성 · 점검 항목 ${r.lint}개`);
}
