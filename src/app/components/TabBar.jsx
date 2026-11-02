// 하단 탭 — 피그마 "btm nav" + "nav-menu"
// 준비 안 된 화면 탭은 누르면 "준비 중" 안내만 떠요
import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';
import { TABS, toast } from '../../ui/ui.js';
import { ROUTES } from '../routes.js';

export default function TabBar() {
  return (
    <nav className="tab-bar" aria-label="주요 메뉴">
      {TABS.map((t) => {
        const route = ROUTES[t.key];
        return (
          <NavLink
            key={t.key}
            to={route.path}
            className="tab-bar__item"
            onClick={(e) => { if (!route.ready) { e.preventDefault(); toast(`${t.label} 화면은 아직 준비 중이에요`); } }}
          >
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
