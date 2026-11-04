// 탭 화면(홈·리포트·AI·마이) 맨 위 헤더 — 4개 모두 같은 모양
// 처음엔 바탕색과 이어지고, 아래 내용을 스크롤하면 그림자가 생겨 떠 보여요
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function TabHeader({ className = '', children }) {
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const screen = ref.current.parentElement;
    const check = () => { const main = screen.querySelector('main'); setScrolled(!!main && main.scrollTop > 0); };
    const onScroll = (e) => { if (e.target.tagName === 'MAIN') setScrolled(e.target.scrollTop > 0); };
    screen.addEventListener('scroll', onScroll, true);   // 스크롤은 위로 전달되지 않아서 '잡기(capture)'로 들어요
    check();
    return () => screen.removeEventListener('scroll', onScroll, true);
  }, [pathname]);

  return <header ref={ref} className={`tab-head${scrolled ? ' is-scrolled' : ''} ${className}`.trim()}>{children}</header>;
}
