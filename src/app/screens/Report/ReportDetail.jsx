// 기록 하나 상세보기 — 피그마 "리포트 - 한 기록 상세보기" (412:2794)
// 고른 기록을 나머지 기록의 평균과 비교해요. 주소: /report/session/기록id
import { Navigate, useParams } from 'react-router-dom';
import BackHeader from '../../components/BackHeader.jsx';
import TabBar from '../../components/TabBar.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import { SESSIONS, longDate } from './report-data.js';
import { fromSession, average } from './compare/entities.js';
import GlanceCard from './compare/GlanceCard.jsx';
import DetailRows from './compare/DetailRows.jsx';
import ConditionTable from './compare/ConditionTable.jsx';
import './report.css';

export default function ReportDetail() {
  const { id } = useParams();
  const s = SESSIONS.find((x) => x.id === id);
  useThemeColor('#F5F8FB');
  if (!s) return <Navigate to="/report/sessions" replace />;
  const b = fromSession(s); const a = average(s.id);

  return (
    <div className="screen report">
      <BackHeader title={longDate(s.date)} fallback="/report/sessions" />
      <main className="report__main report__main--sub">
        <GlanceCard title="한눈에 보기" a={a} b={b} />
        <DetailRows title="기록 상세 보기" a={a} b={b} labels={['평균 기록', '이번 기록']} />
        <ConditionTable cond={b.cond} />
      </main>
      <TabBar />
    </div>
  );
}
