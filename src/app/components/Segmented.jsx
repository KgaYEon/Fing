// 둘 중 하나 고르는 탭 — 피그마 "Tab List - 설정 항목"
// 주소로 바뀌는 탭: <Segmented label="리포트 보기" items={[{ to: '/report', label: '종합', end: true }, …]} />
import { NavLink } from 'react-router-dom';

export default function Segmented({ items, label, className = '' }) {
  return (
    <nav className={`segmented ${className}`.trim()} aria-label={label}>
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.end} replace className="segmented__tab">{it.label}</NavLink>
      ))}
    </nav>
  );
}
