// Fing Token Sync — 피그마 변수를 로컬 프로젝트로 보내는 개발용 플러그인
// 플러그인 창이 열려 있는 동안
//  - 변수: 1.5초마다 확인해서 바뀌면 보냅니다.
//  - 텍스트 스타일: 1.5초마다 확인해서 바뀌면 보냅니다.
//  - 그림자(이펙트 스타일): 1.5초마다 확인해서 바뀌면 보냅니다.
//  - 컴포넌트: 프로젝트 tokens/components.json 목록에 있는 것만, 바뀌면 보냅니다.
//  - 아이콘: 이름이 ic/ 로 시작하는 컴포넌트가 바뀌면 SVG로 보냅니다.
figma.showUI(__html__, { width: 320, height: 300, themeColors: true });

const r4 = (n) => Math.round(n * 10000) / 10000;
const conv = (v) => {
  if (v && typeof v === 'object' && v.type === 'VARIABLE_ALIAS') return { alias: v.id };
  if (v && typeof v === 'object' && 'r' in v) return { r: r4(v.r), g: r4(v.g), b: r4(v.b), a: r4(v.a === undefined ? 1 : v.a) };
  return v;
};

async function exportVariables() {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const vars = await figma.variables.getLocalVariablesAsync();
  return {
    format: 'fing-figma-variables@1',
    source: { fileName: figma.root.name, fileKey: figma.fileKey || null, exportedAt: new Date().toISOString(), via: 'figma-plugin' },
    collections: cols.map((c) => ({ id: c.id, name: c.name, defaultModeId: c.defaultModeId, modes: c.modes.map((m) => ({ modeId: m.modeId, name: m.name })), variableIds: c.variableIds })),
    variables: vars.map((v) => ({
      id: v.id, name: v.name, collectionId: v.variableCollectionId, resolvedType: v.resolvedType,
      description: v.description || '', scopes: v.scopes, hiddenFromPublishing: v.hiddenFromPublishing,
      valuesByMode: Object.fromEntries(Object.entries(v.valuesByMode).map(([k, val]) => [k, conv(val)])),
    })),
  };
}

async function exportIcons() {
  const comps = figma.root.findAllWithCriteria({ types: ['COMPONENT'] }).filter((c) => c.name.startsWith('ic/'));
  const icons = [];
  for (const c of comps) {
    const svg = await c.exportAsync({ format: 'SVG_STRING', svgIdAttribute: false });
    icons.push({ id: c.id, name: c.name, width: Math.round(c.width * 100) / 100, height: Math.round(c.height * 100) / 100, description: c.description || '', svg });
  }
  return {
    format: 'fing-figma-icons@1',
    source: { fileName: figma.root.name, fileKey: figma.fileKey || null, exportedAt: new Date().toISOString(), via: 'figma-plugin' },
    icons,
  };
}

async function exportTextStyles() {
  const styles = await figma.getLocalTextStylesAsync();
  return {
    format: 'fing-figma-text-styles@1',
    source: { fileName: figma.root.name, fileKey: figma.fileKey || null, exportedAt: new Date().toISOString(), via: 'figma-plugin' },
    styles: styles.map((s) => ({
      id: s.id, name: s.name, description: s.description || '',
      font: { family: s.fontName.family, style: s.fontName.style }, size: s.fontSize,
      lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textCase: s.textCase, textDecoration: s.textDecoration,
    })),
  };
}

