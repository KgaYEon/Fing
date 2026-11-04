// 마이 화면 목록 — 피그마 "menu" / "menu cont"
// <MenuGroup title="알림"> <MenuRow … /> </MenuGroup>
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Toggle from './Toggle.jsx';

export function MenuGroup({ title, label, children }) {
  return (
    <section className="menu-group" aria-label={title ? undefined : label}>
      {title && <h2 className="menu-group__title">{title}</h2>}
      <ul className="menu-list">{children}</ul>
    </section>
  );
}

/**
 * 한 줄
 * - to: 들어가는 줄 (오른쪽 화살표)        - onClick: 누르는 줄
 * - toggle: { checked, onChange }        - right: 오른쪽에 넣을 것 (배지 등)
 * - tone: 'soft'(회색 제목) | 'danger'(빨간 제목)
 */
export function MenuRow({ title, desc, descLg, to, onClick, toggle, right, tone, arrow }) {
  const id = toggle ? `t-${title.replace(/\s/g, '')}` : undefined;
  const text = (
    <span className="menu-row__text">
      {toggle ? <label htmlFor={id} className={titleCls(tone)}>{title}</label> : <span className={titleCls(tone)}>{title}</span>}
      {desc && <span className={`menu-row__desc${descLg ? ' menu-row__desc--lg' : ''}`}>{desc}</span>}
    </span>
  );
  const showArrow = arrow ?? !!to;
  if (to) return <li><Link to={to} className="menu-row menu-row--btn">{text}{right}{showArrow && <Icon name="arr-right" />}</Link></li>;
  if (onClick) return <li><button type="button" className="menu-row menu-row--btn" onClick={onClick}>{text}{right}{showArrow && <Icon name="arr-right" />}</button></li>;
  return <li className="menu-row">{text}{right}{toggle && <Toggle id={id} checked={toggle.checked} onChange={toggle.onChange} label={title} />}</li>;
}

const titleCls = (tone) => `menu-row__title${tone ? ` menu-row__title--${tone}` : ''}`;
