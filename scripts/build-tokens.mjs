// 피그마 변수 원본(figma/variables.raw.json) → 코드용 토큰을 만드는 스크립트
//   - src/styles/tokens.css   : 앱 전체에서 쓰는 CSS 변수
//   - src/tokens/tokens.json  : 디자인시스템 페이지가 읽어서 그리는 데이터 (+ 점검 결과)
// 실행: npm run tokens  (dev 서버 실행 중에는 원본이 바뀌면 자동 실행됩니다)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/variables.raw.json'),
  map: resolve(ROOT, 'tokens/name-map.json'),
  lintConfig: resolve(ROOT, 'tokens/lint-config.json'),
  css: resolve(ROOT, 'src/styles/tokens.css'),
  json: resolve(ROOT, 'src/tokens/tokens.json'),
};

// ---------- 색 계산 ----------
const to255 = (n) => Math.round(n * 255);
const hex2 = (n) => to255(n).toString(16).padStart(2, '0').toUpperCase();
const toHex = (c) => `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}${c.a < 1 ? hex2(c.a) : ''}`;
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};
const WHITE = { r: 1, g: 1, b: 1, a: 1 };
const BLACK = { r: 0, g: 0, b: 0, a: 1 };

// ---------- 이름 변환 ----------
const HANGUL = /[가-힣]/;
const slug = (s) =>
  s.trim().toLowerCase().replace(/[\s_/.]+/g, '-').replace(/[^a-z0-9\-가-힣]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

export function buildTokens({ write = true } = {}) {
  const raw = JSON.parse(readFileSync(P.raw, 'utf8'));
  const map = JSON.parse(readFileSync(P.map, 'utf8'));
  const segMap = map.segments || {};
  const lint = [];
  const unmapped = new Set();

  const segToCss = (seg) => {
    if (segMap[seg]) return segMap[seg];
    if (HANGUL.test(seg)) unmapped.add(seg);
    return slug(seg);
  };

  const colById = Object.fromEntries(raw.collections.map((c) => [c.id, c]));
  const varById = Object.fromEntries(raw.variables.map((v) => [v.id, v]));
  const colors = raw.variables.filter((v) => v.resolvedType === 'COLOR');
  const others = raw.variables.filter((v) => v.resolvedType !== 'COLOR');

  // CSS 변수 이름 (충돌 시 컬렉션 이름을 붙여 구분)
  const cssName = {};
  const used = {};
  for (const v of colors) {
    let name = `--color-${v.name.split('/').map(segToCss).join('-')}`;
    if (used[name]) {
      lint.push({ level: 'error', rule: 'name-collision', title: 'CSS 변수 이름이 겹칩니다',
        detail: `"${v.name}"과 "${varById[used[name]].name}"이 같은 코드 이름(${name})이 됩니다. 컬렉션 이름을 붙여 구분했어요.`, tokens: [v.name, varById[used[name]].name] });
      name = `${name}--${slug(colById[v.collectionId].name)}`;
    }
    used[name] = v.id;
    cssName[v.id] = name;
  }

  // 값 해석 (별칭이면 끝까지 따라가 실제 색을 찾음)
  const resolveValue = (v, modeId, seen = []) => {
    const col = colById[v.collectionId];
    const val = v.valuesByMode[modeId] ?? v.valuesByMode[col.defaultModeId];
    if (val && val.alias) {
      const target = varById[val.alias];
      if (!target) return { broken: true, chain: [...seen, v.name] };
      if (seen.includes(target.name)) return { broken: true, chain: [...seen, v.name, target.name] };
      const tCol = colById[target.collectionId];
      return resolveValue(target, tCol.modes.some((m) => m.modeId === modeId) ? modeId : tCol.defaultModeId, [...seen, v.name]);
    }
    return { color: val, chain: [...seen, v.name] };
  };

  // 컬렉션 → 그룹 → 토큰
  const collections = raw.collections.map((c) => {
    const conf = map.collections?.[c.name] || {};
    const vars = c.variableIds.map((id) => varById[id]).filter((v) => v && v.resolvedType === 'COLOR');
    const aliasCount = vars.filter((v) => v.valuesByMode[c.defaultModeId]?.alias).length;
    const role = conf.role || (aliasCount > vars.length / 2 ? 'semantic' : 'primitive');

    const tokens = vars.map((v) => {
      const parts = v.name.split('/');
      const group = parts.length > 1 ? parts[0] : v.name;
      const leaf = parts.length > 1 ? parts.slice(1).join('/') : '';
      const stepMatch = leaf.match(/(\d+)$/);
      const own = v.valuesByMode[c.defaultModeId];
      const r = resolveValue(v, c.defaultModeId);
      const color = r.color || BLACK;
      const aliasTarget = own?.alias ? varById[own.alias] : null;
      const modes = c.modes.map((m) => {
        const rv = resolveValue(v, m.modeId);
        return { mode: m.name, hex: rv.color ? toHex(rv.color) : null };
      });
      if (r.broken) lint.push({ level: 'error', rule: 'broken-alias', title: '참조가 끊긴 토큰', detail: `"${v.name}"이 가리키는 변수를 찾을 수 없어요. (경로: ${r.chain.join(' → ')})`, tokens: [v.name] });
      return {
        id: v.id, name: v.name, group, leaf, step: stepMatch ? Number(stepMatch[1]) : null,
        cssVar: cssName[v.id], description: v.description, scopes: v.scopes,
        hex: toHex(color), rgba: `rgba(${to255(color.r)}, ${to255(color.g)}, ${to255(color.b)}, ${color.a})`,
        alias: aliasTarget ? { name: aliasTarget.name, cssVar: cssName[aliasTarget.id], id: aliasTarget.id } : null,
        chain: r.chain.slice(1),
        contrast: { white: contrast(color, WHITE), black: contrast(color, BLACK) },
        isLight: luminance(color) > 0.4,
        modes,
      };
    });

    const groupKeys = [...new Set(tokens.map((t) => t.group))];
    const groups = groupKeys.map((g) => {
      const ts = tokens.filter((t) => t.group === g);
      const isRamp = ts.length >= 3 && ts.every((t) => t.step !== null);
      if (isRamp) ts.sort((a, b) => a.step - b.step);
      return { key: g, label: map.groupLabels?.[g] || g, cssKey: segToCss(g), isRamp, tokens: ts };
    });

    return { id: c.id, name: c.name, label: conf.label || c.name, role, modes: c.modes.map((m) => m.name), defaultMode: c.modes.find((m) => m.modeId === c.defaultModeId)?.name, groups, count: tokens.length };
  });

  const allTokens = collections.flatMap((c) => c.groups.flatMap((g) => g.tokens.map((t) => ({ ...t, collection: c }))));
  const byName = Object.fromEntries(allTokens.map((t) => [t.name, t]));

  // ---------- 점검 규칙 ----------
  const allScopes = colors.filter((v) => v.scopes.includes('ALL_SCOPES'));
  if (allScopes.length)
    lint.push({ level: 'warn', rule: 'all-scopes', title: `변수 ${allScopes.length}개가 '모든 속성'에 노출돼요`,
      detail: '스코프가 ALL_SCOPES면 텍스트 색 자리에 버튼 배경 토큰이 뜨는 식으로 선택지가 섞여요. 원색은 스코프를 모두 끄고(시멘틱으로만 쓰게), 시멘틱은 txt→Text fill, bg/btn→Frame·Shape fill, str→Stroke로 좁히는 걸 권장해요.',
      tokens: allScopes.map((v) => v.name) });

  for (const c of raw.collections) {
    if (/^Collection( \d+)?$/.test(c.name)) lint.push({ level: 'info', rule: 'default-name', title: `컬렉션 이름이 기본값("${c.name}")이에요`, detail: '역할이 드러나게 "Semantic" 같은 이름으로 바꾸면 피그마에서도 찾기 쉬워요. 바꾼 뒤 tokens/name-map.json의 collections 항목도 같은 이름으로 맞춰주세요.', tokens: [] });
  }
  const defaultModeCols = raw.collections.filter((c) => c.modes.some((m) => /^Mode \d+$/.test(m.name)));
  if (defaultModeCols.length)
    lint.push({ level: 'info', rule: 'default-mode', title: '모드 이름이 기본값("Mode 1")이에요', detail: `${defaultModeCols.map((c) => `"${c.name}"`).join(', ')}. 모드가 하나뿐이면 그대로 둬도 괜찮아요. 다크모드 등을 추가할 계획이면 "Light"처럼 이름을 붙여두면 코드에서 [data-theme="이름"]으로 그대로 쓰여요.`, tokens: [] });

  for (const t of allTokens) {
    if (t.alias && byName[t.alias.name]?.alias && byName[t.alias.name].collection.id === t.collection.id)
      lint.push({ level: 'info', rule: 'alias-chain', title: '시멘틱이 시멘틱을 참조해요', detail: `"${t.name}" → "${t.alias.name}" → "${byName[t.alias.name].alias.name}". 버튼 색을 바꾸면 텍스트 색도 같이 바뀌는 연결이에요. 의도한 게 아니라면 원색을 직접 참조하게 바꾸세요.`, tokens: [t.name] });
    if (t.collection.role === 'semantic' && !t.alias)
      lint.push({ level: 'warn', rule: 'raw-in-semantic', title: '시멘틱 토큰에 색이 직접 들어가 있어요', detail: `"${t.name}"은 원색을 참조하지 않고 ${t.hex} 값을 직접 가지고 있어요.`, tokens: [t.name] });
  }

  for (const c of collections) {
    for (const g of c.groups) {
      const byTarget = {};
      for (const t of g.tokens) if (t.alias) (byTarget[t.alias.id] ||= []).push(t);
      for (const list of Object.values(byTarget))
        if (list.length > 1)
          lint.push({ level: 'warn', rule: 'duplicate', title: '같은 그룹에서 같은 색을 가리키는 토큰', detail: `${list.map((t) => `"${t.name}"`).join(', ')}이 모두 "${list[0].alias.name}"을 가리켜요. 쓰임이 다르면 괜찮지만, 이름이 비슷하다면(예: disable/dis) 하나로 정리할지 확인해보세요.`, tokens: list.map((t) => t.name) });
      for (const a of g.tokens) for (const b of g.tokens)
        if (a !== b && a.leaf && b.leaf && !(a.step !== null && b.step !== null) && b.leaf.length > a.leaf.length && b.leaf.startsWith(a.leaf) && !/[-\s]/.test(b.leaf.slice(a.leaf.length, a.leaf.length + 1)))
          lint.push({ level: 'warn', rule: 'similar-name', title: '헷갈리기 쉬운 비슷한 이름', detail: `"${a.name}"(${a.alias?.name ?? a.hex})와 "${b.name}"(${b.alias?.name ?? b.hex})은 이름은 거의 같은데 색이 달라요. 줄임말 대신 각각 어디에 쓰는지 이름에 드러나게 바꾸는 걸 추천해요. (예: …/disable-bg, …/disable-border)`, tokens: [a.name, b.name] });
      const numbered = g.tokens.filter((t) => t.step !== null).length;
      if (g.tokens.length > 1 && numbered > 0 && numbered < g.tokens.length)
        lint.push({ level: 'info', rule: 'mixed-naming', title: `"${g.key}" 그룹의 이름 규칙이 섞여 있어요`, detail: `숫자 단계(예: ${g.tokens.find((t) => t.step !== null).leaf})와 단어(예: ${g.tokens.find((t) => t.step === null).leaf})가 함께 쓰여요. 한 가지 규칙으로 맞추면 코드 이름도 예측하기 쉬워져요.`, tokens: g.tokens.map((t) => t.name) });
    }
  }

  const bgTok = byName['bg'];
  // 밝은 글자(흰색 등)는 어두운 배경용이라 제외
  for (const t of allTokens.filter((t) => t.group === 'txt' && luminance(hexToRgb(t.hex)) < 0.7)) {
    const onWhite = t.contrast.white;
    const onBg = bgTok ? contrast(hexToRgb(t.hex), hexToRgb(bgTok.hex)) : null;
    const worst = Math.min(onWhite, onBg ?? onWhite);
    if (worst < 4.5)
      lint.push({ level: worst < 3 ? 'warn' : 'info', rule: 'contrast', title: `"${t.name}" 대비가 본문 기준(4.5:1)보다 낮아요`, detail: `흰 배경 ${onWhite}:1${onBg ? `, bg 배경 ${onBg}:1` : ''}. ${t.leaf === 'placeholder' ? '플레이스홀더도 읽어야 하는 텍스트라 WCAG에선 4.5:1을 권장해요.' : '작은 글씨에 쓰인다면 한 단계 진한 원색을 고려해보세요.'}`, tokens: [t.name] });
  }

  if (unmapped.size)
    lint.push({ level: 'info', rule: 'unmapped', title: '영문 이름이 없는 한글 그룹이 있어요', detail: `${[...unmapped].join(', ')} → tokens/name-map.json의 segments에 영문 이름을 추가하면 CSS 변수 이름이 깔끔해져요.`, tokens: [] });

  // ---------- CSS ----------
  const lines = [
    '/* ⚠️ 자동 생성 파일 — 직접 수정하지 마세요.',
    ` * 원본: 피그마 "${raw.source?.fileName ?? ''}" 변수 (${raw.source?.exportedAt ?? ''})`,
    ' * 수정은 피그마에서 → 동기화하면 이 파일이 다시 만들어집니다. */',
    '',
    ':root {',
  ];
  for (const c of collections) {
    lines.push(`  /* ${c.label} (${c.name}) */`);
    for (const g of c.groups)
      for (const t of g.tokens) lines.push(`  ${t.cssVar}: ${t.alias ? `var(${t.alias.cssVar})` : t.hex};`);
    lines.push('');
  }
  lines.push('}');
  for (const c of raw.collections) {
    if (c.modes.length < 2) continue;
    for (const m of c.modes.filter((m) => m.modeId !== c.defaultModeId)) {
      lines.push('', `[data-theme="${slug(m.name)}"] {`);
      for (const id of c.variableIds) {
        const v = varById[id];
        if (!v || v.resolvedType !== 'COLOR') continue;
        const val = v.valuesByMode[m.modeId];
        if (!val) continue;
        lines.push(`  ${cssName[v.id]}: ${val.alias ? `var(${cssName[val.alias]})` : toHex(val)};`);
      }
      lines.push('}');
    }
  }
  const css = lines.join('\n') + '\n';

  // 디자이너가 "의도한 결정"으로 확인한 항목은 경고에서 빼고 따로 기록
  let acks = [];
  try { acks = JSON.parse(readFileSync(P.lintConfig, 'utf8')).acknowledged || []; } catch {}
  const sameSet = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');
  for (const l of lint) {
    const ack = acks.find((a) => a.rule === l.rule && sameSet(a.tokens || [], l.tokens));
    if (ack) { l.acknowledged = { note: ack.note || '', at: ack.at || '' }; l.level = 'ok'; }
  }

  const order = { error: 0, warn: 1, info: 2, ok: 3 };
  lint.sort((a, b) => order[a.level] - order[b.level]);

  const json = {
    meta: {
      ...raw.source,
      counts: { color: colors.length, other: others.length, otherTypes: [...new Set(others.map((v) => v.resolvedType))] },
    },
    collections,
    lint,
  };

  if (write) {
    mkdirSync(dirname(P.css), { recursive: true });
    mkdirSync(dirname(P.json), { recursive: true });
    writeFileSync(P.css, css);
    writeFileSync(P.json, JSON.stringify(json, null, 2));
  }
  return { colors: colors.length, lint: lint.length, errors: lint.filter((l) => l.level === 'error').length };
}

function hexToRgb(h) {
  const n = h.replace('#', '');
  return { r: parseInt(n.slice(0, 2), 16) / 255, g: parseInt(n.slice(2, 4), 16) / 255, b: parseInt(n.slice(4, 6), 16) / 255, a: 1 };
}

export const TOKEN_PATHS = P;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildTokens();
  console.log(`✓ 색상 토큰 ${r.colors}개 생성 · 점검 항목 ${r.lint}개${r.errors ? ` (오류 ${r.errors}개)` : ''}`);
}