async function exportEffectStyles() {
  const styles = await figma.getLocalEffectStylesAsync();
  return {
    format: 'fing-figma-effect-styles@1',
    source: { fileName: figma.root.name, fileKey: figma.fileKey || null, exportedAt: new Date().toISOString(), via: 'figma-plugin' },
    styles: styles.map((s) => ({
      id: s.id, name: s.name, description: s.description || '',
      effects: s.effects.filter((e) => e.visible !== false).map((e) => (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
        ? { type: e.type, x: r4(e.offset.x), y: r4(e.offset.y), blur: r4(e.radius), spread: r4(e.spread || 0), color: { r: r4(e.color.r), g: r4(e.color.g), b: r4(e.color.b), a: r4(e.color.a) } }
        : { type: e.type, blur: r4(e.radius) }),
    })),
  };
}

// 아래 함수는 Claude가 피그마에서 읽어올 때 쓰는 코드와 똑같아야 해요 (결과가 같아야 깃 충돌이 없어요)
let componentSetNames = [];
async function exportComponents() {
  const allVars = await figma.variables.getLocalVariablesAsync();
  const varName = (id) => { const v = allVars.find((x) => x.id === id); return v ? v.name : null; };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  const paintOf = (fills) => {
    const f = Array.isArray(fills) ? fills.find((p) => p.type === 'SOLID' && p.visible !== false) : null;
    return f ? { hex: hex(f.color), opacity: f.opacity === undefined ? 1 : f.opacity, var: f.boundVariables && f.boundVariables.color ? varName(f.boundVariables.color.id) : null } : null;
  };
  const textStyles = await figma.getLocalTextStylesAsync();
  const allSets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });
  const sets = componentSetNames.map((n) => allSets.find((s) => s.name === n)).filter(Boolean);
  return {
    format: 'fing-figma-components@1',
    source: { fileName: figma.root.name, fileKey: figma.fileKey || null, exportedAt: new Date().toISOString(), via: 'figma-plugin' },
    componentSets: sets.map((s) => ({
      id: s.id, name: s.name, description: s.description || '',
      props: Object.fromEntries(Object.entries(s.componentPropertyDefinitions).map(([k, d]) => [k, { type: d.type, defaultValue: d.defaultValue, options: d.variantOptions || null }])),
      variants: s.children.filter((c) => c.type === 'COMPONENT').map((c) => {
        const t = c.findOne((n) => n.type === 'TEXT');
        return {
          id: c.id, name: c.name, props: c.variantProperties,
          width: c.width, height: c.height, radius: c.cornerRadius === figma.mixed ? null : c.cornerRadius,
          padding: [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft], gap: c.itemSpacing,
          layout: c.layoutMode, align: [c.primaryAxisAlignItems, c.counterAxisAlignItems],
          fill: paintOf(c.fills), stroke: paintOf(c.strokes), strokeWeight: c.strokes && c.strokes.length ? c.strokeWeight : 0,
          text: t ? { style: (textStyles.find((x) => x.id === t.textStyleId) || {}).name || null, fill: paintOf(t.fills) } : null,
        };
      }),
    })),
  };
}

let lastSig = '';
let lastCompSig = '';
let lastTypeSig = '';
let lastEffSig = '';
let lastIconSig = '';
let iconsDirty = true;
let auto = true;

async function tick(force) {
  const data = await exportVariables();
  const sig = JSON.stringify([data.collections, data.variables]);
  if (!force && sig === lastSig) return;
  lastSig = sig;
  figma.ui.postMessage({ type: 'export', data, reason: force ? 'manual' : 'changed', colorCount: data.variables.filter((v) => v.resolvedType === 'COLOR').length });
}

async function typeTick(force) {
  const data = await exportTextStyles();
  const sig = JSON.stringify(data.styles);
  if (!force && sig === lastTypeSig) return;
  lastTypeSig = sig;
  figma.ui.postMessage({ type: 'export', data, reason: force ? 'manual' : 'changed', kind: 'type' });
}

async function effTick(force) {
  const data = await exportEffectStyles();
  const sig = JSON.stringify(data.styles);
  if (!force && sig === lastEffSig) return;
  lastEffSig = sig;
  figma.ui.postMessage({ type: 'export', data, reason: force ? 'manual' : 'changed', kind: 'effects' });
}

async function compTick(force) {
  if (!componentSetNames.length) return;
  if (!force && !iconsDirty && lastCompSig) return;
  const data = await exportComponents();
  const sig = JSON.stringify(data.componentSets);
  if (!force && sig === lastCompSig) return;
  lastCompSig = sig;
  figma.ui.postMessage({ type: 'export', data, reason: force ? 'manual' : 'changed', kind: 'components' });
}

async function iconTick(force) {
  if (!force && !iconsDirty) return;
  iconsDirty = false;
  const data = await exportIcons();
  const sig = JSON.stringify(data.icons);
  if (!force && sig === lastIconSig) return;
  lastIconSig = sig;
  figma.ui.postMessage({ type: 'export', data, reason: force ? 'manual' : 'changed', kind: 'icons' });
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'sync') { tick(true); typeTick(true); effTick(true); compTick(true); iconTick(true); }
  if (msg.type === 'config') { const n = JSON.stringify(msg.componentSets || []); if (n !== JSON.stringify(componentSetNames)) { componentSetNames = msg.componentSets || []; compTick(true); } }
  if (msg.type === 'auto') auto = msg.value;
  if (msg.type === 'failed') { lastSig = ''; lastTypeSig = ''; lastEffSig = ''; lastCompSig = ''; lastIconSig = ''; iconsDirty = true; } // 전송 실패 시 다음 확인 때 다시 보냄
};

(async () => {
  await figma.loadAllPagesAsync(); // 다른 페이지에 있는 아이콘까지 찾기 위해
  figma.on('documentchange', () => { iconsDirty = true; });
  tick(true);
  typeTick(true);
  effTick(true);
  iconTick(true);
  setInterval(async () => { if (auto) { tick(false); typeTick(false); effTick(false); await compTick(false); iconTick(false); } }, 1500);
})();
