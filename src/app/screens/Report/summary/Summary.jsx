// 종합 — 기록 변화 그래프 · 내 최고 기록 · 첫 기록 모음
import { useState } from 'react';
import ChipTabs from '../../../components/ChipTabs.jsx';
import { METRICS, METRIC_ORDER } from '../report-data.js';
import MetricChart from './MetricChart.jsx';
import BestGrid from './BestGrid.jsx';
import FirstRecords from './FirstRecords.jsx';

export default function Summary() {
  const [metric, setMetric] = useState('catch');
  return (
    <main className="report__main">
      <ChipTabs label="기록 종류" value={metric} onChange={setMetric} items={METRIC_ORDER.map((k) => ({ key: k, label: METRICS[k].label }))} />
      <MetricChart metric={metric} />
      <BestGrid />
      <FirstRecords />
    </main>
  );
}
