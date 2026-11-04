// 최근 기록 — 피그마 "Frame 8" (옆으로 넘겨보기, 가장 좋은 기록은 파란색)
// 처음엔 가장 최근 기록이 보이게 오른쪽 끝부터. 왼쪽에 더 있으면 끝을 흐리게 + "이전 기록" 버튼
import { useLayoutEffect, useRef, useState } from 'react';
import { Chip } from '../../components/Chip.jsx';
import Icon from '../../components/Icon.jsx';
import { METRICS, RECENT, UNIT } from './home-data.js';

export default function RecentRecords({ metric, onSet }) {
  const list = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });
  const max = Math.max(...RECENT.map((r) => r[metric]));

  const measure = () => {
    const el = list.current; if (!el) return;
    setEdge({ left: el.scrollLeft > 4, right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
  };
  useLayoutEffect(() => { list.current.scrollLeft = list.current.scrollWidth; measure(); }, [metric]);
  const older = () => list.current.scrollBy({ left: -list.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="home__card" aria-labelledby="recent-title">
      <div className="home__card-head">
        <h2 className="home__card-title home__recent-title" id="recent-title">
          최근 기록<span className="home__bar" aria-hidden="true" /><span className="home__recent-k">{METRICS[metric].label}</span>
        </h2>
        <Chip className="home__chip hit-44" onClick={onSet}>설정</Chip>
      </div>
      <ul className={`home__minis${edge.left ? ' can-left' : ''}${edge.right ? ' can-right' : ''}`} ref={list} onScroll={measure} tabIndex={0} aria-label="최근 기록 (옆으로 넘겨보기)">
        {RECENT.map((r) => (
          <li key={r.date} className={`home__mini${r[metric] === max ? ' is-best' : ''}`}>
            <span className="home__mini-date">{r.date}</span>
            <span className="home__mini-value">{r[metric]}{UNIT[metric]}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="home__more" hidden={!edge.left} onClick={older}><Icon name="arr-left" size={16} />이전 기록</button>
    </section>
  );
}
