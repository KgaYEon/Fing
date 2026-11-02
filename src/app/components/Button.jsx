// 버튼 — 피그마 "Button" (color = primary · secondary · unselected · danger · danger-sec)
// <Button>계속하기</Button>  <Button variant="secondary">이전으로</Button>
// disabled: 회색(unselected) 모양으로 바뀌고 눌리지 않아요
// busy: 빙글빙글 로딩 중 (연타 막기)
export default function Button({ variant, disabled, busy, className = '', type = 'button', onClick, children, ...rest }) {
  const v = disabled ? 'unselected' : variant;
  const cls = ['button', v && `button--${v}`, className].filter(Boolean).join(' ');
  const blocked = disabled || busy;
  return (
    <button
      type={type}
      className={cls}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      onClick={(e) => { if (blocked) { e.preventDefault(); return; } onClick?.(e); }}
      {...rest}
    >
      {children}
    </button>
  );
}
