import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { buildTokens, TOKEN_PATHS } from './scripts/build-tokens.mjs';
import { buildIcons, ICON_PATHS } from './scripts/build-icons.mjs';
import { buildTypography, TYPE_PATHS } from './scripts/build-typography.mjs';
import { writeRaw } from './scripts/figma-raw.mjs';
import { buildSpacing } from './scripts/build-spacing.mjs';
import { buildRadius } from './scripts/build-radius.mjs';
import { buildEffects, EFFECT_PATHS } from './scripts/build-effects.mjs';
import { buildComponents, COMPONENT_PATHS, componentList } from './scripts/build-components.mjs';

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
      const sp = buildSpacing();
      const rd = buildRadius();
      const ef = buildEffects();
      const ic = buildIcons();
      const ty = buildTypography();
      const co = buildComponents();
      result.components = co.components;
      result.spacing = sp.steps;
      result.radius = rd.steps;
      result.effects = ef.styles;
      result.lint += co.lint + sp.lint + rd.lint + ef.lint;
      result.icons = ic.icons;
      result.textStyles = ty.styles;
      result.lint += ic.lint + ty.lint;
      last = { at: new Date().toISOString(), result, error: null };
      console.log(`\x1b[36m[figma-sync]\x1b[0m ${why} → 색상 ${result.colors}개, 아이콘 ${ic.icons}개, 글자 ${ty.styles}개, 간격 ${sp.steps}개, 둥글기 ${rd.steps}개, 그림자 ${ef.styles}개, 컴포넌트 ${co.components}개, 점검 ${result.lint}개`);
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
      const watched = [TOKEN_PATHS.raw, TOKEN_PATHS.map, TOKEN_PATHS.lintConfig, ICON_PATHS.raw, TYPE_PATHS.raw, EFFECT_PATHS.raw, COMPONENT_PATHS.raw, COMPONENT_PATHS.list];
      server.watcher.add(watched);
      server.watcher.on('change', (file) => {
        if (watched.includes(file)) run('원본 변경 감지');
      });

      server.middlewares.use('/__figma-sync', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'OPTIONS') return res.end();
        if (req.method === 'GET' && req.url.startsWith('/config')) return res.end(JSON.stringify({ componentSets: componentList() }));
        if (req.method === 'GET') return res.end(JSON.stringify({ ok: true, ...last }));
        if (req.method !== 'POST') { res.statusCode = 405; return res.end('{}'); }

        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const isVars = data.format === 'fing-figma-variables@1' && Array.isArray(data.variables);
            const isIcons = data.format === 'fing-figma-icons@1' && Array.isArray(data.icons);
            const isType = data.format === 'fing-figma-text-styles@1' && Array.isArray(data.styles);
            const isComp = data.format === 'fing-figma-components@1' && Array.isArray(data.componentSets);
            const isEff = data.format === 'fing-figma-effect-styles@1' && Array.isArray(data.styles);
            if (!isVars && !isIcons && !isType && !isComp && !isEff) throw new Error('형식이 맞지 않아요');
            const target = isIcons ? ICON_PATHS.raw : isType ? TYPE_PATHS.raw : isComp ? COMPONENT_PATHS.raw : isEff ? EFFECT_PATHS.raw : TOKEN_PATHS.raw;
            // 같은 내용이면 파일을 건드리지 않아요 (깃 충돌 방지). 바뀌면 감시 기능이 다시 만들어요.
            const changed = writeRaw(target, data);
            if (changed || !last.result) run(`피그마 플러그인에서 ${isIcons ? '아이콘' : isType ? '텍스트 스타일' : isComp ? '컴포넌트' : isEff ? '그림자' : '변수'} 수신`);
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

// 주소 끝 슬래시 없이 와도 열리게: /ds → /ds/
function trailingSlash(paths) {
  const mw = (req, res, next) => {
    const url = req.url.split('?')[0];
    if (paths.includes(url)) { res.statusCode = 301; res.setHeader('Location', url + '/' + (req.url.slice(url.length) || '')); return res.end(); }
    next();
  };
  return { name: 'fing-trailing-slash', configureServer(s) { s.middlewares.use(mw); }, configurePreviewServer(s) { s.middlewares.use(mw); } };
}

export default defineConfig({
  base: './',
  plugins: [figmaTokenSync(), trailingSlash(['/ds', '/login'])],
  server: { port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        ds: resolve(import.meta.dirname, 'ds/index.html'),
        login: resolve(import.meta.dirname, 'login/index.html'),
      },
    },
  },
});
