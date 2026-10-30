// 디자인시스템 페이지에 보여줄 "직접 만든" 컴포넌트 목록
// demos: 화면에 그려볼 예시들 / code: 복사용 코드 / notes: 피그마에서 확인하면 좋을 점
import { icon } from '../icons/icons.js';
import { logo, wordmark, rating, tabBar, socialButton } from './ui.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const components = [
  {
    key: 'toggle', name: 'Toggle', figma: 'toggle', figmaId: '85:646', file: 'toggle.css',
    lead: '켜고 끄는 스위치예요. 눌러보세요.',
    demos: [
      { label: 'on', html: '<input type="checkbox" class="toggle" role="switch" aria-label="예시 켜짐" checked>' },
      { label: 'off', html: '<input type="checkbox" class="toggle" role="switch" aria-label="예시 꺼짐">' },
    ],
    code: '<input type="checkbox" class="toggle" role="switch" aria-label="알림 받기">',
    notes: [],
  },
  {
    key: 'radio', name: 'Radio', figma: 'Radio btn', figmaId: '21:616', file: 'radio.css',
    lead: '여러 개 중 하나를 고를 때 써요. 같은 name끼리 하나만 선택돼요.',
    demos: [
      { label: 'selected', html: '<input type="radio" class="radio" name="demo-radio" aria-label="선택됨" checked>' },
      { label: 'default', html: '<input type="radio" class="radio" name="demo-radio" aria-label="선택 안 됨">' },
    ],
    code: '<input type="radio" class="radio" name="type" aria-label="선택지">',
    notes: [],
  },
  {
    key: 'chip', name: 'Chip', figma: 'chip 1', figmaId: '22:138', file: 'chip.css',
    lead: '눌러서 켜고 끄는 칩이에요. 눌러보세요.',
    demos: [
      { label: 'white', html: '<button class="chip" aria-pressed="false">칩버튼</button>' },
      { label: 'white · 눌림', html: '<button class="chip" aria-pressed="true">칩버튼</button>' },
      { label: 'primary', html: '<button class="chip chip--primary" aria-pressed="false">칩버튼</button>' },
      { label: 'primary · 눌림', html: '<button class="chip chip--primary" aria-pressed="true">칩버튼</button>' },
      { label: '아이콘', html: `<button class="chip" aria-pressed="false">${icon('ai', { size: 16 })}칩버튼</button>` },
    ],
    code: '<button class="chip" aria-pressed="false">칩버튼</button>\n<button class="chip chip--primary" aria-pressed="true">칩버튼</button>',
    notes: [
      '크기가 70.4 × 29.4, 테두리가 0.72px처럼 소수예요. 칩을 늘렸다 줄인 흔적 같아요. 코드는 높이 28px, 테두리 1px로 만들었어요.',
      'primary가 눌렸을 때 글자색이 btn/white로 연결돼 있어요. txt/white가 맞아요.',
    ],
  },
  {
    key: 'badge', name: 'Badge', figma: 'chip 2', figmaId: '22:156', file: 'badge.css',
    lead: '상태를 보여주는 표시예요. 누르는 용도가 아니에요.',
    demos: [
      { label: 'default', html: '<span class="badge">칩버튼</span>' },
      { label: 'warn', html: '<span class="badge badge--warn">칩버튼</span>' },
      { label: 'danger', html: '<span class="badge badge--danger">칩버튼</span>' },
      { label: 'success', html: '<span class="badge badge--success">칩버튼</span>' },
      { label: 'white', html: '<span class="badge badge--white">칩버튼</span>' },
      { label: 'sm', html: '<span class="badge badge--sm">NEW</span>' },
    ],
    code: '<span class="badge">칩버튼</span>\n<span class="badge badge--warn">주의</span>\n<span class="badge badge--sm">NEW</span>',
    notes: [
      '피그마 이름이 "chip 2"인데 누르는 칩이 아니라 상태 표시라서 코드에서는 badge로 불러요.',
      '기록 카드의 NEW 표시는 여백을 줄여서(4/12) 쓰고 있어요. 그래서 badge--sm을 따로 만들었어요. 피그마에도 size 속성을 추가하면 좋아요.',
      'white만 크기가 66×34로 다른 것(64×32)보다 2px 커요.',
    ],
  },
  {
    key: 'rating', name: 'Rating', figma: 'star', figmaId: '142:3789', file: 'rating.css',
    lead: '별점이에요. 숫자만 넣으면 채운 별과 빈 별이 만들어져요.',
    demos: [
      { label: '3점', html: rating(3) },
      { label: '5점', html: rating(5) },
    ],
    code: "import { rating } from '/src/ui/ui.js';\nel.innerHTML = rating(3);   // 5점 중 3점",
    notes: ['두 variant 이름이 똑같이 "Property 1=Default"예요. filled=true / filled=false처럼 구분해주세요.'],
  },
  {
    key: 'icon-box', name: 'Icon box', figma: 'icon box', figmaId: '190:2319', file: 'icon-box.css',
    lead: '연한 배경 위에 아이콘을 올린 상자예요.',
    demos: [
      { label: 'bluetooth', html: `<span class="icon-box">${icon('bluetooth')}</span>` },
      { label: 'bell', html: `<span class="icon-box">${icon('bell')}</span>` },
    ],
    code: "<span class=\"icon-box\">${icon('bluetooth')}</span>",
    notes: ['왼쪽 여백만 12px이고 나머지는 8px이에요. 코드는 아이콘을 가운데에 놨어요.'],
  },
  {
    key: 'logo', name: 'Logo', figma: 'logo wrap', figmaId: '185:1937', file: 'logo.css',
    lead: 'Fing 로고예요. 파란색과 흰색 두 가지예요.',
    demos: [
      { label: 'primary', html: logo() },
      { label: 'white', html: `<span style="display:inline-flex;padding:12px;border-radius:12px;background:var(--color-btn-default)">${logo({ white: true })}</span>` },
      { label: '글자 로고 (로그인)', html: wordmark() },
    ],
    code: "import { logo, wordmark } from '/src/ui/ui.js';\nheader.innerHTML = logo();\nheader.innerHTML = logo({ white: true });\nheader.innerHTML = wordmark();   // FING 글자",
    notes: [],
  },
  {
    key: 'tab-bar', name: 'Tab bar', figma: 'btm nav + nav-menu', figmaId: '22:276', file: 'tab-bar.css', wide: true,
    lead: '화면 아래 고정되는 메뉴예요. 눌러보세요.',
    demos: [{ label: '리포트 선택', html: tabBar('report') }],
    code: "import { tabBar } from '/src/ui/ui.js';\ndocument.body.insertAdjacentHTML('beforeend', tabBar('home'));",
    notes: [
      '메뉴 글자가 텍스트 스타일에 연결 안 돼 있어요 (Pretendard SemiBold 12/14). 코드는 가장 비슷한 Caption 2(12/16)를 써요.',
      '위쪽 선 색이 원색(뉴트럴/300)에 직접 연결돼 있어요. str/gray 같은 시멘틱 토큰을 쓰면 좋아요.',
      '피그마의 "btm"은 이 탭바 + 안드로이드 시스템 버튼(btm stat)이에요. 시스템 버튼은 폰이 알아서 보여줘서 코드로 만들지 않아요.',
    ],
  },
  {
    key: 'segmented', name: 'Segmented', figma: 'Tab List - 설정 항목', figmaId: '33:583', file: 'segmented.css', wide: true,
    lead: '둘 중 하나를 고르는 탭이에요. 눌러보세요.',
    demos: [{ label: '왼쪽 선택', html: '<div class="segmented" role="tablist"><button class="segmented__tab" role="tab" aria-selected="true">왼쪽 버튼</button><button class="segmented__tab" role="tab" aria-selected="false">오른쪽 버튼</button></div>' }],
    code: '<div class="segmented" role="tablist">\n  <button class="segmented__tab" role="tab" aria-selected="true">왼쪽 버튼</button>\n  <button class="segmented__tab" role="tab" aria-selected="false">오른쪽 버튼</button>\n</div>',
    notes: [
      'state=right는 탭 사이 간격이 8px, state=left는 4px이에요. 코드는 4px로 맞췄어요.',
      'state=left의 오른쪽 탭만 높이가 36px(나머지 44px)이에요. 코드는 44px로 맞췄어요.',
      '선택된 탭 글자색이 btn/white로 연결돼 있어요. txt/white가 맞아요.',
    ],
  },
  {
    key: 'choice', name: 'Choice', figma: 'cont', figmaId: '193:2632', file: 'choice.css', wide: true,
    lead: '목록에서 하나를 고르는 카드예요. 눌러보세요.',
    demos: [{ label: '선택 목록', html: `<div style="display:flex;flex-direction:column;gap:8px">${['초급', '중급', '상급'].map((t, i) => `<label class="choice"><input type="radio" name="demo-choice"${i === 1 ? ' checked' : ''}><span class="choice__text"><span class="choice__title">${t} 서퍼</span><span class="choice__sub">보조설명입니다</span></span>${i === 1 ? '<span class="badge">추천</span>' : ''}</label>`).join('')}</div>` }],
    code: '<label class="choice">\n  <input type="radio" name="level">\n  <span class="choice__text">\n    <span class="choice__title">선택지입니다</span>\n    <span class="choice__sub">보조설명입니다</span>\n  </span>\n  <span class="badge">추천</span>\n</label>',
    notes: ['배경색이 글자용 토큰(txt/white)에 연결돼 있어요. 배경용 btn/white가 맞아요.'],
  },
  {
    key: 'stat-card', name: 'Stat card', figma: 'card (작은 숫자)', figmaId: '134:3766', file: 'card.css',
    lead: '숫자 하나를 크게 보여주는 작은 카드예요.',
    demos: [{ label: '예시', html: '<div class="stat-card" style="width:178px"><span class="stat-card__label">캐치율</span><div class="stat-card__body"><span class="stat-card__value">72%</span><span class="stat-card__date">10월 30일</span></div></div>' }],
    code: '<div class="stat-card">\n  <span class="stat-card__label">캐치율</span>\n  <div class="stat-card__body">\n    <span class="stat-card__value">72%</span>\n    <span class="stat-card__date">10월 30일</span>\n  </div>\n</div>',
    notes: ['큰 숫자 색이 #000000으로 직접 들어가 있어요. txt/black에 연결해주세요.'],
  },
  {
    key: 'record-card', name: 'Record card', figma: 'card (기록)', figmaId: '151:4232', file: 'card.css', wide: true,
    lead: '리포트 화면의 기록 카드예요.',
    demos: [{ label: '예시', html: `<article class="record-card"><div class="record-card__head"><div class="record-card__title"><span class="record-card__date">10월 30일 목요일<span class="badge badge--sm">NEW</span></span><span class="record-card__meta">양양 죽도 / 1.2m</span></div><button class="record-card__fav" aria-label="즐겨찾기">${icon('star-2', { size: 20 })}</button></div><div class="record-card__foot"><span class="record-card__note">라이딩 12개 / 1시간 20분</span><span class="record-card__rate">캐치율 72%</span></div></article>` }],
    code: '<article class="record-card">\n  <div class="record-card__head">\n    <div class="record-card__title">\n      <span class="record-card__date">10월 30일 목요일<span class="badge badge--sm">NEW</span></span>\n      <span class="record-card__meta">양양 죽도 / 1.2m</span>\n    </div>\n    <button class="record-card__fav" aria-label="즐겨찾기">…별 아이콘…</button>\n  </div>\n  <div class="record-card__foot">\n    <span class="record-card__note">라이딩 12개 / 1시간 20분</span>\n    <span class="record-card__rate">캐치율 72%</span>\n  </div>\n</article>',
    notes: [
      '날짜 글자색이 #000000으로 직접 들어가 있어요. txt/black에 연결해주세요.',
      '오른쪽 별이 21px 상자 안에 26px로 들어가 있어서 삐져나와요. 코드는 24px 버튼으로 만들었어요.',
    ],
  },
  {
    key: 'option-row', name: 'Option row', figma: 'sheet box', figmaId: '33:666', file: 'option-row.css', wide: true,
    lead: '아래에서 올라오는 시트 안에서 고르는 줄이에요.',
    demos: [{ label: '상대유형 / 상대종목', html: `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:16px;background:var(--color-bg)"><label class="option-row">${icon('shadow', { size: 28 })}<span class="option-row__text"><span class="option-row__title">상대</span><span class="option-row__desc">설명 텍스트</span></span><span class="option-row__value">파란텍스트</span><input type="radio" class="radio" name="demo-opt" checked></label><label class="option-row"><span class="option-row__text"><span class="option-row__title">상대</span><span class="option-row__desc">설명 텍스트</span></span><span class="option-row__value">파란텍스트</span><input type="radio" class="radio" name="demo-opt"></label></div>` }],
    code: '<label class="option-row">\n  ${icon(\'shadow\', { size: 28 })}\n  <span class="option-row__text">\n    <span class="option-row__title">상대</span>\n    <span class="option-row__desc">설명 텍스트</span>\n  </span>\n  <span class="option-row__value">파란텍스트</span>\n  <input type="radio" class="radio" name="target">\n</label>',
    notes: [
      '설명 글자색 #7E8B9D가 토큰에 없어요. 코드는 가장 가까운 뉴트럴/800을 썼어요. 쓰임에 맞는 txt 토큰을 정해주세요.',
      '설명 글자 상자 높이가 15px로 고정돼 있어서 글자(16px)가 1px 삐져나와요.',
    ],
  },
  {
    key: 'modal', name: 'Modal', figma: 'modal', figmaId: '90:1019', file: 'modal.css', wide: true,
    lead: '확인을 받는 팝업이에요. 버튼은 Button 컴포넌트를 작게(button--sm) 써요.',
    demos: [
      { label: 'primary', html: '<div class="modal"><div class="modal__text"><p class="modal__title">기록을 저장할까요?</p><p class="modal__sub">저장하지 않으면 지금 기록이 사라져요</p></div><div class="modal__actions"><button class="button button--sm button--secondary">저장 없이 나가기</button><button class="button button--sm">저장하고 나가기</button></div></div>' },
      { label: 'danger', html: '<div class="modal"><div class="modal__text"><p class="modal__title">기록을 삭제할까요?</p><p class="modal__sub">삭제하면 되돌릴 수 없어요</p></div><div class="modal__actions"><button class="button button--sm button--danger-sec">취소</button><button class="button button--sm button--danger">삭제하기</button></div></div>' },
    ],
    code: '<dialog class="modal" id="save">\n  <div class="modal__text">\n    <p class="modal__title">기록을 저장할까요?</p>\n    <p class="modal__sub">저장하지 않으면 지금 기록이 사라져요</p>\n  </div>\n  <div class="modal__actions">\n    <button class="button button--sm button--secondary">저장 없이 나가기</button>\n    <button class="button button--sm">저장하고 나가기</button>\n  </div>\n</dialog>\n<!-- 열기: document.getElementById(\'save\').showModal() -->',
    notes: ['모달 안 버튼이 전부 Button의 primary에 색만 덮어씌워 쓰고 있어요. secondary·danger-sec·danger variant로 바꾸면 버튼 색을 고칠 때 같이 바뀌어요.'],
  },
  {
    key: 'social-button', name: 'Social button', figma: '로그인 화면 login-box', figmaId: '185:1817', file: 'social-button.css', wide: true,
    lead: '소셜 로그인 버튼이에요. 아이콘은 왼쪽, 글자는 가운데예요.',
    demos: [{ label: '구글 · 카카오 · 애플', html: `<div style="display:flex;flex-direction:column;gap:12px">${socialButton('google')}${socialButton('kakao')}${socialButton('apple')}</div>` }],
    code: "import { socialButton } from '/src/ui/ui.js';\nel.innerHTML = socialButton('kakao');",
    notes: [
      '피그마에서 컴포넌트가 아니라 화면 안의 프레임이에요. 다른 화면에서도 쓰면 컴포넌트로 만들어두면 좋아요.',
      '카카오 노란색이 #FAE100이에요. 카카오 공식 로그인 버튼 색은 #FEE500이라 한 번 확인해보세요.',
      '글자를 가운데 두려고 오른쪽에 투명한 애플 아이콘을 넣어뒀어요. 코드는 아이콘을 따로 띄워서 같은 결과를 냈어요.',
    ],
  },
].map((c) => ({ ...c, codeHtml: esc(c.code) }));
