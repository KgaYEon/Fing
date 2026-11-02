// 아래 시스템 버튼 — 피그마 "btm stat" (22:330) 그림 그대로 (최근 앱 · 홈 · 뒤로)
// 폰에서는 진짜 버튼이 있어서 숨기고, 컴퓨터의 폰 틀 안에서만 보여요.
export default function SystemNav() {
  return (
    <div className="system-nav" aria-hidden="true">
      <svg viewBox="0 0 402 52" fill="none">
        <path d="M78 18V34" stroke="#848F9E" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 18V34" stroke="#848F9E" strokeWidth="2" strokeLinecap="round" />
        <path d="M94 18V34" stroke="#848F9E" strokeWidth="2" strokeLinecap="round" />
        <rect x="193.9" y="17.9" width="16.2" height="16.2" rx="7.1" stroke="#848F9E" strokeWidth="1.8" />
        <path d="M317.472 16.9842L307.972 25.9842L317.472 34.1213" stroke="#848F9E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}
