// 소셜 로그인 버튼 — 피그마 로그인 화면 login-box
import Icon from './Icon.jsx';

const SOCIAL = {
  google: { label: '구글로 시작하기', icon: 'google' },
  kakao: { label: '카카오로 시작하기', icon: 'kakao' },
  apple: { label: 'Apple로 시작하기', icon: 'apple' },
};

export default function SocialButton({ kind, busy, locked, onClick }) {
  const s = SOCIAL[kind];
  return (
    <button
      type="button"
      className={`social-button social-button--${kind}`}
      aria-busy={busy || undefined}
      aria-disabled={locked || undefined}
      onClick={() => { if (!busy && !locked) onClick(kind); }}
    >
      <Icon name={s.icon} />
      <span>{s.label}</span>
    </button>
  );
}
