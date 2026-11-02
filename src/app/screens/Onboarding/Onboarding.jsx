// 온보딩 — 단계마다 화면 컴포넌트가 하나씩 있어요 (steps/)
// 주소: /onboarding/welcome, /onboarding/nickname … (뒤로가기도 동작)
import { useEffect, useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import useThemeColor from '../../components/useThemeColor.js';
import { ORDER, nickState, DRAFT } from './flow.js';
import './onboarding.css';

const load = () => { try { return JSON.parse(sessionStorage.getItem(DRAFT)) || {}; } catch { return {}; } };

export default function Onboarding() {
  const [data, setData] = useState(load);
  const { pathname } = useLocation();
  const step = pathname.split('/')[2] || 'welcome';
  useThemeColor('#F5F8FB');

  useEffect(() => { try { sessionStorage.setItem(DRAFT, JSON.stringify(data)); } catch {} }, [data]);
  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  // 닉네임 없이 뒤 단계로 바로 들어오면 닉네임부터
  if (ORDER.indexOf(step) > ORDER.indexOf('nickname') && !nickState(data.nickname).ok) return <Navigate to="/onboarding/nickname" replace />;

  return (
    <main className="screen ob" aria-live="polite">
      <Outlet context={{ data, update }} />
    </main>
  );
}
