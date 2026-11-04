// 트래커 칩 — 누르면 아래에 연결 상태 카드 (홈 · AI 헤더)
// <TrackerChip label="트래커" />  · 바깥 누르기 / Esc로 닫혀요
// 확인용: 주소 뒤에 ?tracker=low / off / error 를 붙이면 상태가 바뀌어요
import { useEffect, useRef, useState } from 'react';
import { Chip } from './Chip.jsx';
import Icon from './Icon.jsx';
import TrackerPopover from './TrackerPopover.jsx';

const TRACKER = { state: 'ok', battery: 82 };   // 예시 (피그마 7:1791)

export function useTracker() {
  const state = new URLSearchParams(location.search).get('tracker') || TRACKER.state;
  return { state, battery: state === 'low' ? 12 : TRACKER.battery };
}

export default function TrackerChip({ label = '트래커' }) {
  const tracker = useTracker();
  const [open, setOpen] = useState(false);
  const chip = useRef(null);
  const pop = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!pop.current?.contains(e.target) && !chip.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); chip.current.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <Chip ref={chip} className="home__tracker" data-state={tracker.state} aria-expanded={open} aria-controls="tracker-pop" onClick={() => setOpen((o) => !o)}>
        {label}<Icon name="on" className="home__dot" />
      </Chip>
      {open && <TrackerPopover id="tracker-pop" popRef={pop} {...tracker} />}
    </>
  );
}
