// AI 답변 만들기 — 지금은 진짜 AI 대신, 내 기록(리포트 예시 데이터)과 오늘 파도로 정해진 답을 만들어요.
// 나중에 진짜 AI를 연결하면 answer() 안쪽만 바꾸면 돼요.
import { SESSIONS } from '../Report/report-data.js';
import { WAVE } from '../Home/home-data.js';

export const SUGGESTIONS = ['최근 5번 캐치율 평균은?', '오늘 죽도에서 언제 들어가면 좋아?', '내 패들이 짧다는 건 무슨 뜻이야?'];

const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

// 답변: { text, links: [{ label, to, primary }] }
export function answer(q) {
  const t = q.replace(/\s/g, '');
  const recent5 = SESSIONS.slice(0, 5);
  const first = SESSIONS[SESSIONS.length - 1];
  const latest = SESSIONS[0];
  const diff = latest.catch - first.catch;

  if (/분석|요약|어때|정리/.test(t)) {
    return {
      text: `최근 5번 평균 캐치율은 ${avg(recent5.map((s) => s.catch))}%예요. 첫 기록 ${first.catch}%에서 최근 ${latest.catch}%로 ${Math.abs(diff)}%p ${diff >= 0 ? '올라, 개선되고 있는 흐름이에요.' : '내려갔어요. 컨디션이 다른 날도 있었는지 같이 볼까요?'}`,
      links: [{ label: '서핑별 기록 보러가기', to: '/report/sessions' }, { label: '평균 리포트 보러가기', to: '/report', primary: true }],
    };
  }
  if (/캐치율|평균/.test(t)) {
    const v = recent5.map((s) => s.catch);
    return {
      text: `최근 5번 캐치율 평균은 ${avg(v)}%예요. 가장 높았던 날은 ${Math.max(...v)}%, 가장 낮았던 날은 ${Math.min(...v)}%였어요.`,
      links: [{ label: '캐치율 변화 보러가기', to: '/report', primary: true }],
    };
  }
  if (/언제|입수|들어가|시간/.test(t)) {
    return {
      text: `오늘 ${WAVE.spot.split(' ').pop()}는 파고 ${WAVE.height}m, 바람 ${WAVE.wind}이에요. 만조(${WAVE.tide}) 앞뒤 1~2시간이 파도가 가장 고르게 들어올 때라, 그 시간에 들어가 보는 걸 추천해요.`,
      links: [{ label: '오늘의 파도 보러가기', to: '/home', primary: true }],
    };
  }
  if (/패들/.test(t)) {
    return {
      text: '패들이 짧다는 건, 파도를 잡기 전에 노를 젓는(패들) 시간이 부족했다는 뜻이에요. 파도가 오기 조금 더 일찍, 2~3번 더 저어 보면 캐치율이 올라갈 수 있어요.',
      links: [{ label: '시간대별 캐치율 보러가기', to: `/report/session/${latest.id}` }],
    };
  }
  return {
    text: '아직 그 질문엔 답하기 어려워요. 내 서핑 기록이나 오늘의 파도에 대해 물어봐 주세요.',
    links: [],
    suggest: true,
  };
}
