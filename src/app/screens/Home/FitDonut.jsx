// 적합도 도넛 — 위에서부터 시계방향으로 채워져요 (피그마 "rate")
export default function FitDonut({ value }) {
  return (
    <div className="home__fit" role="img" aria-label={`적합도 100점 중 ${value}점`} style={{ '--fit': value / 100 }}>
      <svg viewBox="0 0 92 92" aria-hidden="true">
        <circle className="home__fit-track" cx="46" cy="46" r="41.5" />
        <circle className="home__fit-bar" cx="46" cy="46" r="41.5" pathLength="100" />
      </svg>
      <span className="home__fit-text" aria-hidden="true"><b className="home__fit-num">{value}</b><span>적합도</span></span>
    </div>
  );
}
