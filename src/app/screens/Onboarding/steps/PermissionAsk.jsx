// 권한 요청 창 — 폰이 띄우는 시스템 창처럼 (피그마 439:4029 · 439:4061 · 439:4073 · 439:4085)
// 화면 전체(위 상태바·아래 시스템 버튼까지)를 어둡게 덮고, 아래에서 올라와요.
// 창 바깥을 누르거나 Esc → "허용 안함"과 같아요 (안드로이드와 똑같이)
// 창이 바뀔 때는 어두운 배경은 그대로 두고 창만 내려갔다 올라와요 (last일 때만 배경까지 사라져요)
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/Icon.jsx';

export default function PermissionAsk({ ask, last, onAnswer }) {
  const [leaving, setLeaving] = useState(false);
  const box = useRef(null);
  const deny = ask.options[ask.options.length - 1];

  const answer = (option) => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onAnswer(option === deny ? 'denied' : option), 180);   // 닫히는 움직임이 끝난 뒤
  };

  useEffect(() => {
    setLeaving(false);
    box.current?.querySelector('button')?.focus({ preventScroll: true });
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); answer(deny); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ask]);   // eslint-disable-line react-hooks/exhaustive-deps

  const host = document.querySelector('.app') || document.body;
  return createPortal(
    <div className={`perm-ask-layer${leaving && last ? ' is-leaving' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) answer(deny); }}>
      <div ref={box} key={ask.key} className={`perm-ask${leaving ? ' is-leaving' : ''}`} role="alertdialog" aria-modal="true" aria-labelledby="perm-ask-title">
        <div className="perm-ask__head">
          <Icon name={ask.icon} size={37} />
          <p className="perm-ask__title" id="perm-ask-title">
            <b>Fing</b>에서 {ask.lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
          </p>
        </div>
        <div className="perm-ask__menus">
          {ask.options.map((o) => <button key={o} type="button" className="perm-ask__menu" onClick={() => answer(o)}>{o}</button>)}
        </div>
      </div>
    </div>,
    host,
  );
}
