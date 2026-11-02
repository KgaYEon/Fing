// 홈 — 피그마 "홈" 섹션 Home(284:2221)
// 위: 로고 + 트래커 칩 (누르면 연결 상태 카드)
// 오늘의 파도 → 나의 목표 → 이전 최대 기록 → 최근 기록, 아래: 탭 메뉴
// 아이콘은 모두 피그마 ic/ 아이콘(icon())만 써요.
import { icon } from '../icons/icons.js';
import { logo, tabBar, TABS, toast, openSheet } from '../ui/ui.js';
import { ROUTES } from './routes.js';
import { METRICS, METRIC_ORDER, WAVE, GOALS, BEST, BEST_ORDER, LATEST, RECENT, UNIT, TRACKER } from './home-data.js';

// ─── 설정 저장 (목표 기준 · 최근 기록 기준) ───
const KEY = 'fing.home';
const profile = (() => { try { return JSON.parse(localStorage.getItem('fing.profile')) || {}; } catch { return {}; } })();
const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
const settings = {
  goal: saved.goal || (METRICS[profile.goal] ? profile.goal : 'catch'), // 온보딩 3번 답을 처음 목표로
  recent: saved.recent || 'count',
};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {} };

// 트래커 상태 확인용: 주소 뒤에 ?tracker=low / off / error 를 붙이면 바뀌어요
const tracker = { ...TRACKER, state: new URLSearchParams(location.search).get('tracker') || TRACKER.state };
if (tracker.state === 'low') tracker.battery = 12;

// ─── 위 ───
document.getElementById('home-logo').innerHTML = logo({ label: 'Fing 홈' });
const trackerChip = document.getElementById('tracker-chip');
trackerChip.dataset.state = tracker.state;
trackerChip.insertAdjacentHTML('beforeend', icon('on', { className: 'home__dot' }));

// ─── 오늘의 파도 ───
const now = new Date();
document.getElementById('wave-date').textContent = `${now.getMonth() + 1}월 ${now.getDate()}일 · ${now.getHours() < 12 ? '오전' : '오후'}`;
document.getElementById('wave-spot').textContent = WAVE.spot;
document.getElementById('wave-status').textContent = WAVE.status;
document.getElementById('wave-height').textContent = WAVE.height;
document.getElementById('wave-note').textContent = WAVE.note;
const fit = document.getElementById('wave-fit');
fit.style.setProperty('--fit', WAVE.fit / 100);
fit.setAttribute('aria-label', `적합도 100점 중 ${WAVE.fit}점`);
fit.querySelector('.home__fit-num').textContent = WAVE.fit;
document.getElementById('wave-weather').innerHTML = [
  ['wind', '바람', WAVE.wind],
  ['time', '만조', WAVE.tide],
].map(([ic, k, v]) => `<li class="home__weather-item">${icon(ic, { size: 20 })}<span class="home__weather-k">${k}</span><span class="home__weather-v">${v}</span></li>`).join('');

// ─── 나의 목표 ───
function renderGoal() {
  const g = GOALS[settings.goal];
  document.getElementById('goal-value').textContent = g.value;
  document.getElementById('goal-unit').textContent = g.unit;
}

// ─── 이전 최대 기록 ───
document.getElementById('best-list').innerHTML = BEST_ORDER.map((k) => `
  <li class="home__row">
    <span class="home__row-label"><span class="home__row-name">${METRICS[k].label}</span><span class="home__bar" aria-hidden="true"></span><span class="home__row-date">${BEST[k].date}</span></span>
    <span class="home__row-value">${BEST[k].value}</span>
  </li>`).join('');

// ─── 최근 기록 ───
function renderRecent() {
  const k = settings.recent;
  document.getElementById('recent-metric').textContent = METRICS[k].label;
  const max = Math.max(...RECENT.map((r) => r[k]));
  const list = document.getElementById('recent-list');
  list.innerHTML = RECENT.map((r) => `
    <li class="home__mini${r[k] === max ? ' is-best' : ''}">
      <span class="home__mini-date">${r.date}</span>
      <span class="home__mini-value">${r[k]}${UNIT[k]}</span>
    </li>`).join('');
  list.scrollLeft = list.scrollWidth; // 최근 기록이 보이게 오른쪽 끝부터
}

renderGoal();
renderRecent();

