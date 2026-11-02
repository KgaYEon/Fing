// 리포트 비교 — 피그마 "리포트 - 여러 기록 비교" (335:2674)
// 주소: /report/compare?ids=예전기록,최근기록
import { Navigate, useSearchParams } from 'react-router-dom';
import BackHeader from '../../components/BackHeader.jsx';
import TabBar from '../../components/TabBar.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import { SESSIONS } from './report-data.js';
import { fromSession } from './compare/entities.js';
import GlanceCard from './compare/GlanceCard.jsx';
import ConditionCompare from './compare/ConditionCompare.jsx';
import DetailRows from './compare/DetailRows.jsx';
import './report.css';

export default function ReportCompare() {
  const [params] = useSearchParams();
  const ids = (params.get('ids') || '').split(',');
  const [sa, sb] = ids.map((id) => SESSIONS.find((s) => s.id === id));
  useThemeColor('#F5F8FB');
  if (!sa || !sb) return <Navigate to="/report/sessions" replace />;
  const a = fromSession(sa); const b = fromSession(sb);

  return (
    <div className="screen report">
      <BackHeader title="리포트 비교" fallback="/report/sessions" />
      <main className="report__main report__main--sub">
        <GlanceCard title="한눈에 비교하기" a={a} b={b} />
        <ConditionCompare a={a} b={b} />
        <DetailRows title="기록 상세 비교" a={a} b={b} />
      </main>
      <TabBar />
    </div>
  );
}
