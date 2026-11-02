// 직접 만든 컴포넌트 도우미 — HTML 문자열을 만들어 줘요.
// 사용: import { logo, rating, tabBar } from '/src/ui/ui.js';
import { icon } from '../icons/icons.js';

// 피그마 components 섹션 "logo wrap" (color=ver2) — 411:2628
const LOGO_SVG = `<svg viewBox="1 0.9 62.1 58.2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M38.4907 0.987076C39.7008 0.959435 40.9119 0.946586 42.1211 1.02081C47.9686 1.37973 54.0488 3.3911 58.1873 7.82454C61.0751 10.9598 62.7691 15.0558 62.9605 19.3658C63.0259 20.5953 63.0218 21.9153 62.8577 23.1289C62.7084 24.2331 61.1247 24.4503 60.6733 23.4973C60.4393 23.0032 60.3582 22.0695 60.2447 21.508C59.2377 16.5186 55.3026 12.2584 50.1075 12.3575C47.868 12.4005 45.2211 13.5182 43.6443 15.2047C41.668 17.3569 40.5934 20.219 40.6512 23.1759C40.7066 26.7346 42.3839 29.8048 45.6018 31.3214C47.126 32.0398 47.5986 31.945 49.2206 32.0746L55.3155 32.5393C55.7632 32.5738 56.2154 32.6044 56.6627 32.6425C57.2746 32.6951 58.0926 32.6283 58.557 33.1127C58.7806 33.3502 58.9007 33.6709 58.8893 34.001C58.8629 34.6841 58.2709 35.0797 57.8263 35.5073C57.5207 35.8015 57.1994 36.0852 56.8885 36.3736L53.8281 39.2203L48.7892 43.913C47.3687 45.2334 45.9131 46.5596 44.5096 47.8962C41.8293 50.3521 39.1654 52.8267 36.5181 55.32L34.3701 57.3193C33.8652 57.7953 33.3024 58.3574 32.7513 58.7662C32.5167 58.9405 32.1307 58.9531 31.8474 58.956L18.8912 58.9573L14.6188 58.9556C14.2383 58.9556 13.855 58.965 13.4752 58.9602C12.8795 58.9527 12.1918 59.0592 11.7359 58.5784C11.5538 58.3826 11.4381 58.1318 11.4061 57.863C11.3594 57.4539 11.3858 56.2852 11.3859 55.8376L11.3867 51.7667L11.3885 38.4627C9.40083 38.5017 7.29997 38.4636 5.3027 38.4652L3.25802 38.4682C2.87314 38.4688 2.46565 38.484 2.08451 38.4449C1.43999 38.3791 1.02686 37.8412 1.01168 37.1974C0.994997 36.4895 1.0033 35.788 1.00447 35.0826L1.00503 31.3652L1.00463 19.5485L1.00501 8.02276L1.0045 4.50015C1.00284 3.82662 0.992494 3.15293 1.01026 2.47932C1.0023 2.00579 1.251 1.49925 1.69237 1.29987C2.12677 1.10364 2.93281 1.1657 3.42202 1.1654L5.62776 1.16562L12.5502 1.16575L28.1698 1.16595L33.3505 1.16603C34.2491 1.16614 35.2005 1.18186 36.0956 1.16222C36.853 1.1456 37.7012 1.01769 38.4907 0.987076Z" fill="currentColor"/><circle cx="58.5" cy="54.4653" r="4.5" fill="currentColor"/></svg>`;