// ─── 기준 고르는 시트 (sheet 412:2730 목표 · 19:523 기록) ───
function pickSheet({ title, sub, key, after }) {
  const body = `
    <form class="home-sheet" method="dialog">
      <div class="home-sheet__list" role="radiogroup" aria-label="${title}">
        ${METRIC_ORDER.map((k) => `
          <label class="option-row">
            <span class="option-row__text"><span class="option-row__title">${METRICS[k].label}</span><span class="option-row__desc">${METRICS[k].desc}</span></span>
            <span class="option-row__value">최근 기록 : ${LATEST[k]}</span>
            <input type="radio" class="radio" name="metric" value="${k}"${settings[key] === k ? ' checked' : ''}>
          </label>`).join('')}
      </div>
      <div class="home-sheet__foot">
        <p class="home-sheet__hint">다시 바꾸기 전까지 이 설정이 유지돼요</p>
        <button type="submit" class="button">설정 저장하기</button>
      </div>
    </form>`;
  const sheet = openSheet({ title, sub, body });
  sheet.el.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    settings[key] = new FormData(e.target).get('metric');
    save();
    after();
    sheet.close();
  });
}
document.getElementById('goal-set').addEventListener('click', () =>
  pickSheet({ title: '기준 목표 설정', sub: '어떤 기준의 기록을 목표로 할까요?', key: 'goal', after: renderGoal }));
document.getElementById('recent-set').addEventListener('click', () =>
  pickSheet({ title: '기준 기록 설정', sub: '어떤 기준의 기록을 표시할까요?', key: 'recent', after: renderRecent }));

// ─── 트래커 상태 카드 ───
const STATES = {
  ok: { label: '정상 연결됨', icon: 'link' },
  low: { label: '배터리 부족', icon: 'problem', desc: '라이딩 전, 기기 충전을 해주세요' },
  off: { label: '연결 해제됨', icon: 'disconnect' },
  error: { label: '기기 오류', icon: 'problem', desc: '계속 연결되지 않나요? 서비스 센터를 방문해 주세요.', noBattery: true },
};
const pop = document.getElementById('tracker-pop');
function renderTracker() {
  const s = STATES[tracker.state] || STATES.ok;
  const batt = tracker.state === 'off' ? null : tracker.battery;
  const battIcon = batt == null ? '' : icon(batt <= 20 ? 'batt-low' : batt <= 60 ? 'batt-half' : 'batt-full', { size: 24, className: 'home-pop__batt-ic' });
  pop.dataset.state = tracker.state;
  pop.innerHTML = `
    <div class="home-pop__top">
      <div class="home-pop__text">
        <span class="home-pop__eyebrow">FING TRACKER</span>
        <span class="home-pop__status">${icon('on', { className: 'home__dot' })}${s.label}</span>
        ${s.desc ? `<span class="home-pop__desc">${s.desc}</span>` : ''}
      </div>
      <span class="home-pop__icon">${icon(s.icon)}</span>
    </div>
    ${s.noBattery ? '' : `
    <div class="home-pop__batt">
      <span class="home-pop__batt-k">배터리</span>
      <span class="home-pop__batt-v">${battIcon}${batt == null ? '-' : `${batt}%`}</span>
    </div>`}`;
}
renderTracker();
const setPop = (open) => {
  pop.hidden = !open;
  trackerChip.setAttribute('aria-expanded', open ? 'true' : 'false');
};
trackerChip.addEventListener('click', (e) => { e.stopPropagation(); setPop(pop.hidden); });
document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target)) setPop(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { setPop(false); trackerChip.focus(); } });

// ─── 버튼 · 탭 ───
document.getElementById('record-start').addEventListener('click', () => toast('기록 화면은 아직 준비 중이에요'));

const nav = document.getElementById('tab');
nav.outerHTML = tabBar('home', TABS);
document.querySelector('.tab-bar').addEventListener('click', (e) => {
  const a = e.target.closest('.tab-bar__item');
  if (!a) return;
  const route = ROUTES[TABS.find((t) => a.textContent.trim() === t.label)?.key];
  if (route?.ready) return; // 준비된 화면이면 그대로 이동
  e.preventDefault();
  if (a.getAttribute('aria-current') !== 'page') toast(`${a.textContent.trim()} 화면은 아직 준비 중이에요`);
});
