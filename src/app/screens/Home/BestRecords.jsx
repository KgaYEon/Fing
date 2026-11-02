// 이전 최대 기록 — 피그마 "Frame 7"
import { METRICS, BEST, BEST_ORDER } from './home-data.js';

export default function BestRecords() {
  return (
    <section className="home__card" aria-labelledby="best-title">
      <div className="home__card-head"><h2 className="home__card-title" id="best-title">이전 최대 기록</h2></div>
      <ul className="home__rows">
        {BEST_ORDER.map((k) => (
          <li key={k} className="home__row">
            <span className="home__row-label">
              <span className="home__row-name">{METRICS[k].label}</span>
              <span className="home__bar" aria-hidden="true" />
              <span className="home__row-date">{BEST[k].date}</span>
            </span>
            <span className="home__row-value">{BEST[k].value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
