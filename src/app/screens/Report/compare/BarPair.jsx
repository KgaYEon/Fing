// 막대 두 개 (예전 · 최근) — 피그마 "bars"
export function Bar({ label, note, value, ratio, tone, strong }) {
  return (
    <div className="report-bar">
      <div className="report-bar__head">
        <span className="report-bar__label">{label}</span>
        <span className={`report-bar__value${strong ? ' is-strong' : ''}`}>{note && <span className="report-bar__note">{note}</span>}{value}</span>
      </div>
      <span className="report-bar__track"><span className={`report-bar__fill report-bar__fill--${tone}`} style={{ '--w': Math.max(0, Math.min(1, ratio)) }} /></span>
    </div>
  );
}

export default function BarPair({ title, rows }) {
  return (
    <div className="report-bars">
      {title && <h4 className="report-bars__title">{title}</h4>}
      {rows.map((r, i) => <Bar key={i} {...r} tone={i === 0 ? 'old' : 'new'} />)}
    </div>
  );
}
