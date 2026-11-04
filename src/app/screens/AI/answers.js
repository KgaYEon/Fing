// AI 답변 만들기 (무료 버전) — 진짜 AI 대신, 질문 속 낱말을 보고 내 기록·오늘 파도로 답을 만들어요.
// 위에서부터 차례로 맞는 걸 찾아요. 새 질문 종류를 넣고 싶으면 RULES에 한 칸 추가하면 돼요.
// (Claude 키를 넣으면 이 답 대신 Claude가 대답하고, 이동 버튼만 여기서 가져가요 — useChat.js)
import { SESSIONS, METRICS, BEST, perHour, dateParts } from '../Report/report-data.js';
import { WAVE, GOALS } from '../Home/home-data.js';

export const SUGGESTIONS = ['최근 5번 캐치율 평균은?', '오늘 죽도에서 언제 들어가면 좋아?', '내 패들이 짧다는 건 무슨 뜻이야?'];

// ─── 도우미 ───
const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];   // 같은 말이 반복되지 않게 조금씩 다르게
const md = (iso) => { const p = dateParts(iso); return `${p.m}월 ${p.d}일`; };
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
const nickname = () => read('fing.my.profile').nickname || read('fing.profile').nickname || '서퍼';
const goalKey = () => read('fing.home').goal || read('fing.profile').goal || 'catch';
const spotName = WAVE.spot.split(' ').pop();   // "강원도 양양 죽도" → "죽도"

const latest = SESSIONS[0];
const first = SESSIONS[SESSIONS.length - 1];
const recent5 = SESSIONS.slice(0, 5);
const topBy = (key) => SESSIONS.reduce((a, b) => ((key === 'count' ? perHour(b) : b[key]) > (key === 'count' ? perHour(a) : a[key]) ? b : a));
const byMonth = (m) => SESSIONS.filter((s) => dateParts(s.date).m === m);

// 이동 버튼
const L = {
  report: { label: '평균 리포트 보러가기', to: '/report', primary: true },
  sessions: { label: '서핑별 기록 보러가기', to: '/report/sessions' },
  latest: { label: '이 기록 자세히 보기', to: `/report/session/${latest.id}`, primary: true },
  home: { label: '오늘의 파도 보러가기', to: '/home', primary: true },
  goal: { label: '목표 바꾸러 가기', to: '/home' },
};
const session = (s) => ({ label: `${md(s.date)} 기록 보기`, to: `/report/session/${s.id}`, primary: true });

