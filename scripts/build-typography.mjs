// 피그마 텍스트 스타일(figma/text-styles.raw.json) → 코드용 타이포그래피
//   - src/styles/typography.css   : .t-title-1 같은 클래스 + --text-title-1 같은 CSS 변수
//   - src/tokens/typography.json  : 디자인시스템 페이지용 데이터 (+ 점검 결과)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastSyncOf } from './figma-raw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/text-styles.raw.json'),
  lintConfig: resolve(ROOT, 'tokens/lint-config.json'),
  css: resolve(ROOT, 'src/styles/typography.css'),
  json: resolve(ROOT, 'src/tokens/typography.json'),
};

const WEIGHT = { thin: 100, extralight: 200, light: 300, regular: 400, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900, heavy: 900 };
const weightOf = (style) => {
  const k = style.toLowerCase().replace(/[\s_-]+/g, '').replace('italic', '');
  return WEIGHT[k] ?? 400;
};
// 글꼴 이름 → 코드용 글꼴 묶음 (없는 글꼴이면 시스템 글꼴로 대신)
const FAMILY = {
  Pretendard: { var: '--font-pretendard', stack: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" },
  Mulish: { var: '--font-mulish', stack: "Mulish, 'Pretendard Variable', Pretendard, sans-serif" },
};
const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lh = (l, size) => (l.unit === 'PIXELS' ? `${l.value}px` : l.unit === 'PERCENT' ? `${Math.round(l.value) / 100}` : 'normal');
const lhPx = (l, size) => (l.unit === 'PIXELS' ? l.value : l.unit === 'PERCENT' ? (l.value / 100) * size : size * 1.2);
const ls = (l) => (!l || l.value === 0 ? '0' : l.unit === 'PIXELS' ? `${l.value}px` : `${Math.round(l.value * 10) / 1000}em`);

export function buildTypography({ write = true } = {}) {
  if (!existsSync(P.raw)) return { styles: 0, lint: 0 };
  const raw = JSON.parse(readFileSync(P.raw, 'utf8'));
  const lint = [];
  const families = new Map();

  const styles = raw.styles.map((s) => {
    const key = slug(s.name);
    const fam = FAMILY[s.font.family] || { var: `--font-${slug(s.font.family)}`, stack: `'${s.font.family}', sans-serif` };
    families.set(fam.var, { family: s.font.family, stack: fam.stack });
    if (!FAMILY[s.font.family])
      lint.push({ level: 'warn', rule: 'type-font', title: `"${s.font.family}" 글꼴을 코드에서 아직 못 불러와요`, detail: `"${s.name}"에서 써요. 웹에서 쓸 글꼴 파일 경로를 알려주시면 연결할게요. 그 전까지는 기본 글꼴로 보여요.`, keys: [key] });
    return {
      key, id: s.id, name: s.name, description: s.description || '',
      family: s.font.family, style: s.font.style, weight: weightOf(s.font.style),
      size: s.size, lineHeight: lh(s.lineHeight, s.size), lineHeightPx: lhPx(s.lineHeight, s.size),
      letterSpacing: ls(s.letterSpacing), textCase: s.textCase, textDecoration: s.textDecoration,
      fontVar: fam.var, className: `t-${key}`, cssVar: `--text-${key}`,
    };
  });

  // ---------- 점검 ----------
  const seen = {};
  for (const s of styles) {
    const sig = [s.family, s.weight, s.size, s.lineHeight, s.letterSpacing, s.textCase].join('|');
    (seen[sig] ||= []).push(s);
    const ratio = s.lineHeightPx / s.size;
    if (ratio < 1)
      lint.push({ level: 'warn', rule: 'type-tight', title: `"${s.name}" 줄 높이(${s.lineHeightPx})가 글자 크기(${s.size})보다 작아요`, detail: '한 줄일 땐 괜찮아 보여도, 두 줄이 되면 윗줄과 아랫줄 글자가 겹치거나 글자 끝이 잘릴 수 있어요. 숫자 단위처럼 항상 한 줄이면 괜찮아요.', keys: [s.key] });
    else if (ratio < 1.15 && s.size >= 20)
      lint.push({ level: 'info', rule: 'type-tight', title: `"${s.name}" 줄 높이가 글자 크기와 같아요 (${s.size}/${s.lineHeightPx})`, detail: '한 줄 제목이면 괜찮아요. 두 줄로 넘어가면 한글은 줄 사이가 꽤 좁아 보여요.', keys: [s.key] });
    else if (ratio > 1.7)
      lint.push({ level: 'info', rule: 'type-loose', title: `"${s.name}" 줄 높이가 넓어요 (${s.size}/${s.lineHeightPx})`, detail: `글자 크기의 ${Math.round(ratio * 100) / 100}배예요. 다른 제목들은 1.2~1.4배 정도라 일부러 여유를 준 게 아니라면 확인해보세요.`, keys: [s.key] });
  }
  for (const list of Object.values(seen))
    if (list.length > 1)
      lint.push({ level: 'info', rule: 'type-duplicate', title: '설정이 완전히 같은 스타일', detail: `${list.map((s) => `"${s.name}"`).join(', ')}은 글꼴·굵기·크기·줄 높이가 모두 같아요. 쓰임이 달라서 이름을 나눈 거라면 괜찮아요.`, keys: list.map((s) => s.key) });

  const lower = styles.filter((s) => s.name[0] === s.name[0].toLowerCase()).length;
  if (lower && lower < styles.length)
    lint.push({ level: 'info', rule: 'type-case', title: '이름의 대소문자가 섞여 있어요', detail: `"Title 1"처럼 대문자로 시작하는 것과 "body 3"처럼 소문자로 시작하는 게 섞여 있어요. 코드에서는 모두 소문자(t-title-1, t-body-3)로 바꿔서 쓰니 동작엔 문제없어요.`, keys: styles.map((s) => s.key) });

  // 의도한 결정
  let acks = [];
  try { acks = JSON.parse(readFileSync(P.lintConfig, 'utf8')).acknowledged || []; } catch {}
  for (const l of lint) {
    const ack = acks.find((a) => a.rule === l.rule && [...(a.styles || [])].sort().join('|') === [...l.keys].sort().join('|'));
    if (ack) { l.acknowledged = { note: ack.note || '', at: ack.at || '' }; l.level = 'ok'; }
  }
  const order = { error: 0, warn: 1, info: 2, ok: 3 };
  lint.sort((a, b) => order[a.level] - order[b.level]);

  // ---------- CSS ----------
  const CASE = { UPPER: 'uppercase', LOWER: 'lowercase', TITLE: 'capitalize' };
  const lines = [
    '/* ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 피그마 텍스트 스타일에서 고치고 동기화하세요.',
    ' * 사용: <h1 class="t-title-1">  또는  font: var(--text-title-1); */',
    '',
    ':root {',
    ...[...families].map(([v, f]) => `  ${v}: ${f.stack};`),
    ...styles.map((s) => `  ${s.cssVar}: ${s.weight} ${s.size}px/${s.lineHeight} var(${s.fontVar});`),
    '}',
    '',
  ];
  for (const s of styles) {
    lines.push(`/* ${s.name} · ${s.family} ${s.style} ${s.size}/${s.lineHeightPx} */`);
    lines.push(`.${s.className} {`);
    lines.push(`  font: var(${s.cssVar});`);
    lines.push(`  letter-spacing: ${s.letterSpacing};`);
    if (CASE[s.textCase]) lines.push(`  text-transform: ${CASE[s.textCase]};`);
    if (s.textDecoration && s.textDecoration !== 'NONE') lines.push(`  text-decoration: ${s.textDecoration.toLowerCase().replace('strikethrough', 'line-through')};`);
    lines.push('}');
  }

  if (write) {
    writeFileSync(P.css, lines.join('\n') + '\n');
    writeFileSync(P.json, JSON.stringify({ meta: { ...raw.source, exportedAt: lastSyncOf(P.raw) || raw.source?.exportedAt || null }, styles, lint }, null, 2));
  }
  return { styles: styles.length, lint: lint.filter((l) => l.level !== 'ok').length };
}

export const TYPE_PATHS = P;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildTypography();
  console.log(`✓ 텍스트 스타일 ${r.styles}개 생성 · 점검 항목 ${r.lint}개`);
}
