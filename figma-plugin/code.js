// Fing Token Sync — 피그마 변수를 로컬 프로젝트로 보내는 개발용 플러그인
// 플러그인 창이 열려 있는 동안 1.5초마다 변수를 확인하고, 바뀐 게 있으면 바로 보냅니다.
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

let lastSig = '';
let auto = true;

async function tick(force) {
  const data = await exportVariables();
  const sig = JSON.stringify([data.collections, data.variables]);
  if (!force && sig === lastSig) return;
  lastSig = sig;
  figma.ui.postMessage({ type: 'export', data, reason: force ? 'manual' : 'changed', colorCount: data.variables.filter((v) => v.resolvedType === 'COLOR').length });
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'sync') tick(true);
  if (msg.type === 'auto') auto = msg.value;
  if (msg.type === 'failed') lastSig = ''; // 전송 실패 시 다음 확인 때 다시 보냄
};

tick(true);
setInterval(() => { if (auto) tick(false); }, 1500);
