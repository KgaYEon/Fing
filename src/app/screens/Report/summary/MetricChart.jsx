// 최근 10회 기록 변화 그래프 — 피그마 "graph" + "Vector 1" + 끝점 말풍선
// 가장 높은 값 · 가장 낮은 값을 점 옆에 적고, 아래는 날짜로 보여줘요
import { SESSIONS, METRICS, valueOf, dateParts } from '../report-data.js';

const W = 362; const H = 144;           // 피그마 graph 362×144, 가로줄 5개(36px 간격)
const X0 = 31; const X1 = 326;           // 선이 시작·끝나는 가로 위치
const Y0 = 24; const Y1 = 120;           // 가장 높은 값 · 가장 낮은 값 위치 (글자 들어갈 자리 남기기)
const md = (iso) => { const p = dateParts(iso); return `${p.m}/${p.d}`; };

export default function MetricChart({ metric }) {
  const m = METRICS[metric];
  const recent = SESSIONS.slice(0, 10).reverse(); // 오래된 → 최근
  const vals = recent.map((s) => valueOf(s, metric));
  const min = Math.min(...vals); const max = Math.max(...vals);
  const pts = vals.map((v, i) => [X0 + ((X1 - X0) * i) / (vals.length - 1), max === min ? (Y0 + Y1) / 2 : Y1 - ((v - min) / (max - min)) * (Y1 - Y0)]);
  const last = vals.length - 1;
  const [lx, ly] = pts[last];
  const below = ly < H / 2; // 끝점이 위쪽이면 말풍선은 아래로
  // 높은 값 · 낮은 값 (끝점과 같으면 말풍선이 대신 보여줘요)
  const iMax = vals.lastIndexOf(max); const iMin = vals.indexOf(min);
  const marks = [
    iMax !== last && { i: iMax, kind: 'max', label: `최고 ${max}${m.unit}` },
    iMin !== last && max !== min && { i: iMin, kind: 'min', label: `최저 ${min}${m.unit}` },
  ].filter(Boolean);
  const pct = (x, y) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

  return (
    <section className="report-chart" aria-labelledby="chart-title">
      <div className="report__sec-head">
        <h2 className="report__sec-title" id="chart-title">{m.label} 변화</h2>
        <span className="report__sec-sub">최근 10회 기록</span>
      </div>
      <div className="report-chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`최근 10회 ${m.label}: ${recent.map((s, i) => `${md(s.date)} ${vals[i]}${m.unit}`).join(', ')}`}>
          {[0, 36, 72, 108, 144].map((y) => <line key={y} className="report-chart__grid" x1="0" x2={W} y1={y} y2={y} />)}
          <polyline key={metric} className="report-chart__line" points={pts.map((p) => p.join(',')).join(' ')} pathLength="1" />
          {marks.map((mk) => <circle key={mk.kind} className="report-chart__mark" cx={pts[mk.i][0]} cy={pts[mk.i][1]} r="4" />)}
          <circle className="report-chart__dot" cx={lx} cy={ly} r="7" />
          <circle className="report-chart__dot-in" cx={lx} cy={ly} r="4" />
        </svg>
        {marks.map((mk) => <span key={mk.kind} className={`report-chart__label is-${mk.kind}`} style={pct(...pts[mk.i])} aria-hidden="true">{mk.label}</span>)}
        <span className={`report-chart__tip${below ? '' : ' is-above'}`} style={pct(lx, ly)}>{vals[last]}{m.unit}</span>
      </div>
      <div className="report-chart__axis" aria-hidden="true">
        <span>{md(recent[0].date)}</span><span>{md(recent[Math.floor(last / 2)].date)}</span><span>{md(recent[last].date)} 최근</span>
      </div>
    </section>
  );
}
