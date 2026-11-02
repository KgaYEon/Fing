// 선택 카드 — 피그마 "cont" (목록에서 하나 고르기)
export default function Choice({ name, value, checked, onChange, title, sub, badge }) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span className="choice__text"><span className="choice__title">{title}</span><span className="choice__sub">{sub}</span></span>
      {badge && <span className="badge">{badge}</span>}
    </label>
  );
}
