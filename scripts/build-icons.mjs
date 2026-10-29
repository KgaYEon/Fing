// 피그마 아이콘 원본(figma/icons.raw.json) → 코드용 아이콘
//   - src/icons/svg/*.svg  : 아이콘 파일 (한 가지 색이면 currentColor로 바꿔서 글자색을 따라가게)
//   - src/icons/icons.js   : 코드에서 쓰는 icon('home') 함수
//   - src/icons/icons.json : 디자인시스템 페이지용 데이터 (+ 점검 결과)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastSyncOf } from './figma-raw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/icons.raw.json'),
  tokens: resolve(ROOT, 'figma/variables.raw.json'),
  lintConfig: resolve(ROOT, 'tokens/lint-config.json'),
  svgDir: resolve(ROOT, 'src/icons/svg'),
  js: resolve(ROOT, 'src/icons/icons.js'),
  json: resolve(ROOT, 'src/icons/icons.json'),
};

const NAMED = { black: '#000000', white: '#FFFFFF' };
const normHex = (c) => {
  c = c.trim();
  if (NAMED[c.toLowerCase()]) return NAMED[c.toLowerCase()];
  if (/^#[0-9a-f]{3}$/i.test(c)) return '#' + c.slice(1).split('').map((x) => x + x).join('').toUpperCase();
  return c.toUpperCase();
};

export function buildIcons({ write = true } = {}) {
  if (!existsSync(P.raw)) return { icons: 0, lint: 0 };
  const raw = JSON.parse(readFileSync(P.raw, 'utf8'));

  // 색 → 토큰 이름 (원색 팔레트 기준)
  const hexToToken = {};
  try {
    const t = JSON.parse(readFileSync(P.tokens, 'utf8'));
    for (const v of t.variables) {
      const val = Object.values(v.valuesByMode)[0];
      if (val && 'r' in val) {
        const h = '#' + [val.r, val.g, val.b].map((n) => Math.round(n * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
        hexToToken[h] ||= v.name;
      }
    }
  } catch {}

  const lint = [];
  const used = {};
  const icons = raw.icons.map((ic) => {
    const base = ic.name.replace(/^ic\//, '');
    let key = base.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (used[key]) {
      const first = used[key];
      lint.push({ level: 'warn', rule: 'icon-duplicate', title: `아이콘 이름 "${ic.name}"이 두 개예요`,
        detail: `코드에서는 이름으로 아이콘을 불러서, 같은 이름이면 하나를 구분할 수 없어요. 나중 것은 임시로 "${key}-2"로 만들어뒀어요. 피그마에서 둘 중 하나의 이름을 바꿔주세요.`,
        tokens: [first, ic.id], keys: [key, `${key}-2`] });
      key = `${key}-2`;
    }
    used[key] = ic.id;
    if (base !== base.toLowerCase())
      lint.push({ level: 'info', rule: 'icon-case', title: `"${ic.name}"에 대문자가 섞여 있어요`, detail: `다른 아이콘은 모두 소문자예요. 코드에서는 "${key}"로 바꿔서 쓰고 있어요.`, tokens: [ic.id], keys: [key] });
    if (ic.width !== 24 || ic.height !== 24)
      lint.push({ level: 'info', rule: 'icon-size', title: `"${ic.name}" 크기가 ${ic.width}×${ic.height}이에요`, detail: '다른 아이콘은 24×24예요. 점 표시처럼 일부러 다른 크기라면 괜찮아요.', tokens: [ic.id], keys: [key] });

    // 쓰인 색 모으기
    const colors = [...new Set([...ic.svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== 'none').map(normHex))];
    const mono = colors.length === 1;
    let svg = ic.svg.trim()
      .replace(/<svg([^>]*?)\s+width="[^"]*"/, '<svg$1')
      .replace(/<svg([^>]*?)\s+height="[^"]*"/, '<svg$1');
    if (mono) svg = svg.replace(/(fill|stroke)="(?!none)[^"]+"/g, '$1="currentColor"');
    svg = svg.replace(/\n/g, '');

    return {
      key, id: ic.id, figmaName: ic.name, width: ic.width, height: ic.height,
      type: mono ? 'mono' : 'multi',
      colors: colors.map((h) => ({ hex: h, token: hexToToken[h] || null })),
      svg,
    };
  });

  // 의도한 결정 반영
  let acks = [];
  try { acks = JSON.parse(readFileSync(P.lintConfig, 'utf8')).acknowledged || []; } catch {}
  for (const l of lint) {
    const ack = acks.find((a) => a.rule === l.rule && (a.icons || []).sort().join('|') === [...l.keys].sort().join('|'));
    if (ack) { l.acknowledged = { note: ack.note || '', at: ack.at || '' }; l.level = 'ok'; }
  }

  const order = { error: 0, warn: 1, info: 2, ok: 3 };
  lint.sort((a, b) => order[a.level] - order[b.level]);

  if (write) {
    rmSync(P.svgDir, { recursive: true, force: true });
    mkdirSync(P.svgDir, { recursive: true });
    for (const i of icons) writeFileSync(resolve(P.svgDir, `${i.key}.svg`), i.svg + '\n');

    const js = `// ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 아이콘은 피그마에서 고치고 동기화하세요.
// 사용법: element.innerHTML = icon('home')            → 24px, 글자색(color)을 따라감
//         icon('arr-right', { size: 20, label: '다음' }) → 크기 지정 + 화면낭독기용 이름
export const icons = ${JSON.stringify(Object.fromEntries(icons.map((i) => [i.key, i.svg])), null, 2)};

export const iconNames = Object.keys(icons);

export function icon(name, { size = 24, label, className = '' } = {}) {
  const svg = icons[name];
  if (!svg) { console.warn(\`[icon] "\${name}" 아이콘이 없어요. 있는 이름: \${iconNames.join(', ')}\`); return ''; }
  const a11y = label ? \`role="img" aria-label="\${label}"\` : 'aria-hidden="true"';
  const cls = ['icon', className].filter(Boolean).join(' ');
  return svg.replace('<svg', \`<svg width="\${size}" height="\${size}" class="\${cls}" \${a11y}\`);
}
`;
    writeFileSync(P.js, js);
    writeFileSync(P.json, JSON.stringify({ meta: { ...raw.source, exportedAt: lastSyncOf(P.raw) || raw.source?.exportedAt || null }, icons, lint }, null, 2));
  }
  return { icons: icons.length, lint: lint.filter((l) => l.level !== 'ok').length };
}

export const ICON_PATHS = P;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildIcons();
  console.log(`✓ 아이콘 ${r.icons}개 생성 · 점검 항목 ${r.lint}개`);
}
