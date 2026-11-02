// 스플래시 — 피그마 onboarding / splash (180:1596)
// 로고 애니메이션 뒤 1.8초 후 로그인으로 넘어가요.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import { ROUTES } from '../../routes.js';
import './splash.css';

const DURATION = 1800; // ms

export default function Splash() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  useThemeColor('#1769FF');

  useEffect(() => {
    const t = setTimeout(() => {
      // 움직임 줄이기 설정이면 애니메이션 없이 바로 이동
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) navigate(ROUTES.login.path, { replace: true });
      else setLeaving(true);
    }, DURATION);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main
      className={`screen splash${leaving ? ' is-leaving' : ''}`}
      aria-label="Fing 시작 화면"
      onAnimationEnd={(e) => { if (leaving && e.target === e.currentTarget) navigate(ROUTES.login.path, { replace: true }); }}
    >
      <Logo white>
        <span className="splash__ripple" aria-hidden="true" />
      </Logo>
    </main>
  );
}
