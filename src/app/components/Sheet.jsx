// 아래에서 올라오는 시트 — 피그마 "sheet"
// <Sheet open={open} onClose={() => setOpen(false)} title="…" sub="…">내용</Sheet>
// 닫기: 바깥 누르기 · 손잡이 누르기/아래로 끌기 · Esc
// 폰 틀 안에서 열려요 (컴퓨터에서 틀을 줄여 보여줘도 틀 밖으로 나가지 않게)
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

  const close = () => {
    if (closing) return;
    if (reduceMotion()) { onClose(); return; }
    setClosing(true);
  };

  useEffect(() => {
    const d = ref.current;
    const before = document.activeElement;
    if (!d.open) d.show();
    bodyRef.current.scrollTop = 0;
    (d.querySelector('input:checked, .sheet__body button, .sheet__body a, .sheet__handle') || d).focus({ preventScroll: true });
    return () => { if (d.open) d.close(); before?.focus?.({ preventScroll: true }); };
  }, []);

  // Esc로 닫기 · Tab이 시트 밖으로 나가지 않게
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = [...ref.current.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

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
    <div className={`sheet-layer${closing ? ' is-closing' : ''}`}>
      <div className="sheet-layer__backdrop" onClick={close} aria-hidden="true" />
      <dialog
        ref={ref}
        className={`sheet sheet--in-app${closing ? ' is-closing' : ''}`}
        aria-modal="true"
        aria-label={label || title || '시트'}
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
    </div>
  );
}
