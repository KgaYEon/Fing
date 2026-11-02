// 비교에 쓰는 값 만들기 — 기록 하나, 또는 여러 기록의 평균
import { SESSIONS, shortDate, perHour } from '../report-data.js';

export const SEG_LABELS = ['초반', '중반', '후반'];

export function fromSession(s) {
  return {
    name: shortDate(s.date), catch: s.catch, paddle: s.paddle, caught: s.caught, avg: s.avg, longest: s.longest,
    count: perHour(s), rides: s.rides, seg: s.seg, cond: { height: s.height, ...s.cond },
  };
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const r = (n) => Math.round(n);

/** 고른 기록을 뺀 나머지의 평균 */
export function average(exceptId) {
  const list = SESSIONS.filter((s) => s.id !== exceptId);
  return {
    name: '평균 기록',
    catch: r(avg(list.map((s) => s.catch))),
    paddle: r(avg(list.map((s) => s.paddle))),
    caught: r(avg(list.map((s) => s.caught))),
    avg: r(avg(list.map((s) => s.avg))),
    longest: r(avg(list.map((s) => s.longest))),
    count: r(avg(list.map(perHour))),
    rides: r(avg(list.map((s) => s.rides))),
    seg: [0, 1, 2].map((i) => [r(avg(list.map((s) => s.seg[i][0]))), r(avg(list.map((s) => s.seg[i][1])))]),
  };
}

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