// ─── 질문 종류 (위에서부터 먼저 맞는 것) ───
// test: 질문(띄어쓰기·물음표 뺀 글)에 이 낱말이 있으면 · reply: 답 만들기
const RULES = [
  // 안전 — 판단을 대신하지 않아요 (가장 먼저)
  {
    test: /들어가도돼|들어가도될|위험|안전|사고|해파리|이안류|특보/,
    reply: () => ({
      text: `바다에 들어가도 되는지는 제가 정할 수 없어요. 현장 안전요원 안내와 기상 특보를 꼭 먼저 확인해 주세요. 참고로 오늘 ${spotName}는 파고 ${WAVE.height}m, 바람 ${WAVE.wind}이에요.`,
      links: [L.home],
    }),
  },
  // 인사
  {
    test: /^(안녕|하이|hi|hello|헬로|반가|ㅎㅇ|좋은아침|굿모닝)/i,
    reply: () => ({
      text: pick([
        `안녕하세요, ${nickname()}님! 오늘 ${spotName}는 파고 ${WAVE.height}m에 적합도 ${WAVE.fit}점이에요. 궁금한 게 있으면 편하게 물어보세요.`,
        `반가워요, ${nickname()}님! 오늘 파도나 내 기록에 대해 뭐든 물어보세요.`,
      ]),
      links: [], suggest: true,
    }),
  },
  // 고마워
  { test: /고마|감사|땡큐|thank|ㄳ|ㄱㅅ/i, reply: () => ({ text: pick(['천만에요! 오늘도 즐거운 서핑 하세요 🏄', '도움이 됐다니 다행이에요. 또 궁금한 거 있으면 물어보세요!']), links: [] }) },
  // 잘 가
  { test: /잘가|바이|bye|다음에|ㅂㅂ|안녕히/i, reply: () => ({ text: `다음에 또 봐요, ${nickname()}님! 안전하게 서핑하세요.`, links: [] }) },
  // 너는 누구
  {
    test: /누구|너는뭐|넌뭐|이름이뭐|정체|ai야|자기소개/i,
    reply: () => ({ text: '저는 핑의 서핑 도우미예요. 내 서핑 기록과 오늘의 파도를 보고, 이해하기 쉽게 알려드려요.', links: [], suggest: true }),
  },
  // 뭘 할 수 있어
  {
    test: /뭐할수|뭘할수|할수있는|도와줄|도움|기능|사용법|어떻게써/,
    reply: () => ({ text: '이런 걸 물어볼 수 있어요. 최근 기록 분석, 캐치율·라이딩 시간, 제일 잘 탄 날, 오늘 파도와 들어가기 좋은 시간, 캐치율 올리는 팁이요.', links: [], suggest: true }),
  },
  // 기분 · 응원
  {
    test: /힘들|어려워|못하겠|무서|자신없|우울|속상|못탔|안늘|정체기/,
    reply: () => ({
      text: `처음 기록 ${first.catch}%에서 지금 ${latest.catch}%까지 왔어요. 눈에 안 보여도 분명히 늘고 있어요. 오늘은 기록 말고 파도 하나 즐겁게 타는 걸 목표로 해봐요!`,
      links: [L.report],
    }),
  },
  // 최근 기록 분석
  {
    test: /분석|요약|정리|흐름|추세|늘었|발전|성장|기록어때|실력/,
    reply: () => {
      const d = latest.catch - first.catch;
      return {
        text: `최근 5번 평균 캐치율은 ${avg(recent5.map((s) => s.catch))}%예요. 첫 기록 ${first.catch}%에서 최근 ${latest.catch}%로 ${Math.abs(d)}%p ${d >= 0 ? '올라, 개선되고 있는 흐름이에요.' : '내려갔어요. 컨디션이 다른 날도 있었는지 같이 볼까요?'}`,
        links: [L.sessions, L.report],
      };
    },
  },
  // 지난달과 비교
  {
    test: /지난달|이번달|월별|한달|저번달/,
    reply: () => {
      const now = dateParts(latest.date).m; const prev = now - 1;
      const a = byMonth(prev); const b = byMonth(now);
      if (!a.length || !b.length) return { text: '비교할 만큼 두 달 기록이 아직 없어요.', links: [L.sessions] };
      const ca = avg(a.map((s) => s.catch)); const cb = avg(b.map((s) => s.catch));
      return { text: `${prev}월은 ${a.length}번 서핑에 평균 캐치율 ${ca}%, ${now}월은 ${b.length}번 서핑에 ${cb}%예요. ${cb >= ca ? `${cb - ca}%p 올랐어요!` : `${ca - cb}%p 내려갔지만, 아직 ${now}월 기록이 적어요.`}`, links: [L.sessions] };
    },
  },
  // 제일 잘 탄 날
  {
    test: /제일잘|가장잘|최고기록|베스트|best|잘탄날|최고의날/i,
    reply: () => {
      const s = topBy('catch');
      return { text: `캐치율이 가장 높았던 날은 ${md(s.date)} ${s.spot}예요. 파고 ${s.height}m에서 ${s.paddle}개 중 ${s.caught}개를 잡아 캐치율 ${s.catch}%였어요.`, links: [session(s)] };
    },
  },
  // 팁
  {
    test: /팁|잘하는법|잘타는|올리는법|올리려면|늘리려면|연습|방법|비결|조언/,
    reply: () => ({
      text: pick([
        '캐치율을 올리려면 파도가 오기 조금 더 일찍, 2~3번 더 저어 보세요. 파도를 잡기 직전 패들이 짧으면 놓치기 쉬워요.',
        '시선을 보드 앞이 아니라 가려는 방향 멀리 두면 일어날 때 중심 잡기가 쉬워져요.',
        '라인업에서는 파도가 부서지는 자리보다 조금 바깥에서 기다려 보세요. 깨지기 전 파도를 잡기 좋아요.',
      ]),
      links: [{ label: '시간대별 캐치율 보러가기', to: `/report/session/${latest.id}` }],
    }),
  },
  // 최장 라이딩
  {
    test: /최장|가장오래|제일오래|제일길|가장길/,
    reply: () => { const s = topBy('longest'); return { text: `가장 오래 탄 파도는 ${md(s.date)} ${s.spot}에서 ${s.longest}초예요. 최근 기록은 ${latest.longest}초예요.`, links: [session(s)] }; },
  },
  // 평균 라이딩
  {
    test: /라이딩|타는시간|탄시간|몇초/,
    reply: () => ({ text: `최근 5번 평균 라이딩은 ${avg(recent5.map((s) => s.avg))}초예요. 가장 길었던 평균은 ${BEST.avg.value}(${BEST.avg.date})예요.`, links: [L.report] }),
  },
  // 파도 수
  {
    test: /파도수|몇개|몇번탔|파도몇|개수/,
    reply: () => ({ text: `최근 서핑(${md(latest.date)})에서는 ${latest.minutes}분 동안 ${latest.rides}번 탔어요. 1시간으로 치면 ${perHour(latest)}개예요. 최고는 ${BEST.count.value}(${BEST.count.date})예요.`, links: [L.latest] }),
  },
  // 서핑 횟수
  {
    test: /몇번했|몇번갔|서핑횟수|얼마나자주|몇번서핑|총몇/,
    reply: () => { const m = dateParts(latest.date).m; return { text: `지금까지 ${SESSIONS.length}번 서핑했어요. 그중 ${m}월에 ${byMonth(m).length}번 다녀왔어요.`, links: [L.sessions] }; },
  },
  // 캐치율 평균
  {
    test: /캐치율|평균캐치/,
    reply: () => { const v = recent5.map((s) => s.catch); return { text: `최근 5번 캐치율 평균은 ${avg(v)}%예요. 가장 높았던 날은 ${Math.max(...v)}%, 가장 낮았던 날은 ${Math.min(...v)}%였어요.`, links: [{ label: '캐치율 변화 보러가기', to: '/report', primary: true }] }; },
  },
  // 최근 · 지난번
  {
    test: /최근|지난번|마지막|저번|어제|요즘/,
    reply: () => ({ text: `마지막 서핑은 ${md(latest.date)} ${latest.spot}(파고 ${latest.height}m)였어요. ${latest.minutes}분 동안 ${latest.rides}번 탔고 캐치율은 ${latest.catch}%예요.`, links: [L.latest] }),
  },
  // 목표
  {
    test: /목표/,
    reply: () => {
      const k = goalKey(); const g = GOALS[k];
      return { text: `지금 목표는 "${g.value}${g.unit}"예요(${METRICS[k].label} 기준). 홈의 "목표 설정"에서 바꿀 수 있어요.`, links: [L.goal] };
    },
  },
  // 패들
  {
    test: /패들/,
    reply: () => ({ text: '패들이 짧다는 건, 파도를 잡기 전에 노를 젓는(패들) 시간이 부족했다는 뜻이에요. 파도가 오기 조금 더 일찍, 2~3번 더 저어 보면 캐치율이 올라갈 수 있어요.', links: [{ label: '시간대별 캐치율 보러가기', to: `/report/session/${latest.id}` }] }),
  },
  // 언제 들어가 · 물때
  {
    test: /언제|입수|들어가|몇시|시간대|만조|간조|물때/,
    reply: () => ({ text: `오늘 ${spotName}는 파고 ${WAVE.height}m, 바람 ${WAVE.wind}이에요. 만조(${WAVE.tide}) 앞뒤 1~2시간이 파도가 가장 고르게 들어올 때라, 그 시간에 들어가 보는 걸 추천해요.`, links: [L.home] }),
  },
  // 오늘 파도 · 날씨
  {
    test: /오늘|파도|날씨|바람|파고|컨디션|적합도/,
    reply: () => ({ text: `오늘 ${spotName}는 파고 ${WAVE.height}m, 바람 ${WAVE.wind}, 적합도 ${WAVE.fit}점이에요. ${WAVE.note}.`, links: [L.home] }),
  },
  // 장소
  {
    test: /어디|스팟|장소|해변|바다추천/,
    reply: () => {
      const spots = {};
      for (const s of SESSIONS) (spots[s.spot] ||= []).push(s.catch);
      const best = Object.entries(spots).map(([k, v]) => [k, avg(v), v.length]).sort((a, b) => b[1] - a[1])[0];
      return { text: `가장 자주 간 곳과 성적을 보면, ${best[0]}에서 ${best[2]}번 서핑하며 평균 캐치율 ${best[1]}%로 제일 잘 탔어요.`, links: [L.sessions] };
    },
  },
];

const FALLBACK = () => ({ text: '음, 그건 아직 잘 모르겠어요. 내 서핑 기록이나 오늘의 파도에 대해 물어봐 주세요.', links: [], suggest: true });

// 답변: { text, links: [{ label, to, primary }], suggest?: 추천 질문 다시 보여주기 }
export function answer(q) {
  const t = q.toLowerCase().replace(/[\s?!.~,…]/g, '');
  const rule = RULES.find((r) => r.test.test(t));
  return rule ? rule.reply() : FALLBACK();
}
