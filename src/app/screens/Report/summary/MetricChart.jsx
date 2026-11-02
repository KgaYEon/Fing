// 최근 10회 기록 변화 그래프 — 피그마 "graph" + "Vector 1" + 끝점 말풍선
import { SESSIONS, METRICS, valueOf } from '../report-data.js';

const W = 362; const H = 144;           // 피그마 graph 362×144, 가로줄 5개(36px 간격)
const X0 = 31; const X1 = 326;           // 선이 시작·끝나는 가로 위치
const Y0 = 20; const Y1 = 124;           // 가장 높은 값 · 가장 낮은 값 위치

export default function MetricChart({ metric }) {
  const m = METRICS[metric];
  const recent = SESSIONS.slice(0, 10).reverse(); // 오래된 → 최근
  const vals = recent.map((s) => valueOf(s, metric));
  const min = Math.min(...vals); const max = Math.max(...vals);
  const pts = vals.map((v, i) => [X0 + ((X1 - X0) * i) / (vals.length - 1), max === min ? (Y0 + Y1) / 2 : Y1 - ((v - min) / (max - min)) * (Y1 - Y0)]);
  const [lx, ly] = pts[pts.length - 1];
  const last = vals[vals.length - 1];
  const below = ly < H / 2; // 끝점이 위쪽이면 말풍선은 아래로

  return (
    <section className="report-chart" aria-labelledby="chart-title">
      <div className="report__sec-head">
        <h2 className="report__sec-title" id="chart-title">{m.label} 변화</h2>
        <span className="report__sec-sub">최근 10회 기록</span>
      </div>
      <div className="report-chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`최근 10회 ${m.label}: ${vals.map((v) => v + m.unit).join(', ')}`}>
          {[0, 36, 72, 108, 144].map((y) => <line key={y} className="report-chart__grid" x1="0" x2={W} y1={y} y2={y} />)}
          <polyline key={metric} className="report-chart__line" points={pts.map((p) => p.join(',')).join(' ')} pathLength="1" />
          <circle className="report-chart__dot" cx={lx} cy={ly} r="7" />
          <circle className="report-chart__dot-in" cx={lx} cy={ly} r="4" />
        </svg>
        <span className={`report-chart__tip${below ? '' : ' is-above'}`} style={{ left: `${(lx / W) * 100}%`, top: `${(ly / H) * 100}%` }}>{last}{m.unit}</span>
      </div>
      <div className="report-chart__axis" aria-hidden="true"><span>-10회</span><span>-05회</span><span>최근기록</span></div>
    </section>
  );
}
