// 온보딩 — 피그마 "onboarding" 섹션(180:1595)을 순서대로 옮겼어요.
// 환영 → 권한 안내 → 권한 완료 → 닉네임 → 기록 준비 → 질문 1·2·3 → 준비 끝
// 아이콘은 모두 피그마 ic/ 아이콘(icon())만 써요. 준비 끝 화면의 꽃가루 그림은 피그마에서 그대로 뽑아왔어요.
import { icon } from '../icons/icons.js';
import { busy, wait, toast } from '../ui/ui.js';
import { ROUTES, markOnboarded } from './routes.js';

const root = document.getElementById('ob');

// ─── 질문 내용 (피그마 onboarding-1·2·3) ───
const Q = {
  q1: {
    title: '요즘 서핑은<br>어떻게 하고 있나요?',
    sub: '나에게 맞는 기록을 준비할게요',
    options: [
      { value: 'new', title: '아직 해본 적 없어요', sub: '첫 서핑을 준비하고 있어요' },
      { value: 'lesson', title: '강습 받을 때만 타요', sub: '강사와 함께 바다에 나가요' },
      { value: 'solo', title: '강사 없이도 타요', sub: '혼자 또는 친구와 바다에 나가요' },
    ],
  },
  q2: {
    title: '지금 나는<br>어느 쪽에 가까운가요?',
    sub: '요즘 내 서핑과 가장 비슷한 걸 골라주세요',
    options: [
      { value: 'white', title: '하얀 파도에서 연습해요', sub: '부서진 파도에서 일어나는 연습을 하고 있어요' },
      { value: 'green', title: '깨지기 전 파도를 노려요', sub: '라인업까지 나가서 파도를 잡아보고 있어요' },
      { value: 'side', title: '옆으로 길게 타보고 있어요', sub: '파도를 잡으면 옆으로 타려고 해요' },
    ],
  },
  q3: {
    title: '요즘 가장<br>늘리고 싶은 기록을 골라주세요',
    sub: '고른 기록을 중심으로 지난 나와 비교해 알려드려요',
    options: [
      { value: 'catch', title: '캐치율', sub: '패들한 파도 중 탄 파도의 비율' },
      { value: 'avg', title: '평균 라이딩', sub: '파도 하나를 탄 평균 시간' },
      { value: 'longest', title: '최장 라이딩', sub: '가장 오래 탄 파도의 시간' },
      { value: 'count', title: '파도 수', sub: '시간 당 파도 수' },
    ],
  },
};
// 2번 답에 따라 3번의 "추천"이 바뀌어요 (피그마 198:1928 · 198:2134 · 198:2255)
const RECOMMEND = { white: 'catch', green: 'count', side: 'avg' };

const PERMISSIONS = {
  필수: [{ icon: 'bluetooth', title: '블루투스', sub: '트래커와 연결해서 서핑 기록을 받아와요' }],
  선택: [
    { icon: 'bell', title: '알림', sub: '서핑 기록이 도착하면 바로 알려드려요' },
    { icon: 'location', title: '위치', sub: '가까운 바다의 파도 정보를 보여드려요' },
    { icon: 'picture', title: '사진', sub: '프로필 사진을 변경할 수 있어요' },
  ],
};

const NICK_MAX = 10;

// ─── 답 저장 (새로고침해도 이어서) ───
const DRAFT = 'fing.onboarding';
const PROFILE = 'fing.profile';
const load = () => { try { return JSON.parse(sessionStorage.getItem(DRAFT)) || {}; } catch { return {}; } };
const data = load();
const save = () => { try { sessionStorage.setItem(DRAFT, JSON.stringify(data)); } catch {} };

// ─── 조각들 ───
const btn = (label, { kind = '', act, disabled = false } = {}) =>
  `<button type="button" class="button${kind ? ` button--${kind}` : ''}" data-act="${act}"${disabled ? ' aria-disabled="true"' : ''}>${label}</button>`;
const hint = '<p class="ob__hint">아래 계속하기 버튼을 눌러 진행해주세요</p>';
const pair = (nextOk) =>
  `<div class="ob__pair">${btn('이전으로', { kind: 'secondary', act: 'prev' })}${btn('다음으로', { kind: nextOk ? '' : 'unselected', act: 'next', disabled: !nextOk })}</div>`;

