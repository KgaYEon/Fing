// 한눈에 비교하기 / 보기 — 피그마 "Frame 1171279249" + 칩별 카드 (359:2723 시간대별 · 359:2672 라이딩 시간)
import { useState } from 'react';
import ChipTabs from '../../../components/ChipTabs.jsx';
import BarPair from './BarPair.jsx';
import { SEG_LABELS, pct } from './entities.js';

const VIEWS = [
  { key: 'catch', label: '캐치율' },
  { key: 'time', label: '시간대별 캐치율' },
  { key: 'ride', label: '라이딩 시간' },
];

const change = (d, up, down, same) => (d > 0 ? up(d) : d < 0 ? down(-d) : same);

function CatchView({ a, b }) {
  const d = b.catch - a.catch;
  return (
    <>
      <p className="report-glance__head">{change(d, (n) => `캐치율이 ${n}%p 올랐어요`, (n) => `캐치율이 ${n}%p 내렸어요`, '캐치율이 같아요')}</p>
      <BarPair rows={[
        { label: a.name, note: ` (${a.paddle}개 중 ${a.caught}개)`, value: `${a.catch}%`, ratio: a.catch / 100 },
        { label: b.name, note: ` (${b.paddle}개 중 ${b.caught}개)`, value: `${b.catch}%`, ratio: b.catch / 100, strong: d > 0 },
      ]} />
    </>
  );
}

function TimeView({ a, b }) {
  const best = (e) => e.seg.map(([c, p]) => pct(c, p)).reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const ba = best(a); const bb = best(b);
  const head = ba === bb ? `두 기록 모두 ${SEG_LABELS[bb]}에 가장 잘 탔어요` : `${b.name}에는 ${SEG_LABELS[bb]}에 가장 잘 탔어요`;
  return (
    <>
      <p className="report-glance__head">{head}</p>
      {SEG_LABELS.map((label, i) => {
        const [ac, ap] = a.seg[i]; const [bc, bp] = b.seg[i];
        const av = pct(ac, ap); const bv = pct(bc, bp);
        return (
          <BarPair key={label} title={label} rows={[
            { label: a.name, note: ` (${ap}개 중 ${ac}개)`, value: `${av}%`, ratio: av / 100 },
            { label: b.name, note: ` (${bp}개 중 ${bc}개)`, value: `${bv}%`, ratio: bv / 100, strong: bv > av },
          ]} />
        );
      })}
    </>
  );
}

function RideView({ a, b }) {
  const d = b.avg - a.avg;
  const scale = Math.max(a.longest, b.longest) * 1.4;
  return (
    <>
      <p className="report-glance__head">{change(d, (n) => `라이딩 한 번이 ${n}초 늘었어요`, (n) => `라이딩 한 번이 ${n}초 줄었어요`, '라이딩 시간이 비슷해요')}</p>
      <BarPair title="평균 라이딩 시간" rows={[
        { label: a.name, value: `${a.avg}초`, ratio: a.avg / scale },
        { label: b.name, value: `${b.avg}초`, ratio: b.avg / scale, strong: b.avg > a.avg },
      ]} />
      <BarPair title="최장 라이딩 시간" rows={[
        { label: a.name, value: `${a.longest}초`, ratio: a.longest / scale },
        { label: b.name, value: `${b.longest}초`, ratio: b.longest / scale, strong: b.longest > a.longest },
      ]} />
    </>
  );
}

export default function GlanceCard({ title, a, b }) {
  const [view, setView] = useState('catch');
  const View = view === 'time' ? TimeView : view === 'ride' ? RideView : CatchView;
  return (
    <section className="report__sec" aria-labelledby="glance-title">
      <h2 className="report__sec-title" id="glance-title">{title}</h2>
      <ChipTabs label="비교 기준" className="report-glance__chips" value={view} onChange={setView} items={VIEWS} />
      <div className="report-glance" aria-live="polite"><View a={a} b={b} /></div>
    </section>
  );
}
