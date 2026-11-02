// 기준 고르는 시트 — 피그마 sheet 412:2730(목표) · 19:523(기록)
import { useEffect, useState } from 'react';
import Sheet from '../../components/Sheet.jsx';
import OptionRow from '../../components/OptionRow.jsx';
import Button from '../../components/Button.jsx';
import { METRICS, METRIC_ORDER, LATEST } from './home-data.js';

export const SHEETS = {
  goal: { title: '기준 목표 설정', sub: '어떤 기준의 기록을 목표로 할까요?' },
  recent: { title: '기준 기록 설정', sub: '어떤 기준의 기록을 표시할까요?' },
};

export default function MetricSheet({ kind, current, onSave, onClose }) {
  const [pick, setPick] = useState(current);
  useEffect(() => setPick(current), [kind, current]);
  const info = SHEETS[kind];

  return (
    <Sheet open={!!kind} onClose={onClose} title={info?.title} sub={info?.sub}>
      {(close) => (
        <form className="home-sheet" onSubmit={(e) => { e.preventDefault(); onSave(kind, pick); close(); }}>
          <div className="home-sheet__list" role="radiogroup" aria-label={info?.title}>
            {METRIC_ORDER.map((k) => (
              <OptionRow key={k} name="metric" value={k} checked={pick === k} onChange={setPick}
                title={METRICS[k].label} desc={METRICS[k].desc} extra={`최근 기록 : ${LATEST[k]}`} />
            ))}
          </div>
          <div className="home-sheet__foot">
            <p className="home-sheet__hint">다시 바꾸기 전까지 이 설정이 유지돼요</p>
            <Button type="submit">설정 저장하기</Button>
          </div>
        </form>
      )}
    </Sheet>
  );
}
