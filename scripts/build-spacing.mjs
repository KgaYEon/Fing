// 피그마 Spacing 변수(figma/variables.raw.json 안의 spacing/*) → 코드용 간격
//   - src/styles/spacing.css   : --space-4, --space-8 … CSS 변수
//   - src/tokens/spacing.json  : 디자인시스템 페이지용 데이터 (+ 점검 결과)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastSyncOf } from './figma-raw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/variables.raw.json'),
  lintConfig: resolve(ROOT, 'tokens/lint-config.json'),
  css: resolve(ROOT, 'src/styles/spacing.css'),
  json: resolve(ROOT, 'src/tokens/spacing.json'),
};
export const BASE = 4; // 4px 단위

export function buildSpacing({ write = true } = {}) {
  if (!existsSync(P.raw)) return { steps: 0, lint: 0 };
  const raw = JSON.parse(readFileSync(P.raw, 'utf8'));
  const col = raw.collections.find((c) => c.name.toLowerCase() === 'spacing');
  const vars = col ? raw.variables.filter((v) => v.collectionId === col.id && v.resolvedType === 'FLOAT') : [];
  const lint = [];

  const steps = vars.map((v) => {
    const value = v.valuesByMode[col.defaultModeId];
    const key = v.name.split('/').pop().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (typeof value === 'number' && value % BASE !== 0)
      lint.push({ level: 'warn', rule: 'space-grid', title: `"${v.name}"(${value}px)이 ${BASE}px 단위가 아니에요`, detail: `간격은 ${BASE}의 배수로 맞추기로 했어요. ${Math.round(value / BASE) * BASE}px로 바꾸는 걸 추천해요.`, keys: [key] });
    if (!v.scopes.includes('GAP') && !v.scopes.includes('ALL_SCOPES'))
      lint.push({ level: 'info', rule: 'space-scope', title: `"${v.name}"이 간격 자리에서 안 보여요`, detail: '피그마 변수 설정에서 범위(Scoping)에 Gap을 켜주세요.', keys: [key] });
    return { key, name: v.name, id: v.id, value, cssVar: `--space-${key}`, description: v.description || '' };
  }).sort((a, b) => a.value - b.value);

  const acks = (() => { try { return JSON.parse(readFileSync(P.lintConfig, 'utf8')).acknowledged || []; } catch { return []; } })();
  for (const l of lint) {
    const ack = acks.find((a) => a.rule === l.rule && [...(a.spacing || [])].sort().join('|') === [...l.keys].sort().join('|'));
    if (ack) { l.acknowledged = { note: ack.note || '', at: ack.at || '' }; l.level = 'ok'; }
  }

  if (write) {
    const css = [
      '/* ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 피그마 Spacing 변수에서 고치고 동기화하세요.',
      ` * ${BASE}px 단위 간격. 사용: gap: var(--space-16); padding: var(--space-20) var(--space-24); */`,
      '',
      ':root {',
      ...steps.map((s) => `  ${s.cssVar}: ${s.value}px;`),
      '}',
      '',
    ].join('\n');
    writeFileSync(P.css, css);
    writeFileSync(P.json, JSON.stringify({ meta: { fileName: raw.source?.fileName, fileKey: raw.source?.fileKey, exportedAt: lastSyncOf(P.raw) }, base: BASE, collection: col?.name || null, steps, lint }, null, 2));
  }
  return { steps: steps.length, lint: lint.filter((l) => l.level !== 'ok').length };
}

export const SPACING_PATHS = P;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildSpacing();
  console.log(`✓ 간격 ${r.steps}단계 생성 · 점검 항목 ${r.lint}개`);
}
