// Claude에게 같이 보내는 "사용자 정보" — 내 기록 · 오늘 파도 · 프로필을 글로 정리해요
import { SESSIONS, BEST, METRICS, perHour } from '../Report/report-data.js';
import { WAVE, GOALS } from '../Home/home-data.js';

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };

export function buildContext() {
  const my = read('fing.my.profile'); const onboard = read('fing.profile'); const home = read('fing.home');
  const name = my.nickname || onboard.nickname || '서퍼';
  const goalKey = home.goal || onboard.goal || 'catch';
  const g = GOALS[goalKey];
  const today = new Date();
  const lines = [
    `오늘: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${today.getHours()}시`,
    `닉네임: ${name}`,
    `목표: ${g.value}${g.unit} (${METRICS[goalKey].label} 기준)`,
    `오늘의 파도(${WAVE.spot}): 파고 ${WAVE.height}m, 적합도 ${WAVE.fit}/100, 바람 ${WAVE.wind}, 만조 ${WAVE.tide}, 한마디: ${WAVE.note}`,
    `내 최고 기록: ${Object.entries(BEST).map(([k, v]) => `${METRICS[k].label} ${v.value}(${v.date})`).join(', ')}`,
    '서핑 기록 (최근 → 예전):',
    ...SESSIONS.map((s) => `- ${s.date} ${s.spot} 파고 ${s.height}m · 라이딩 ${s.rides}회/${s.minutes}분 · 캐치율 ${s.catch}% · 평균 라이딩 ${s.avg}초 · 최장 ${s.longest}초 · 1시간 파도 ${perHour(s)}개`),
    '용어: 캐치율 = 패들한 파도 중 탄 파도의 비율, 라이딩 = 파도를 탄 횟수',
  ];
  return lines.join('\n');
}
