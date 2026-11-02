// 시트 안 선택 줄 — 피그마 "sheet box"
export default function OptionRow({ name, value, checked, onChange, title, desc, extra }) {
  return (
    <label className="option-row">
      <span className="option-row__text"><span className="option-row__title">{title}</span><span className="option-row__desc">{desc}</span></span>
      {extra && <span className="option-row__value">{extra}</span>}
      <input type="radio" className="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
    </label>
  );
}
