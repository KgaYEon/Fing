// 마이 안쪽 화면 공통 틀 — 뒤로가기 헤더 + 스크롤 영역 (+ 아래 탭)
import BackHeader from '../../components/BackHeader.jsx';
import TabBar from '../../components/TabBar.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import './my.css';

export default function SubPage({ title, fallback = '/my', onBack, tabBar = true, footer, children, className = '' }) {
  useThemeColor('#F5F8FB');
  return (
    <div className={`screen my ${className}`.trim()}>
      <BackHeader title={title} fallback={fallback} onBack={onBack} />
      <main className="my__main my__main--sub">{children}</main>
      {footer && <div className="my__foot">{footer}</div>}
      {tabBar && <TabBar />}
    </div>
  );
}