// 피그마 components 섹션 "full - logo" — 185:2101
const WORDMARK_SVG = `<svg viewBox="9 8.9 192 58.2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path transform="translate(8 8)" d="M38.4907 0.987076C39.7008 0.959435 40.9119 0.946586 42.1211 1.02081C47.9686 1.37973 54.0488 3.3911 58.1873 7.82454C61.0751 10.9598 62.7691 15.0558 62.9605 19.3658C63.0259 20.5953 63.0218 21.9153 62.8577 23.1289C62.7084 24.2331 61.1247 24.4503 60.6733 23.4973C60.4393 23.0032 60.3582 22.0695 60.2447 21.508C59.2377 16.5186 55.3026 12.2584 50.1075 12.3575C47.868 12.4005 45.2211 13.5182 43.6443 15.2047C41.668 17.3569 40.5934 20.219 40.6512 23.1759C40.7066 26.7346 42.3839 29.8048 45.6018 31.3214C47.126 32.0398 47.5986 31.945 49.2206 32.0746L55.3155 32.5393C55.7632 32.5738 56.2154 32.6044 56.6627 32.6425C57.2746 32.6951 58.0926 32.6283 58.557 33.1127C58.7806 33.3502 58.9007 33.6709 58.8893 34.001C58.8629 34.6841 58.2709 35.0797 57.8263 35.5073C57.5207 35.8015 57.1994 36.0852 56.8885 36.3736L53.8281 39.2203L48.7892 43.913C47.3687 45.2334 45.9131 46.5596 44.5096 47.8962C41.8293 50.3521 39.1654 52.8267 36.5181 55.32L34.3701 57.3193C33.8652 57.7953 33.3024 58.3574 32.7513 58.7662C32.5167 58.9405 32.1307 58.9531 31.8474 58.956L18.8912 58.9573L14.6188 58.9556C14.2383 58.9556 13.855 58.965 13.4752 58.9602C12.8795 58.9527 12.1918 59.0592 11.7359 58.5784C11.5538 58.3826 11.4381 58.1318 11.4061 57.863C11.3594 57.4539 11.3858 56.2852 11.3859 55.8376L11.3867 51.7667L11.3885 38.4627C9.40083 38.5017 7.29997 38.4636 5.3027 38.4652L3.25802 38.4682C2.87314 38.4688 2.46565 38.484 2.08451 38.4449C1.43999 38.3791 1.02686 37.8412 1.01168 37.1974C0.994997 36.4895 1.0033 35.788 1.00447 35.0826L1.00503 31.3652L1.00463 19.5485L1.00501 8.02276L1.0045 4.50015C1.00284 3.82662 0.992494 3.15293 1.01026 2.47932C1.0023 2.00579 1.251 1.49925 1.69237 1.29987C2.12677 1.10364 2.93281 1.1657 3.42202 1.1654L5.62776 1.16562L12.5502 1.16575L28.1698 1.16595L33.3505 1.16603C34.2491 1.16614 35.2005 1.18186 36.0956 1.16222C36.853 1.1456 37.7012 1.01769 38.4907 0.987076Z" fill="currentColor"/><circle cx="66.5" cy="62.4653" r="4.5" fill="currentColor"/><rect x="80" y="9.01758" width="16" height="58" rx="2" fill="currentColor"/><path d="M104 11.0176C104 9.91301 104.895 9.01758 106 9.01758H110.5H116.844C117.559 9.01758 118.22 9.39968 118.577 10.0196L133.267 35.5335C134.288 37.3079 137 36.5831 137 34.5356V25.5176V11.0176C137 9.91301 137.895 9.01758 139 9.01758H149C150.105 9.01758 151 9.91301 151 11.0176V65.0176C151 66.1221 150.105 67.0176 149 67.0176H139.118C138.423 67.0176 137.778 66.6573 137.414 66.0658L121.703 40.5355C120.646 38.818 118 39.567 118 41.5837V65.0176C118 66.1221 117.105 67.0176 116 67.0176H106C104.895 67.0176 104 66.1221 104 65.0176V11.5176V11.0176Z" fill="currentColor"/><path d="M159 11.0176C159 9.91301 159.895 9.01758 161 9.01758H166H199C200.105 9.01758 201 9.91301 201 11.0176V21.0176C201 22.1221 200.105 23.0176 199 23.0176H175C173.895 23.0176 173 23.913 173 25.0176V51.0176C173 52.1221 173.895 53.0176 175 53.0176H185.5C186.605 53.0176 187.5 52.1221 187.5 51.0176V41.0176C187.5 39.913 188.395 39.0176 189.5 39.0176H199C200.105 39.0176 201 39.913 201 41.0176V65.0176C201 66.1221 200.105 67.0176 199 67.0176H166H161C159.895 67.0176 159 66.1221 159 65.0176L159 11.0176Z" fill="currentColor"/></svg>`;

/** 글자 로고 FING — wordmark() / wordmark({ white: true }) */
export const wordmark = ({ white = false } = {}) =>
  `<span class="wordmark${white ? ' logo--white' : ''}" role="img" aria-label="FING">${WORDMARK_SVG}</span>`;

/** 로고 — logo() / logo({ white: true }) */
export const logo = ({ white = false, label = 'Fing' } = {}) =>
  `<span class="logo${white ? ' logo--white' : ''}" role="img" aria-label="${label}">${LOGO_SVG}</span>`;

/** 별점 — rating(3) / rating(4, 5) */
export const rating = (value, max = 5) =>
  `<span class="rating" role="img" aria-label="${max}점 중 ${value}점">${Array.from({ length: max }, (_, i) => icon(i < value ? 'star-2' : 'star-str', { size: 16 })).join('')}</span>`;

