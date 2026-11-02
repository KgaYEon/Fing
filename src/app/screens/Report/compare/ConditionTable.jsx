// 바다 컨디션 (기록 하나) — 피그마 412:2794 "바다 컨디션" (항목 · 수치 · 상태)
import Icon from '../../../components/Icon.jsx';
import { toast } from '../../../../ui/ui.js';

const TIDE_HELP = { 사리: '사리: 물이 많이 들고 나는 때라 물살이 세요', 조금: '조금: 물이 적게 들고 나는 때라 물살이 약해요' };

// 상태 판단 (예시 기준)
const rate = {
  height: (v) => (v >= 0.6 && v <= 1.5 ? '좋음' : '보통'),
  period: (v) => (v >= 9 ? '좋음' : '보통'),
  wind: (v) => (v <= 3 ? '좋음' : v <= 6 ? '보통' : '주의'),
  temp: (v) => (v >= 21 ? '좋음' : '보통'),
  tide: (v) => (v === '사리' ? '주의' : '보통'),
};
const TONE = { 좋음: 'good', 보통: '', 주의: 'warn' };

export default function ConditionTable({ cond }) {
  const rows = [
    { key: 'height', label: '파고', value: `${cond.height}m` },
    { key: 'period', label: '파주기', value: `${cond.period}초` },
    { key: 'wind', label: '풍속', value: `${cond.wind}m/s` },
    { key: 'temp', label: '수온', value: `${cond.temp}℃` },
    { key: 'tide', label: '물때', value: cond.tide, help: TIDE_HELP[cond.tide] },
  ];
  return (
    <section className="report__sec" aria-labelledby="cond-title">
      <h2 className="report__sec-title" id="cond-title">바다 컨디션</h2>
      <table className="report-condt">
        <thead><tr><th scope="col">항목</th><th scope="col">수치</th><th scope="col">상태</th></tr></thead>
        <tbody>
          {rows.map((r) => {
            const st = rate[r.key](cond[r.key]);
            return (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                <td>
                  {r.value}
                  {r.help && <button type="button" className="report-condt__help" aria-label={`${r.value} 설명`} onClick={() => toast(r.help, 3000)}><Icon name="info" size={12} /></button>}
                </td>
                <td className={TONE[st] ? `is-${TONE[st]}` : undefined}>{st}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
