// 위 고정 영역 — 피그마 "헤드고정": 로고 + 트래커 칩 (누르면 상태 카드)
import { useEffect, useRef, useState } from 'react';
import { Logo } from '../../components/Logo.jsx';
import { Chip } from '../../components/Chip.jsx';
import Icon from '../../components/Icon.jsx';
import TrackerPopover from './TrackerPopover.jsx';

export default function HomeHeader({ tracker }) {
  const [open, setOpen] = useState(false);
  const chip = useRef(null);
  const pop = useRef(null);

  // 바깥 누르기 · Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!pop.current?.contains(e.target) && !chip.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); chip.current.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <header className="home__head">
      <h1 className="home__logo"><Logo label="Fing 홈" /></h1>
      <Chip
        ref={chip}
        className="home__tracker"
        data-state={tracker.state}
        aria-expanded={open}
        aria-controls="tracker-pop"
        onClick={() => setOpen((o) => !o)}
      >
        트래커<Icon name="on" className="home__dot" />
      </Chip>
      {open && <TrackerPopover id="tracker-pop" popRef={pop} {...tracker} />}
    </header>
  );
}
