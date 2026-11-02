// 로고 — 피그마 components "logo wrap"(심볼) · "full - logo"(글자 로고)
// <Logo />  <Logo white />  <Wordmark />
import { LOGO_SVG, WORDMARK_SVG } from '../../ui/ui.js';
import { splitSvg } from './svg.js';

const Svg = ({ src }) => {
  const s = splitSvg(src);
  return <svg viewBox={s.viewBox} fill="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: s.inner }} />;
};

export function Logo({ white = false, label = 'Fing', children, className = '' }) {
  return (
    <span className={`logo${white ? ' logo--white' : ''} ${className}`.trim()} role="img" aria-label={label}>
      <Svg src={LOGO_SVG} />
      {children}
    </span>
  );
}

export function Wordmark({ white = false }) {
  return (
    <span className={`wordmark${white ? ' logo--white' : ''}`} role="img" aria-label="FING">
      <Svg src={WORDMARK_SVG} />
    </span>
  );
}
