import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { buildTokens, TOKEN_PATHS } from './scripts/build-tokens.mjs';

// 피그마 ↔ 프로젝트 토큰 동기화
// 1) 개발 서버가 켜질 때 토큰을 한 번 만듭니다.
// 2) figma/variables.raw.json 이나 tokens/name-map.json 이 바뀌면 다시 만듭니다.
// 3) 피그마 플러그인(figma-plugin/)이 POST /__figma-sync 로 변수를 보내면
//    원본 파일을 덮어쓰고 → 토큰 재생성 → 열려 있는 페이지가 자동으로 새로고침됩니다.
function figmaTokenSync() {
  let last = { at: null, result: null, error: null };
  const run = (why) => {
    try {
      const result = buildTokens();
      last = { at: new Date().toISOString(), result, error: null };
      console.log(`\x1b[36m[figma-sync]\x1b[0m ${why} → 색상 ${result.colors}개, 점검 ${result.lint}개`);
    } catch (e) {
      last = { at: new Date().toISOString(), result: null, error: e.message };
      console.error(`\x1b[31m[figma-sync]\x1b[0m 토큰 생성 실패: ${e.message}`);
    }
  };

  return {
    name: 'fing-figma-token-sync',
    buildStart() {
      run('빌드');
    },
    configureServer(server) {
      server.watcher.add([TOKEN_PATHS.raw, TOKEN_PATHS.map, TOKEN_PATHS.lintConfig]);
      server.watcher.on('change', (file) => {
        if ([TOKEN_PATHS.raw, TOKEN_PATHS.map, TOKEN_PATHS.lintConfig].includes(file)) run('원본 변경 감지');
      });

      server.middlewares.use('/__figma-sync', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'OPTIONS') return res.end();
        if (req.method === 'GET') return res.end(JSON.stringify({ ok: true, ...last }));
        if (req.method !== 'POST') { res.statusCode = 405; return res.end('{}'); }

        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.format !== 'fing-figma-variables@1' || !Array.isArray(data.variables)) throw new Error('형식이 맞지 않아요');
            // 플러그인에서는 파일 키를 못 읽는 경우가 많아서, 기존 값을 이어받아요
            if (!data.source?.fileKey) {
              try { data.source = { ...data.source, fileKey: JSON.parse(readFileSync(TOKEN_PATHS.raw, 'utf8')).source?.fileKey ?? null }; } catch {}
            }
            writeFileSync(TOKEN_PATHS.raw, JSON.stringify(data, null, 2) + '\n');
            run('피그마 플러그인에서 수신');
            res.end(JSON.stringify({ ok: !last.error, ...last }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [figmaTokenSync()],
  server: { port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        designSystem: resolve(import.meta.dirname, 'design-system/index.html'),
      },
    },
  },
});
