// 스플래시 → 잠시 뒤 다음 화면으로 넘어가요.
// 다음 화면(로그인)이 만들어지면 NEXT에 주소를 넣으면 돼요.
import { logo } from '../ui/ui.js';

const NEXT = './login/';
const DURATION = 1800; // ms

const el = document.getElementById('splash');
el.innerHTML = logo({ white: true });

if (NEXT) {
  setTimeout(() => {
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => location.replace(NEXT), { once: true });
    // 움직임 줄이기 설정이면 애니메이션이 없으니 바로 이동
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) location.replace(NEXT);
  }, DURATION);
}
