// 하나만 고르는 칩 줄 — 피그마 "chip 1" (color=primary, Push=True가 선택)
// <ChipTabs items={[{ key, label }]} value={key} onChange={setKey} label="기록 종류" />
export default function ChipTabs({ items, value, onChange, label, className = '', size }) {
  return (
    <div className={`chip-tabs ${className}`.trim()} role="radiogroup" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          role="radio"
          aria-checked={value === it.key}
          aria-pressed={value === it.key}
          className={`chip chip--primary${size === 'lg' ? ' chip--lg' : ''}`}
          onClick={() => onChange(it.key)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
