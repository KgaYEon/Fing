// 아이콘 상자 — 피그마 "icon box"
import Icon from './Icon.jsx';

export default function IconBox({ name, size = 24, className = '' }) {
  return <span className={`icon-box ${className}`.trim()}><Icon name={name} size={size} /></span>;
}
