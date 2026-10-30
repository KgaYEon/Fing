// 피그마 Radius 변수(figma/variables.raw.json 안의 radius/*) → 코드용 둥글기
//   - src/styles/radius.css   : --radius-4 … --radius-full CSS 변수
//   - src/tokens/radius.json  : 디자인시스템 페이지용 데이터 (+ 점검 결과)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastSyncOf } from './figma-raw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/variables.raw.json'),
  lintConfig: resolve(ROOT, 'tokens/lint-config.json'),
  css: resolve(ROOT, 'src/styles/radius.css'),
  json: resolve(ROOT, 'src/tokens/radius.json'),
};
export const BASE = 4; // 4px 단위 (full 제외)

export function buildRadius({ write = true } = {}) {
  if (!existsSync(P.raw)) return { steps: 0, lint: 0 };
  const raw = JSON.parse(readFileSync(P.raw, 'utf8'));
  const col = raw.collections.find((c) => c.name.toLowerCase() === 'radius');
  const vars = col ? raw.variables.filter((v) => v.collectionId === col.id && v.resolvedType === 'FLOAT') : [];
  const lint = [];

  const steps = vars.map((v) => {
    const value = v.valuesByMode[col.defaultModeId];
    const key = v.name.split('/').pop().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (typeof value === 'number' && key !== 'full' && value % BASE !== 0)
      lint.push({ level: 'warn', rule: 'space-grid', title: `"${v.name}"(${value}px)이 ${BASE}px 단위가 아니에요`, detail: `둥글기는 ${BASE}의 배수로 맞추기로 했어요. ${Math.round(value / BASE) * BASE}px로 바꾸는 걸 추천해요.`, keys: [key] });
    if (!v.scopes.includes('CORNER_RADIUS') && !v.scopes.includes('ALL_SCOPES'))
      lint.push({ level: 'info', rule: 'space-scope', title: `"${v.name}"이 둥글기 자리에서 안 보여요`, detail: '피그마 변수 설정에서 범위(Scoping)에 Corner radius를 켜주세요.', keys: [key] });
    return { key, name: v.name, id: v.id, value, cssVar: `--radius-${key}`, description: v.description || '' };
  }).sort((a, b) => (a.key === 'full') - (b.key === 'full') || a.value - b.value);

  const acks = (() => { try { return JSON.parse(readFileSync(P.lintConfig, 'utf8')).acknowledged || []; } catch { return []; } })();
  for (const l of lint) {
    const ack = acks.find((a) => a.rule === l.rule && [...(a.radius || [])].sort().join('|') === [...l.keys].sort().join('|'));
    if (ack) { l.acknowledged = { note: ack.note || '', at: ack.at || '' }; l.level = 'ok'; }
  }

  if (write) {
    const css = [
      '/* ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 피그마 Radius 변수에서 고치고 동기화하세요.',
      ' * 사용: border-radius: var(--radius-16);  완전 둥근 알약 모양은 var(--radius-full) */',
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

export const RADIUS_PATHS = P;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildRadius();
  console.log(`✓ 둥글기 ${r.steps}단계 생성 · 점검 항목 ${r.lint}개`);
}
