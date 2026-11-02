// 내 최고 기록 — 피그마 "record cards" (card 2×2)
import { METRICS, METRIC_ORDER, BEST } from '../report-data.js';

export default function BestGrid() {
  return (
    <section className="report__sec" aria-labelledby="best-title">
      <h2 className="report__sec-title" id="best-title">내 최고 기록</h2>
      <div className="report-best">
        {METRIC_ORDER.map((k) => (
          <div key={k} className="stat-card">
            <span className="stat-card__label">{METRICS[k].best}</span>
            <div className="stat-card__body">
              <span className="stat-card__value">{BEST[k].value}</span>
              <span className="stat-card__date">{BEST[k].date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
