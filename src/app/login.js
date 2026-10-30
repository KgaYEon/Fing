// 로그인 화면
// - 소셜 버튼: 빙글빙글 0.8초 → 처음 온 사람은 온보딩, 다시 온 사람은 홈
//   (진짜 소셜 로그인 연결은 나중 단계)
// - 약관 링크: 아래에서 올라오는 시트로 보여줘요
import { wordmark, socialButton, busy, wait, toast, openSheet } from '../ui/ui.js';
import { ROUTES, isOnboarded } from './routes.js';
import { TERMS, PRIVACY } from './legal.js';

document.getElementById('wordmark').innerHTML = wordmark();
const buttons = document.getElementById('buttons');
buttons.innerHTML = ['google', 'kakao', 'apple'].map((k) => socialButton(k)).join('');

buttons.addEventListener('click', (e) => {
  const btn = e.target.closest('.social-button');
  if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
  const all = buttons.querySelectorAll('.social-button');
  all.forEach((b) => { if (b !== btn) b.setAttribute('aria-disabled', 'true'); });   // 다른 버튼도 잠깐 막기 (모양은 그대로)
  busy(btn, async () => {
    await wait(800);                                            // 로그인하는 척
    const next = isOnboarded() ? ROUTES.home : ROUTES.onboarding;
    if (next.ready) { location.href = next.path; return; }
    toast(isOnboarded() ? '홈 화면은 아직 준비 중이에요' : '온보딩 화면은 아직 준비 중이에요');
  }).finally(() => all.forEach((b) => b.removeAttribute('aria-disabled')));
});

document.querySelectorAll('[data-doc]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const doc = a.dataset.doc === 'terms' ? TERMS : PRIVACY;
    openSheet({ title: doc.title, body: doc.body });
  }),
);
