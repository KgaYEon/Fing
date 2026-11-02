// 아래에서 올라오는 시트 — 피그마 "sheet"
// <Sheet open={open} onClose={() => setOpen(false)} title="…" sub="…">내용</Sheet>
// 닫기: 바깥 누르기 · 손잡이 누르기/아래로 끌기 · Esc
import { useEffect, useRef, useState } from 'react';

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Sheet({ open, onClose, title, sub, label, children }) {
  if (!open) return null;
  return <SheetInner onClose={onClose} title={title} sub={sub} label={label}>{children}</SheetInner>;
}

function SheetInner({ onClose, title, sub, label, children }) {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const drag = useRef({ startY: null, moved: false });

  useEffect(() => {
    const d = ref.current;
    if (!d.open) d.showModal();
    bodyRef.current.scrollTop = 0;
    return () => { if (d.open) d.close(); };
  }, []);

  const close = () => {
    if (closing) return;
    if (reduceMotion()) { onClose(); return; }
    setClosing(true);
  };

  const onPointerDown = (e) => { drag.current = { startY: e.clientY, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); ref.current.style.transition = 'none'; };
  const onPointerMove = (e) => {
    const { startY } = drag.current;
    if (startY == null) return;
    const dy = Math.max(0, e.clientY - startY);
    if (dy > 4) drag.current.moved = true;
    ref.current.style.transform = `translateY(${dy}px)`;
  };
  const onPointerUp = (e) => {
    const { startY } = drag.current;
    if (startY == null) return;
    const dy = e.clientY - startY;
    drag.current.startY = null;
    ref.current.style.transition = '';
    ref.current.style.transform = '';
    if (dy > 80) close();
  };

  return (
    <dialog
      ref={ref}
      className={`sheet${closing ? ' is-closing' : ''}`}
      aria-label={label || title || '시트'}
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === ref.current) close(); }}
      onAnimationEnd={(e) => { if (closing && e.target === ref.current) onClose(); }}
    >
      <button
        className="sheet__handle"
        type="button"
        aria-label="닫기"
        onClick={() => { if (drag.current.moved) { drag.current.moved = false; return; } close(); }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      {title && (
        <header className="sheet__head">
          <h2 className="sheet__title">{title}</h2>
          {sub && <p className="sheet__sub">{sub}</p>}
        </header>
      )}
      <div className="sheet__body" ref={bodyRef}>{typeof children === 'function' ? children(close) : children}</div>
    </dialog>
  );
}
