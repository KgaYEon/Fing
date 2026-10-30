// 직접 만든 컴포넌트 도우미 — HTML 문자열을 만들어 줘요.
// 사용: import { logo, rating, tabBar } from '/src/ui/ui.js';
import { icon } from '../icons/icons.js';

const LOGO_SVG = `<svg viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 4C0 1.79086 1.79086 0 4 0H46C48.2091 0 50 1.79086 50 4V9C50 11.2091 48.2091 13 46 13H4C1.79086 13 0 11.2091 0 9V4Z" fill="currentColor"/><path d="M50 18.6027C50 17.6967 49.1571 16.9582 48.1191 17.0018C43.6344 17.1904 39.2156 18.0522 35.0588 19.5533C30.3219 21.2638 26.0178 23.771 22.3923 26.9317C18.7668 30.0924 15.8909 33.8447 13.9288 37.9743C12.2069 41.5983 11.2184 45.4505 11.0021 49.3602C10.952 50.2651 11.7992 51 12.8384 51L23.9985 51C25.0377 51 25.8724 50.2645 25.9534 49.3613C26.1507 47.1611 26.7444 44.9982 27.7161 42.9531C28.9282 40.4019 30.7049 38.0838 32.9446 36.1312C35.1844 34.1786 37.8433 32.6297 40.7697 31.573C43.1156 30.7259 45.5966 30.2083 48.1203 30.0363C49.1563 29.9657 50 29.238 50 28.332L50 18.6027Z" fill="currentColor"/></svg>`;

const WORDMARK_SVG = `<svg viewBox="0 0 121 39" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 4.17492C0 1.96579 1.79086 0.174927 4 0.174927H32.8145C35.0236 0.174927 36.8145 1.96579 36.8145 4.17493V5.74669C36.8145 7.95583 35.0236 9.74669 32.8145 9.74669H4C1.79086 9.74669 0 7.95583 0 5.74669V4.17492Z" fill="currentColor"/><path d="M36.8144 14.9267C36.8144 14.2597 36.1938 13.7159 35.4295 13.7481C32.1275 13.8869 28.874 14.5214 25.8134 15.6267C22.3256 16.8861 19.1565 18.7321 16.4871 21.0593C13.8177 23.3865 11.7002 26.1493 10.2555 29.1899C8.98778 31.8581 8.25993 34.6945 8.10068 37.5732C8.06382 38.2395 8.68757 38.7805 9.4527 38.7805L17.6698 38.7805C18.4349 38.7805 19.0495 38.239 19.1092 37.574C19.2544 35.954 19.6915 34.3615 20.407 32.8557C21.2995 30.9773 22.6076 29.2705 24.2567 27.8328C25.9058 26.3951 27.8636 25.2547 30.0182 24.4767C31.7455 23.8529 33.5722 23.4718 35.4304 23.3452C36.1932 23.2932 36.8144 22.7574 36.8144 22.0903L36.8144 14.9267Z" fill="currentColor"/><rect x="42.585" width="10.4553" height="37.9005" rx="4" fill="currentColor"/><path d="M58.2681 1.63364C58.2681 0.731407 58.9995 0 59.9017 0H62.5155H65.1039C66.5346 0 67.8565 0.764204 68.5704 2.00414L74.4523 12.2201C75.9245 14.7771 79.8321 13.7326 79.8321 10.782V4C79.8321 1.79086 81.623 0 83.8321 0H84.9805C87.1897 0 88.9805 1.79086 88.9805 4V33.9005C88.9805 36.1096 87.1897 37.9005 84.9805 37.9005H82.7208C81.3317 37.9005 80.0421 37.1799 79.3141 35.9969L74.8231 28.6989C72.7093 25.2639 67.4165 26.762 67.4165 30.7953V33.9005C67.4165 36.1096 65.6256 37.9005 63.4165 37.9005H62.2681C60.0589 37.9005 58.2681 36.1096 58.2681 33.9005V1.63364Z" fill="currentColor"/><path d="M93.5547 4C93.5547 1.79086 95.3455 0 97.5547 0H98.1289H117C119.209 0 121 1.79086 121 4V5.1484C121 7.35754 119.209 9.1484 117 9.1484H106.703C104.494 9.1484 102.703 10.9393 102.703 13.1484V24.7521C102.703 26.9612 104.494 28.7521 106.703 28.7521H108.178C110.387 28.7521 112.178 26.9612 112.178 24.7521V23.6037C112.178 21.3946 113.969 19.6037 116.178 19.6037H117C119.209 19.6037 121 21.3946 121 23.6037V33.9005C121 36.1096 119.209 37.9005 117 37.9005H98.1289H97.5547C95.3455 37.9005 93.5547 36.1096 93.5547 33.9005L93.5547 4Z" fill="currentColor"/></svg>`;

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