// 준비 끝 화면의 꽃가루 — 피그마 205:2105 "Group 1171279246"을 그대로 뽑은 그림 (색만 토큰으로)
const CONFETTI = `<svg class="ob__confetti" viewBox="0 0 171 101" fill="none" aria-hidden="true"><path d="M147.129 89.871C146.379 91.5861 145.242 93.1045 143.808 94.3076C142.373 95.5108 140.68 96.3662 138.861 96.807C137.041 97.2478 135.144 97.2622 133.319 96.8489C131.493 96.4357 129.787 95.606 128.334 94.4247L130.247 92.0737C131.337 92.9603 132.617 93.583 133.987 93.8932C135.358 94.2033 136.782 94.1926 138.147 93.8617C139.513 93.5308 140.783 92.8888 141.86 91.9858C142.936 91.0828 143.79 89.9432 144.353 88.6559L147.129 89.871Z" fill="var(--color-btn-default)"/><path d="M29.5937 45.1401C28.7749 43.2693 27.5347 41.613 25.9701 40.3005C24.4055 38.9881 22.5587 38.055 20.574 37.5741C18.5892 37.0933 16.5201 37.0776 14.5283 37.5284C12.5365 37.9792 10.6758 38.8842 9.0915 40.1728L11.1775 42.7374C12.3665 41.7702 13.7631 41.091 15.258 40.7526C16.753 40.4143 18.3059 40.4261 19.7955 40.787C21.2852 41.1479 22.6713 41.8482 23.8456 42.8333C25.0199 43.8183 25.9507 45.0614 26.5652 46.4656L29.5937 45.1401Z" fill="var(--color-btn-default)"/><path d="M164.451 59.8309C163.559 59.3946 162.578 59.1705 161.585 59.1759C160.592 59.1814 159.613 59.4163 158.726 59.8623C157.839 60.3084 157.067 60.9534 156.47 61.7472C155.873 62.5409 155.467 63.4619 155.285 64.4382L156.866 64.7331C157.002 64.0004 157.307 63.3091 157.755 62.7134C158.203 62.1176 158.782 61.6335 159.448 61.2987C160.114 60.964 160.848 60.7876 161.594 60.7835C162.339 60.7795 163.075 60.9477 163.745 61.2751L164.451 59.8309Z" fill="var(--color-btn-light-press)"/><rect x="49" y="6" width="5" height="5" fill="var(--color-btn-light-press)"/><rect x="108" y="26" width="5" height="5" fill="var(--color-btn-default)"/><rect x="44" y="93" width="3" height="3" fill="var(--color-btn-default)"/><rect x="97" width="3" height="3" fill="var(--color-btn-default)"/><rect x="129" y="61" width="3" height="3" fill="var(--color-primary-400)"/><rect x="147.847" y="29" width="4.5126" height="12" transform="rotate(64.6695 147.847 29)" fill="var(--color-primary-400)"/><rect x="26.5986" y="69" width="2.02565" height="10.2261" transform="rotate(69.8272 26.5986 69)" fill="var(--color-primary-500)"/><rect x="63.4961" y="28.9493" width="2.02565" height="10.2261" transform="rotate(125.576 63.4961 28.9493)" fill="var(--color-primary-700)"/></svg>`;