/** 소셜 로그인 버튼 — socialButton('kakao') */
const SOCIAL = {
  google: { label: '구글로 시작하기', icon: 'google' },
  kakao: { label: '카카오로 시작하기', icon: 'kakao' },
  apple: { label: 'Apple로 시작하기', icon: 'apple' },
};
export const socialButton = (kind, { label } = {}) =>
  `<button type="button" class="social-button social-button--${kind}" data-provider="${kind}">${icon(SOCIAL[kind].icon)}<span>${label || SOCIAL[kind].label}</span></button>`;

/** 하단 탭 — tabBar('report') */
export const TABS = [
  { key: 'home', label: '홈', icon: 'home', href: '#' },
  { key: 'record', label: '기록하기', icon: 'plus', href: '#' },
  { key: 'report', label: '리포트', icon: 'chart', href: '#' },
  { key: 'ai', label: 'AI', icon: 'ai', href: '#' },
  { key: 'my', label: '마이', icon: 'my', href: '#' },
];
export const tabBar = (current = 'home', tabs = TABS) =>
  `<nav class="tab-bar" aria-label="주요 메뉴">${tabs
    .map((t) => `<a class="tab-bar__item" href="${t.href}"${t.key === current ? ' aria-current="page"' : ''}>${icon(t.icon)}<span>${t.label}</span></a>`)
    .join('')}</nav>`;

/** 누르면 상태가 바뀌는 것들을 한 번에 연결 (칩·탭·하단 탭) */
export function enhance(root = document) {
  root.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip[aria-pressed]');
    if (chip) chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');

    const tab = e.target.closest('.segmented__tab');
    if (tab) tab.parentElement.querySelectorAll('.segmented__tab').forEach((t) => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));

    const item = e.target.closest('.tab-bar__item');
    if (item) {
      e.preventDefault();
      item.parentElement.querySelectorAll('.tab-bar__item').forEach((t) => (t === item ? t.setAttribute('aria-current', 'page') : t.removeAttribute('aria-current')));
    }
  });
}

/** 누르면 로딩 표시 + 연타 막기 — await busy(btn, async () => { ... }) */
export async function busy(btn, task) {
  if (btn.getAttribute('aria-busy') === 'true') return;
  btn.setAttribute('aria-busy', 'true');
  try { return await task(); } finally { btn.removeAttribute('aria-busy'); }
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** 잠깐 뜨는 안내 — toast('준비 중이에요') */
export function toast(message, ms = 2000) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('is-on'), ms);
}

/** 아래에서 올라오는 시트 — openSheet({ title, sub, body }) */
export function openSheet({ title, sub = '', body = '', label } = {}) {
  const d = document.createElement('dialog');
  d.className = 'sheet';
  d.setAttribute('aria-label', label || title || '시트');
  d.innerHTML = `
    <button class="sheet__handle" type="button" aria-label="닫기"></button>
    ${title ? `<header class="sheet__head"><h2 class="sheet__title">${title}</h2>${sub ? `<p class="sheet__sub">${sub}</p>` : ''}</header>` : ''}
    <div class="sheet__body">${body}</div>`;
  document.body.append(d);
  const close = () => {
    if (d.classList.contains('is-closing')) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    d.classList.add('is-closing');
    const done = () => { d.close(); d.remove(); };
    reduce ? done() : d.addEventListener('animationend', done, { once: true });
  };
  d.addEventListener('cancel', (e) => { e.preventDefault(); close(); });           // Esc
  d.addEventListener('click', (e) => { if (e.target === d) close(); });          // 바깥(어두운 곳) 누르기
  const handle = d.querySelector('.sheet__handle');
  let dragged = false;
  handle.addEventListener('click', () => { if (dragged) { dragged = false; return; } close(); });
  // 손잡이를 아래로 끌어서 닫기
  let startY = null;
  handle.addEventListener('pointerdown', (e) => { startY = e.clientY; handle.setPointerCapture(e.pointerId); d.style.transition = 'none'; });
  handle.addEventListener('pointermove', (e) => { if (startY == null) return; const dy = Math.max(0, e.clientY - startY); if (dy > 4) dragged = true; d.style.transform = `translateY(${dy}px)`; });
  handle.addEventListener('pointerup', (e) => {
    if (startY == null) return;
    const dy = e.clientY - startY; startY = null; d.style.transition = ''; d.style.transform = '';
    if (dy > 80) close();
  });
  d.showModal();
  d.querySelector('.sheet__body').scrollTop = 0;
  return { el: d, close };
}
