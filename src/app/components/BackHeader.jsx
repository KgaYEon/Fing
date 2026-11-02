// 뒤로가기 + 가운데 제목 — 피그마 "이용약관 헤더" (리포트 비교 등)
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function BackHeader({ title, fallback = '/' }) {
  const navigate = useNavigate();
  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate(fallback, { replace: true }));
  return (
    <header className="back-header">
      <button type="button" className="back-header__btn" onClick={back} aria-label="뒤로가기"><Icon name="arr-left" size={36} /></button>
      <h1 className="back-header__title">{title}</h1>
    </header>
  );
}
