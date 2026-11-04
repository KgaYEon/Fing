// 홈 화면 예시 데이터 — 피그마 "홈" 섹션(130:2074)에 적힌 값을 그대로 옮겼어요.
// 진짜 기록·파도 정보가 연결되면 이 파일만 바꾸면 돼요.
// 기록 숫자(최대 기록 · 최근 기록)는 리포트와 같은 기록(report-data.js)에서 가져와서 화면끼리 숫자가 맞아요.
import { SESSIONS, BEST as REPORT_BEST, latestOf, valueOf, shortDate } from '../Report/report-data.js';
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
export const BEST = REPORT_BEST;
export const BEST_ORDER = ['catch', 'count', 'avg', 'longest']; // 피그마 순서

// 시트에 보이는 "최근 기록 : …" (가장 최근 서핑)
export const LATEST = { catch: latestOf('catch'), avg: latestOf('avg'), longest: latestOf('longest'), count: latestOf('count') };

// 최근 기록 (오래된 것 → 최근, 7번)
export const RECENT = SESSIONS.slice(0, 7).reverse().map((s) => ({
  date: shortDate(s.date), catch: valueOf(s, 'catch'), avg: valueOf(s, 'avg'), longest: valueOf(s, 'longest'), count: valueOf(s, 'count'),
}));
export const UNIT = { catch: '%', avg: '초', longest: '초', count: '개' };

// 트래커 상태 (Status - 트래커 연결 상태 7:1791 · 33:941 · 33:823 · 33:904)
export const TRACKER = { state: 'ok', battery: 82 };