// ─── 화면들 ───
const STEPS = {
  // 190:2194
  welcome: {
    next: 'permission',
    html: () => `
      <div class="ob__center ob__center--welcome">
        <span class="icon-box icon-box--lg">${icon('paper', { size: 32 })}</span>
        <div class="ob__head ob__head--center">
          <p class="ob__eyebrow">반갑습니다 서퍼님!</p>
          <h1 class="ob__title">시작하기 전에<br>몇 가지 권한 허용이 필요해요</h1>
        </div>
      </div>
      <div class="ob__foot ob__foot--one">${hint}${btn('계속하기', { act: 'next' })}</div>`,
  },
  // 190:2257
  permission: {
    prev: 'welcome',
    next: 'permission-done',
    html: () => `
      <div class="ob__body ob__body--perm">
        <h1 class="ob__title">원활한 앱 사용을 위해<br>접근 권한을 허용해주세요</h1>
        <div class="ob__perms">
          ${Object.entries(PERMISSIONS).map(([k, list]) => `
            <section class="ob__perm-group" aria-label="${k}적 접근 권한">
              <h2 class="ob__perm-label">${k}적 접근 권한</h2>
              <ul class="ob__perm-list">
                ${list.map((p) => `<li class="ob__perm"><span class="icon-box">${icon(p.icon)}</span><span class="ob__perm-text"><b>${p.title}</b><span>${p.sub}</span></span></li>`).join('')}
              </ul>
            </section>`).join('')}
        </div>
        <p class="ob__note">선택 권한의 경우 허용하지 않아도 서비스를 사용하실 수 있으나,<br>일부 서비스 이용이 제한될 수 있어요.</p>
      </div>
      <div class="ob__foot ob__foot--one">${hint}${btn('계속하기', { act: 'allow' })}</div>`,
  },
  // 193:2386
  'permission-done': {
    prev: 'permission',
    next: 'nickname',
    html: () => `
      <div class="ob__center ob__center--done">
        <span class="icon-box icon-box--lg icon-box--md-r">${icon('check', { size: 28 })}</span>
        <h1 class="ob__title ob__title--center">권한 설정이<br>완료되었습니다!</h1>
      </div>
      <div class="ob__foot ob__foot--one">${hint}${btn('계속하기', { act: 'next' })}</div>`,
  },
  // 193:2525 (빈칸) · 362:2842 (입력) · 362:2890 (너무 김)
  nickname: {
    prev: 'permission-done',
    next: 'intro',
    ok: () => nickState(data.nickname || '').ok,
    html: () => `
      <div class="ob__body ob__body--nick">
        <div class="ob__head">
          <h1 class="ob__title" id="nick-title">닉네임으로 사용할<br>서퍼님의 이름을 알려주세요!</h1>
          <p class="ob__sub" id="nick-sub">${NICK_MAX}글자 이내로 작성해주세요</p>
        </div>
        <div class="ob__field">
          <input class="ob__input" id="nick" type="text" autocomplete="nickname" enterkeyhint="next" spellcheck="false"
            placeholder="닉네임을 입력해주세요" aria-labelledby="nick-title" aria-describedby="nick-sub nick-msg" value="${escapeAttr(data.nickname || '')}">
          <div class="ob__field-msg"><span id="nick-msg" class="ob__msg"></span><span class="ob__count" id="nick-count" aria-hidden="true"></span></div>
        </div>
      </div>
      <div class="ob__foot">${pair(nickState(data.nickname || '').ok)}</div>`,
    mount: mountNickname,
  },
  // 193:2471
  intro: {
    prev: 'nickname',
    next: 'q1',
    html: () => `
      <div class="ob__center ob__center--intro">
        <div class="ob__head ob__head--center ob__head--tight">
          <h1 class="ob__title">이제, 나에게 맞는 기록을<br>준비해볼까요?</h1>
          <p class="ob__sub">몇 가지만 답하면 준비가 끝나요</p>
        </div>
      </div>
      <div class="ob__foot ob__foot--stack">${btn('건너뛰기', { kind: 'secondary', act: 'skip' })}${btn('설정하러 가기', { act: 'next' })}</div>`,
  },
  // 193:2577 · 194:1862 · 198:1928
  q1: question('q1', 1, 'intro', 'q2'),
  q2: question('q2', 2, 'q1', 'q3'),
  q3: question('q3', 3, 'q2', 'done'),
  // 205:2105
  done: {
    prev: null,
    html: () => `
      <div class="ob__center ob__center--finish">
        <span class="ob__burst">${CONFETTI}<span class="icon-box icon-box--finish">${icon('check', { size: 28 })}</span></span>
        <div class="ob__head ob__head--center">
          <h1 class="ob__title">핑과 함께 할 준비가<br>모두 끝났어요!</h1>
          <p class="ob__sub">핑과 함께 서핑을 시작해볼까요?</p>
        </div>
      </div>
      <div class="ob__foot">${btn('핑 시작하기', { act: 'finish' })}</div>`,
  },
};
const ORDER = Object.keys(STEPS);

function question(key, n, prev, next) {
  const total = 3;
  return {
    prev,
    next,
    ok: () => !!data[key],
    html: () => {
      const q = Q[key];
      const rec = key === 'q3' ? RECOMMEND[data.q2] || 'catch' : null;
      return `
        <div class="ob__progress" role="progressbar" aria-label="질문 진행" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}" aria-valuetext="${total}개 중 ${n}번째">
          <span class="ob__progress-fill" style="--from:${(n - 1) / total};--to:${n / total}"></span>
        </div>
        <div class="ob__body ob__body--q">
          <div class="ob__head ob__head--pad">
            <h1 class="ob__title" id="${key}-title">${q.title}</h1>
            <p class="ob__sub">${q.sub}</p>
          </div>
          <div class="ob__choices" role="radiogroup" aria-labelledby="${key}-title">
            ${q.options.map((o) => `
              <label class="choice">
                <input type="radio" name="${key}" value="${o.value}"${data[key] === o.value ? ' checked' : ''}>
                <span class="choice__text"><span class="choice__title">${o.title}</span><span class="choice__sub">${o.sub}</span></span>
                ${o.value === rec ? '<span class="badge">추천</span>' : ''}
              </label>`).join('')}
          </div>
        </div>
        <div class="ob__foot">${pair(!!data[key])}</div>`;
    },
    mount: (el) => {
      el.querySelector('.ob__choices').addEventListener('change', (e) => {
        data[key] = e.target.value;
        save();
        setNext(el, true);
      });
    },
  };
}

