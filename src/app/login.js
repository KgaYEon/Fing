// 로그인 화면
// 실제 소셜 로그인 연결은 나중 단계예요. 지금은 버튼을 누르면 다음 화면으로 넘어가요.
import { wordmark, socialButton } from '../ui/ui.js';

const NEXT = null; // 다음 화면(온보딩)이 만들어지면 주소를 넣어요. 예: '../onboarding/'

document.getElementById('wordmark').innerHTML = wordmark();
document.getElementById('buttons').innerHTML = ['google', 'kakao', 'apple'].map((k) => socialButton(k)).join('');

document.getElementById('buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.social-button');
  if (!btn) return;
  if (NEXT) location.href = NEXT;
  else console.info(`[로그인] ${btn.dataset.provider} 선택 — 다음 화면은 아직 없어요`);
});
