// 리포트 예시 데이터 — 피그마 "리포트" 섹션(134:3179)에 적힌 값을 옮겼어요.
// 진짜 기록이 연결되면 이 파일만 바꾸면 돼요. (피그마에 없는 값은 "예시"로 채웠어요)

export const METRICS = {
  catch: { label: '캐치율', unit: '%', best: '캐치율' },
  avg: { label: '평균 라이딩', unit: '초', best: '평균 라이딩' },
  longest: { label: '최장 라이딩', unit: '초', best: '최장 라이딩' },
  count: { label: '파도 수', unit: '개', best: '1시간 기준 파도 수' },
};
export const METRIC_ORDER = ['catch', 'avg', 'longest', 'count'];

// 서핑 기록 (최근 → 오래된 순) — 날짜·장소·파고·라이딩·시간·캐치율은 피그마 값
// paddle(패들한 파도), avg/longest(초), seg(초반·중반·후반 [탄 수, 패들 수]), cond(바다 컨디션)는 예시
export const SESSIONS = [
  { id: '1012', date: '2026-10-12', spot: '죽도', height: 0.8, rides: 12, minutes: 58, catch: 43, paddle: 21, caught: 9, avg: 7, longest: 12, seg: [[4, 7], [3, 7], [2, 7]], cond: { period: 11, wind: 4, temp: 19, tide: '사리' } },
  { id: '1010', date: '2026-10-10', spot: '인구', height: 0.7, rides: 10, minutes: 52, catch: 40, paddle: 20, caught: 8, avg: 6, longest: 10, seg: [[3, 7], [3, 7], [2, 6]], cond: { period: 9, wind: 3, temp: 19, tide: '조금' } },
  { id: '1007', date: '2026-10-07', spot: '죽도', height: 0.9, rides: 9, minutes: 47, catch: 36, paddle: 22, caught: 8, avg: 6, longest: 11, seg: [[3, 8], [3, 7], [2, 7]], cond: { period: 10, wind: 5, temp: 20, tide: '사리' } },
  { id: '1003', date: '2026-10-03', spot: '기사문', height: 0.6, rides: 8, minutes: 44, catch: 38, paddle: 21, caught: 8, avg: 5, longest: 9, seg: [[3, 7], [3, 7], [2, 7]], cond: { period: 7, wind: 3, temp: 20, tide: '조금' } },
  { id: '0928', date: '2026-09-28', spot: '죽도', height: 0.8, rides: 11, minutes: 56, catch: 42, paddle: 19, caught: 8, avg: 6, longest: 10, seg: [[3, 6], [3, 7], [2, 6]], cond: { period: 9, wind: 4, temp: 21, tide: '조금' } },
  { id: '0924', date: '2026-09-24', spot: '인구', height: 0.7, rides: 9, minutes: 49, catch: 39, paddle: 18, caught: 7, avg: 5, longest: 9, seg: [[3, 6], [2, 6], [2, 6]], cond: { period: 8, wind: 3, temp: 21, tide: '사리' } },
  { id: '0920', date: '2026-09-20', spot: '죽도', height: 0.6, rides: 8, minutes: 46, catch: 35, paddle: 20, caught: 7, avg: 5, longest: 8, seg: [[3, 7], [2, 7], [2, 6]], cond: { period: 7, wind: 2, temp: 22, tide: '조금' } },
  { id: '0916', date: '2026-09-16', spot: '기사문', height: 0.9, rides: 7, minutes: 43, catch: 33, paddle: 21, caught: 7, avg: 4, longest: 8, seg: [[3, 7], [2, 7], [2, 7]], cond: { period: 10, wind: 6, temp: 22, tide: '사리' } },
  { id: '0912', date: '2026-09-12', spot: '인구', height: 0.8, rides: 8, minutes: 48, catch: 36, paddle: 22, caught: 8, avg: 5, longest: 9, seg: [[3, 8], [3, 7], [2, 7]], cond: { period: 9, wind: 4, temp: 23, tide: '조금' } },
  { id: '0908', date: '2026-09-08', spot: '죽도', height: 0.5, rides: 6, minutes: 39, catch: 30, paddle: 20, caught: 6, avg: 4, longest: 7, seg: [[2, 7], [2, 7], [2, 6]], cond: { period: 6, wind: 3, temp: 23, tide: '조금' } },
  { id: '0904', date: '2026-09-04', spot: '기사문', height: 0.7, rides: 7, minutes: 42, catch: 32, paddle: 22, caught: 7, avg: 4, longest: 8, seg: [[3, 8], [2, 7], [2, 7]], cond: { period: 8, wind: 3, temp: 24, tide: '사리' } },
];

// 1시간 기준 파도 수
export const perHour = (s) => Math.round((s.rides * 60) / s.minutes);
export const valueOf = (s, metric) => (metric === 'count' ? perHour(s) : s[metric]);

// 내 최고 기록 (피그마 값)
export const BEST = {
  catch: { value: '42%', date: '10월 8일' },
  avg: { value: '7초', date: '10월 8일' },
  longest: { value: '12초', date: '9월 29일' },
  count: { value: '6개', date: '9월 30일' },
};

// 첫 기록 모음 (피그마 값)
export const FIRSTS = [
  { date: '9월 27일', text: '처음 옆으로 탔어요' },
  { date: '9월 21일', text: '처음 10초 넘게 탔어요' },
  { date: '9월 10일', text: '첫 기록을 남겼어요' },
];

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
export const dateParts = (iso) => { const d = new Date(`${iso}T00:00:00`); return { m: d.getMonth() + 1, d: d.getDate(), dow: DOW[d.getDay()] }; };
export const longDate = (iso) => { const p = dateParts(iso); return `${p.m}월 ${p.d}일 ${p.dow}요일`; };
export const shortDate = (iso) => { const p = dateParts(iso); return `${String(p.m).padStart(2, '0')}/${String(p.d).padStart(2, '0')}`; };
export const NEW_ID = SESSIONS[0].id; // 가장 최근 기록에 NEW
