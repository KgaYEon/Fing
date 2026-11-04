// 앱 화면 주소 — 화면을 새로 만들면 ready를 true로 바꿔요.
// (아직 없는 화면으로 가려고 하면 "준비 중" 안내만 띄워요)
export const ROUTES = {
  splash: { path: '/', ready: true },
  login: { path: '/login', ready: true },
  onboarding: { path: '/onboarding', ready: true },
  home: { path: '/home', ready: true },
  report: { path: '/report', ready: true },
  ai: { path: '/ai', ready: true },
  my: { path: '/my', ready: true },
};

// 처음 온 사람 / 다시 온 사람 — 온보딩을 끝내면 markOnboarded()를 불러요
const KEY = 'fing.onboarded';
export const isOnboarded = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
export const markOnboarded = () => { try { localStorage.setItem(KEY, '1'); } catch {} };
export const resetOnboarded = () => { try { localStorage.removeItem(KEY); } catch {} };
