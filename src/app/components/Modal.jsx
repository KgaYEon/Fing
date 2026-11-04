// 확인 모달 — 피그마 "modal" (화면 틀 안 가운데)
// <Modal open title="로그아웃 하시겠습니까?" sub="…" tone="danger"
//        cancel="닫기" confirm="로그아웃 하기" onCancel={…} onConfirm={…} />
// tone: 'primary'(기본) | 'danger' · children: 버튼 위에 넣을 내용 (입력칸 등)
// 바깥 누르기 · Esc → onDismiss (없으면 onCancel)
import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

export default function Modal({ open, title, sub, tone = 'primary', cancel = '취소', confirm = '확인', confirmDisabled, busy, onCancel, onConfirm, onDismiss, children }) {
  const dismiss = onDismiss || onCancel;
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement;
    const box = ref.current;
    (box.querySelector('input') || box.querySelector('.button:not([aria-disabled])'))?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); dismiss?.(); return; }
      if (e.key !== 'Tab') return;
      const f = [...box.querySelectorAll('button, input, textarea')];
      const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); before?.focus?.({ preventScroll: true }); };
  }, [open]);   // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;
  const danger = tone === 'danger';
  return (
    <div className="modal-layer" onClick={(e) => { if (e.target === e.currentTarget) dismiss?.(); }}>
      <div ref={ref} className="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby={sub ? 'modal-sub' : undefined}>
        <div className="modal__text">
          <p className="modal__title" id="modal-title">{title}</p>
          {sub && <p className="modal__sub" id="modal-sub">{sub}</p>}
        </div>
        {children}
        <div className="modal__actions">
          <Button className="button--sm" variant={danger ? 'danger-sec' : 'secondary'} onClick={onCancel}>{cancel}</Button>
          <Button className="button--sm" variant={danger ? 'danger' : undefined} disabled={confirmDisabled} busy={busy} onClick={onConfirm}>{confirm}</Button>
        </div>
      </div>
    </div>
  );
}