// ─── 닉네임 ───
const count = (s) => [...s].length; // 한글·이모지도 한 글자씩
function nickState(raw) {
  const v = raw.trim();
  if (!v) return { ok: false, msg: '', tone: '' };
  if (count(v) > NICK_MAX) return { ok: false, msg: `닉네임은 ${NICK_MAX}글자 이내여야 합니다`, tone: 'danger' };
  return { ok: true, msg: '좋은 이름이네요!', tone: 'good' };
}
function mountNickname(el) {
  const input = el.querySelector('#nick');
  const msg = el.querySelector('#nick-msg');
  const cnt = el.querySelector('#nick-count');
  const field = el.querySelector('.ob__field');
  const update = () => {
    const st = nickState(input.value);
    data.nickname = input.value.trim();
    save();
    msg.textContent = st.msg;
    cnt.textContent = `${count(input.value.trim())} / ${NICK_MAX}자`;
    field.dataset.tone = st.tone;
    input.setAttribute('aria-invalid', st.tone === 'danger' ? 'true' : 'false');
    setNext(el, st.ok);
  };
  input.addEventListener('input', update);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); el.querySelector('[data-act="next"]').click(); } });
  update();
  // 폰에서 키보드가 화면을 덮지 않게, 애니메이션 끝나고 포커스
  setTimeout(() => input.focus({ preventScroll: true }), 300);
}

function setNext(el, ok) {
  const b = el.querySelector('[data-act="next"]');
  if (!b) return;
  b.classList.toggle('button--unselected', !ok);
  ok ? b.removeAttribute('aria-disabled') : b.setAttribute('aria-disabled', 'true');
}

function escapeAttr(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

// ─── 화면 바꾸기 (뒤로가기 버튼도 동작) ───
let current = null;
function render(step, dir = 'fwd') {
  if (!STEPS[step]) step = 'welcome';
  // 닉네임 없이 뒤 화면으로 바로 들어오면 닉네임부터
  if (ORDER.indexOf(step) > ORDER.indexOf('nickname') && !nickState(data.nickname || '').ok) step = 'nickname';
  current = step;
  const s = STEPS[step];
  const el = document.createElement('section');
  el.className = `ob__step ob__step--${step}`;
  el.dataset.dir = dir;
  el.innerHTML = s.html();
  root.replaceChildren(el);
  s.mount?.(el);
  document.title = `Fing · 시작 준비 (${ORDER.indexOf(step) + 1}/${ORDER.length})`;
  const h = el.querySelector('h1');
  if (h && step !== 'nickname') { h.tabIndex = -1; h.focus({ preventScroll: true }); }
}
function go(step) {
  history.pushState({ step, from: current }, '', `#${step}`);
  render(step, 'fwd');
}
function back() {
  const prev = STEPS[current]?.prev;
  if (!prev) return;
  if (history.state?.from === prev) history.back();
  else { history.replaceState({ step: prev }, '', `#${prev}`); render(prev, 'back'); }
}
addEventListener('popstate', (e) => {
  const step = e.state?.step || location.hash.slice(1) || 'welcome';
  const dir = ORDER.indexOf(step) < ORDER.indexOf(current) ? 'back' : 'fwd';
  render(step, dir);
});

root.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.getAttribute('aria-disabled') === 'true' || b.getAttribute('aria-busy') === 'true') return;
  const s = STEPS[current];
  switch (b.dataset.act) {
    case 'prev': back(); break;
    case 'next': if (!s.ok || s.ok()) go(s.next); break;
    case 'skip': go('done'); break;
    case 'allow':
      // 실제 권한 요청은 앱(네이티브)에서 붙일 예정 — 지금은 잠깐 기다리는 척만 해요
      busy(b, async () => { await wait(600); go(s.next); });
      break;
    case 'finish':
      busy(b, async () => {
        try {
          localStorage.setItem(PROFILE, JSON.stringify({ nickname: data.nickname || '', surfing: data.q1 || null, level: data.q2 || null, goal: data.q3 || null }));
        } catch {}
        markOnboarded();
        try { sessionStorage.removeItem(DRAFT); } catch {}
        await wait(400);
        if (ROUTES.home.ready) location.href = ROUTES.home.path;
        else toast('홈 화면은 아직 준비 중이에요');
      });
      break;
  }
});

const start = location.hash.slice(1);
history.replaceState({ step: STEPS[start] ? start : 'welcome' }, '', location.hash || '#welcome');
render(STEPS[start] ? start : 'welcome');
