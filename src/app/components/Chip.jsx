// 칩 — 피그마 "chip 1" (누르는 칩) · 배지 — "chip 2" (상태 표시)
import { forwardRef } from 'react';

export const Chip = forwardRef(function Chip({ className = '', children, ...rest }, ref) {
  return <button ref={ref} type="button" className={`chip ${className}`.trim()} {...rest}>{children}</button>;
});

export function Badge({ tone, className = '', children }) {
  return <span className={['badge', tone && `badge--${tone}`, className].filter(Boolean).join(' ')}>{children}</span>;
}
