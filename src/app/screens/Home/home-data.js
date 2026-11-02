// 홈 화면 예시 데이터 — 피그마 "홈" 섹션(130:2074)에 적힌 값을 그대로 옮겼어요.
// 진짜 기록·파도 정보가 연결되면 이 파일만 바꾸면 돼요.
// (피그마에 없는 값은 "예시"라고 적어뒀어요)

export const METRICS = {
  catch: { label: '캐치율', desc: '패들한 파도 중 탄 파도의 비율' },
  avg: { label: '평균 라이딩', desc: '파도 하나를 탄 평균 시간' },
  longest: { label: '최장 라이딩', desc: '가장 오래 탄 파도의 시간' },
  count: { label: '파도 수', desc: '1시간 동안 탄 파도의 개수' },
};
export const METRIC_ORDER = ['catch', 'avg', 'longest', 'count'];

// 오늘의 파도 (Home 284:2221)
export const WAVE = {
  spot: '강원도 양양 죽도',
  status: '서핑하기 좋아요',
  height: 0.8, // m
  fit: 82, // 적합도
  wind: '약함',
  tide: '14:00', // 만조
  note: '평소 잘 잡았던 파도와 비슷해요',
};

// 나의 목표 — 피그마는 캐치율(11번 캐치하기)만 있어요. 나머지는 예시.
export const GOALS = {
  catch: { value: 11, unit: '번 캐치하기' },
  avg: { value: 8, unit: '초 평균 라이딩' }, // 예시
  longest: { value: 12, unit: '초 최장 라이딩' }, // 예시
  count: { value: 15, unit: '개 파도 타기' }, // 예시
};

// 이전 최대 기록
export const BEST = {
  catch: { value: '42%', date: '10월 8일' },
  count: { value: '12개', date: '10월 2일' },
  avg: { value: '2시간 01분', date: '10월 8일' },
  longest: { value: '4시간 23분', date: '10월 11일' },
};
export const BEST_ORDER = ['catch', 'count', 'avg', 'longest']; // 피그마 순서

// 시트에 보이는 "최근 기록 : …" (sheet 19:523 · 412:2730)
export const LATEST = { catch: '30%', avg: '6초', longest: '10초', count: '4개' };

// 최근 기록 (오래된 것 → 최근). 파도 수는 피그마 값, 나머지는 예시.
export const RECENT = [
  { date: '09/26', catch: 28, avg: 5, longest: 9, count: 7 },
  { date: '10/02', catch: 35, avg: 6, longest: 11, count: 9 },
  { date: '10/06', catch: 40, avg: 7, longest: 12, count: 12 },
  { date: '10/11', catch: 31, avg: 6, longest: 10, count: 8 },
  { date: '10/16', catch: 42, avg: 8, longest: 14, count: 14 },
  { date: '10/20', catch: 36, avg: 6, longest: 12, count: 10 },
  { date: '10/24', catch: 38, avg: 7, longest: 13, count: 13 },
];
export const UNIT = { catch: '%', avg: '초', longest: '초', count: '개' };

// 트래커 상태 (Status - 트래커 연결 상태 7:1791 · 33:941 · 33:823 · 33:904)
export const TRACKER = { state: 'ok', battery: 82 };
