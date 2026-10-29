// 피그마 원본 파일(figma/*.raw.json)을 항상 같은 모양으로 저장하는 도구
// - 내용이 같으면 파일을 건드리지 않아요 (깃에 쓸데없는 변경이 안 생기게)
// - 동기화 시각은 깃에 안 올라가는 figma/.last-sync.json 에 따로 적어요
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const LAST_SYNC = resolve(ROOT, 'figma/.last-sync.json');

const read = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };

export function normalizeRaw(data, existing) {
  const { exportedAt, via, ...rest } = data.source || {};
  const source = {
    fileName: existing?.source?.fileName || (rest.fileName && rest.fileName !== 'Document' ? rest.fileName : 'Fing'),
    fileKey: existing?.source?.fileKey || rest.fileKey || null,
  };
  if (rest.frame || existing?.source?.frame) source.frame = existing?.source?.frame || rest.frame;
  const { source: _s, ...body } = data;
  return { format: data.format, source, ...Object.fromEntries(Object.entries(body).filter(([k]) => k !== 'format')) };
}

export function writeRaw(path, data) {
  const existing = read(path);
  const next = JSON.stringify(normalizeRaw(data, existing), null, 2) + '\n';
  const changed = !existsSync(path) || readFileSync(path, 'utf8') !== next;
  if (changed) writeFileSync(path, next);
  const sync = read(LAST_SYNC) || {};
  sync[basename(path)] = new Date().toISOString();
  writeFileSync(LAST_SYNC, JSON.stringify(sync, null, 2) + '\n');
  return changed;
}

export const lastSyncOf = (path) => (read(LAST_SYNC) || {})[basename(path)] || null;

// 직접 실행: node scripts/figma-raw.mjs 파일.json 원본.json  → 원본을 정리해서 저장
if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv[3]) {
  const changed = writeRaw(resolve(process.argv[2]), JSON.parse(readFileSync(process.argv[3], 'utf8')));
  console.log(changed ? '✓ 바뀐 내용 저장' : '· 바뀐 내용 없음');
}
