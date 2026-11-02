// 두 기록의 바다 컨디션 — 피그마 "wave" (닫힘 335:2674 · 펼침 345:2696)
import { useState } from 'react';
import Icon from '../../../components/Icon.jsx';

const ITEMS = [
  { key: 'height', label: '파고', fmt: (v) => `${v}m`, big: (a, b) => Math.abs(a - b) >= 0.4 },
  { key: 'period', label: '파주기', fmt: (v) => `${v}초`, big: (a, b) => Math.abs(a - b) >= 3 },
  { key: 'wind', label: '풍속', fmt: (v) => `${v}m/s`, big: (a, b) => Math.abs(a - b) >= 3 },
  { key: 'temp', label: '수온', fmt: (v) => `${v}℃`, big: (a, b) => Math.abs(a - b) >= 3 },
  { key: 'tide', label: '물때', fmt: (v) => v, big: () => false },
];

export default function ConditionCompare({ a, b }) {
  const [open, setOpen] = useState(false);
  const rows = ITEMS.map((it) => ({ ...it, isBig: it.big(a.cond[it.key], b.cond[it.key]) }));
  const differ = rows.some((r) => r.isBig);

  return (
    <section className={`report-cond${open ? ' is-open' : ''}`}>
      <div className="report-cond__head">
        <span className="report-cond__msg"><Icon name="info" size={16} />{differ ? '두 기록의 바다 컨디션이 많이 달라요' : '두 기록의 바다 컨디션이 비슷해요'}</span>
        <button type="button" className="report-cond__toggle" aria-expanded={open} aria-controls="cond-table" onClick={() => setOpen((o) => !o)}>
          컨디션 비교하기<Icon name={open ? 'arr-up' : 'arr-down'} size={16} />
        </button>
      </div>
      {open && (
        <div id="cond-table" className="report-cond__body">
          <table className="report-cond__table">
            <thead><tr><th scope="col">항목</th><th scope="col">{a.name}</th><th scope="col">{b.name}</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className={r.isBig ? 'is-big' : undefined}>
                  <th scope="row">{r.label}</th><td>{r.fmt(a.cond[r.key])}</td><td>{r.fmt(b.cond[r.key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="report-cond__foot">파란 숫자는 차이가 큰 항목이에요.</p>
        </div>
      )}
    </section>
  );
}
