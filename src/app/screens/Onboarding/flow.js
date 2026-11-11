// 온보딩 순서 — 피그마 "onboarding" 섹션(180:1595)을 왼쪽부터 순서대로
// 모든 단계는 피그마 컴포넌트 "onboarding -"(439:2751) 틀 + 슬롯 구조예요: 위 Top · 가운데 내용 · 아래 Foot
// 환영 → 권한 안내 → 닉네임 → 기록 준비 → 질문 1·2·3 → 준비 끝
// (피그마의 "권한 설정 완료" 화면 439:2876은 비슷한 화면이 이어져서 뺐어요)
export const FLOW = {
  welcome: { next: 'permission' },
  permission: { prev: 'welcome', next: 'nickname' },
  nickname: { prev: 'permission', next: 'intro' },
  intro: { prev: 'nickname', next: 'q1' },
  q1: { prev: 'intro', next: 'q2' },
  q2: { prev: 'q1', next: 'q3' },
  q3: { prev: 'q2', next: 'done' },
  done: {},
};
export const ORDER = Object.keys(FLOW);

export const DRAFT = 'fing.onboarding'; // 답을 잠깐 저장 (새로고침해도 이어서)

export const NICK_MAX = 10;
export const NICK_SAMPLE = '춤추는 돌고래 01';   // 입력칸 예시 — 닉네임 화면에서 건너뛰면 이 이름을 써요
const count = (s) => [...s].length; // 한글·이모지도 한 글자씩
export const nickLength = (raw) => count(raw.trim());
export function nickState(raw = '') {
  const v = raw.trim();
  if (!v) return { ok: false, msg: '', tone: '' };
  if (count(v) > NICK_MAX) return { ok: false, msg: `${NICK_MAX}자 이하로 입력해주세요`, tone: 'danger' };
  return { ok: true, msg: '좋은 이름이네요!', tone: 'good' };
}
