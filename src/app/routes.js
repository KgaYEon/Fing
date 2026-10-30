// 앱 화면 주소 모음 — 화면을 새로 만들면 ready를 true로 바꿔요.
// (아직 없는 화면으로 가면 스플래시로 돌아가 버려서, 준비 안 된 곳은 안내만 띄워요)
export const ROUTES = {
  login: { path: '/login/', ready: true },
  onboarding: { path: '/onboarding/', ready: false },
  home: { path: '/home/', ready: false },
};

// 처음 온 사람 / 다시 온 사람 — 온보딩을 끝내면 markOnboarded()를 불러요
const KEY = 'fing.onboarded';
export const isOnboarded = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
export const markOnboarded = () => { try { localStorage.setItem(KEY, '1'); } catch {} };
export const resetOnboarded = () => { try { localStorage.removeItem(KEY); } catch {} };
