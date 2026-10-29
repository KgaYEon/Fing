// Fing Token Sync — 피그마 변수를 로컬 프로젝트로 보내는 개발용 플러그인
// 플러그인 창이 열려 있는 동안
//  - 변수: 1.5초마다 확인해서 바뀌면 보냅니다.
//  - 텍스트 스타일: 1.5초마다 확인해서 바뀌면 보냅니다.
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

let lastSig = '';
let lastTypeSig = '';
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
  if (msg.type === 'sync') { tick(true); typeTick(true); iconTick(true); }
  if (msg.type === 'auto') auto = msg.value;
  if (msg.type === 'failed') { lastSig = ''; lastTypeSig = ''; lastIconSig = ''; iconsDirty = true; } // 전송 실패 시 다음 확인 때 다시 보냄
};

(async () => {
  await figma.loadAllPagesAsync(); // 다른 페이지에 있는 아이콘까지 찾기 위해
  figma.on('documentchange', () => { iconsDirty = true; });
  tick(true);
  typeTick(true);
  iconTick(true);
  setInterval(() => { if (auto) { tick(false); typeTick(false); iconTick(false); } }, 1500);
})();
