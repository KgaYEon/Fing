// 아이콘 — 피그마 ic/ 아이콘만 써요 (src/icons는 피그마에서 자동 생성)
// <Icon name="home" />  <Icon name="arr-right" size={20} label="다음" />
import { icons } from '../../icons/icons.js';
import { splitSvg } from './svg.js';

export default function Icon({ name, size = 24, label, className }) {
  const svg = splitSvg(icons[name]);
  if (!svg) { console.warn(`[Icon] "${name}" 아이콘이 없어요`); return null; }
  return (
    <svg
      viewBox={svg.viewBox}
      width={size}
      height={size}
      fill="none"
      className={className ? `icon ${className}` : 'icon'}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg.inner }}
    />
  );
}
