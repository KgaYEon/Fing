// 아래 약관 링크 두 개
export default function LegalLinks({ onOpen }) {
  const link = (doc, label) => (
    <a href={`#${doc}`} onClick={(e) => { e.preventDefault(); onOpen(doc); }}>{label}</a>
  );
  return (
    <nav className="login__legal" aria-label="약관">
      {link('privacy', '개인정보 처리 방침')}
      <span className="login__divider" aria-hidden="true" />
      {link('terms', '서비스 이용 약관')}
    </nav>
  );
}
