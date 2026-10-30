// 직접 만든 컴포넌트 도우미 — HTML 문자열을 만들어 줘요.
// 사용: import { logo, rating, tabBar } from '/src/ui/ui.js';
import { icon } from '../icons/icons.js';

const LOGO_SVG = `<svg viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 4C0 1.79086 1.79086 0 4 0H46C48.2091 0 50 1.79086 50 4V9C50 11.2091 48.2091 13 46 13H4C1.79086 13 0 11.2091 0 9V4Z" fill="currentColor"/><path d="M50 18.6027C50 17.6967 49.1571 16.9582 48.1191 17.0018C43.6344 17.1904 39.2156 18.0522 35.0588 19.5533C30.3219 21.2638 26.0178 23.771 22.3923 26.9317C18.7668 30.0924 15.8909 33.8447 13.9288 37.9743C12.2069 41.5983 11.2184 45.4505 11.0021 49.3602C10.952 50.2651 11.7992 51 12.8384 51L23.9985 51C25.0377 51 25.8724 50.2645 25.9534 49.3613C26.1507 47.1611 26.7444 44.9982 27.7161 42.9531C28.9282 40.4019 30.7049 38.0838 32.9446 36.1312C35.1844 34.1786 37.8433 32.6297 40.7697 31.573C43.1156 30.7259 45.5966 30.2083 48.1203 30.0363C49.1563 29.9657 50 29.238 50 28.332L50 18.6027Z" fill="currentColor"/></svg>`;

/** 로고 — logo() / logo({ white: true }) */
export const logo = ({ white = false, label = 'Fing' } = {}) =>
  `<span class="logo${white ? ' logo--white' : ''}" role="img" aria-label="${label}">${LOGO_SVG}</span>`;

/** 별점 — rating(3) / rating(4, 5) */
export const rating = (value, max = 5) =>
  `<span class="rating" role="img" aria-label="${max}점 중 ${value}점">${Array.from({ length: max }, (_, i) => icon(i < value ? 'star-2' : 'star-str', { size: 16 })).join('')}</span>`;

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
