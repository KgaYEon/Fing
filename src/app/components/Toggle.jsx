// 스위치 — 피그마 "toggle"
export default function Toggle({ checked, onChange, label, id }) {
  return <input id={id} type="checkbox" className="toggle" role="switch" aria-label={label} checked={checked} onChange={(e) => onChange(e.target.checked)} />;
}
