// 리포트 — 피그마 "리포트" 섹션
// /report          종합 (리포트 -종합 134:3502)
// /report/sessions 서핑별 (리포트 - 서핑별 142:4015 · 316:2588 · 151:4419)
import { useLocation } from 'react-router-dom';
import Segmented from '../../components/Segmented.jsx';
import TabBar from '../../components/TabBar.jsx';
import TabHeader from '../../components/TabHeader.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import Summary from './summary/Summary.jsx';
import Sessions from './sessions/Sessions.jsx';
import './report.css';

export default function Report() {
  const { pathname } = useLocation();
  const tab = pathname.startsWith('/report/sessions') ? 'sessions' : 'summary';
  useThemeColor('#F5F8FB');

  return (
    <div className="screen report">
      <TabHeader className="report__top">
        <div className="report__head"><h1 className="report__title">리포트</h1></div>
        <div className="report__tabs">
          <Segmented label="리포트 보기" items={[{ to: '/report', label: '종합', end: true }, { to: '/report/sessions', label: '서핑별' }]} />
        </div>
      </TabHeader>
      {tab === 'summary' ? <Summary /> : <Sessions />}
      <TabBar />
    </div>
  );
}
