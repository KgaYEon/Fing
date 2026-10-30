// 피그마 이펙트 스타일(figma/effect-styles.raw.json) → 코드용 그림자
//   - src/styles/effects.css   : --shadow-sm, --shadow-md … CSS 변수
//   - src/tokens/effects.json  : 디자인시스템 페이지용 데이터 (+ 점검 결과)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastSyncOf } from './figma-raw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  raw: resolve(ROOT, 'figma/effect-styles.raw.json'),
  css: resolve(ROOT, 'src/styles/effects.css'),
  json: resolve(ROOT, 'src/tokens/effects.json'),
};
const to255 = (n) => Math.round(n * 255);
const rgba = (c) => `rgba(${to255(c.r)}, ${to255(c.g)}, ${to255(c.b)}, ${c.a})`;

export function buildEffects({ write = true } = {}) {
  if (!existsSync(P.raw)) return { styles: 0, lint: 0 };
  const raw = JSON.parse(readFileSync(P.raw, 'utf8'));
  const lint = [];
  const styles = raw.styles.map((s) => {
    const key = s.name.split('/').pop().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const group = s.name.includes('/') ? s.name.split('/')[0].toLowerCase() : 'effect';
    const shadows = s.effects.filter((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW');
    const blurs = s.effects.filter((e) => e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR');
    const shadowCss = shadows.map((e) => `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${rgba(e.color)}`).join(', ');
    for (const e of shadows)
      if ([e.x, e.y, e.blur, e.spread].some((n) => n % 2 !== 0))
        lint.push({ level: 'info', rule: 'effect-grid', title: `"${s.name}" 값에 홀수·소수가 있어요`, detail: `위치 ${e.x}/${e.y}, 흐림 ${e.blur}, 퍼짐 ${e.spread}. 짝수로 맞추면 화면마다 그림자가 더 고르게 보여요.`, keys: [key] });
    return {
      key, name: s.name, id: s.id, description: s.description || '', group,
      cssVar: `--${group === 'effect' ? 'effect' : group}-${key}`,
      css: shadowCss || null,
      blur: blurs.map((e) => ({ type: e.type, blur: e.blur })),
      layers: shadows.map((e) => ({ ...e, rgba: rgba(e.color) })),
    };
  });

  if (write) {
    const lines = [
      '/* ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 피그마 이펙트 스타일에서 고치고 동기화하세요.',
      ' * 사용: box-shadow: var(--shadow-sm); */',
      '',
      ':root {',
      ...styles.filter((s) => s.css).map((s) => `  ${s.cssVar}: ${s.css};`),
      ...styles.filter((s) => !s.css && s.blur.length).map((s) => `  ${s.cssVar}: blur(${s.blur[0].blur}px);`),
      '}',
      '',
    ];
    writeFileSync(P.css, lines.join('\n'));
    writeFileSync(P.json, JSON.stringify({ meta: { ...raw.source, exportedAt: lastSyncOf(P.raw) }, styles, lint }, null, 2));
  }
  return { styles: styles.length, lint: lint.length };
}

export const EFFECT_PATHS = P;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildEffects();
  console.log(`✓ 그림자 ${r.styles}개 생성 · 점검 항목 ${r.lint}개`);
}
