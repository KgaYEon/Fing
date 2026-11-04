// 최근 기록 — 피그마 "Frame 8" (옆으로 넘겨보기, 가장 좋은 기록은 파란색)
import { useLayoutEffect, useRef } from 'react';
import { Chip } from '../../components/Chip.jsx';
import { METRICS, RECENT, UNIT } from './home-data.js';

export default function RecentRecords({ metric, onSet }) {
  const list = useRef(null);
  const max = Math.max(...RECENT.map((r) => r[metric]));
  // 최근 기록이 보이게 오른쪽 끝부터
  // 최근 기록이 보이게 오른쪽 끝부터 (카드 4개가 딱 맞게 들어가서 양 끝이 잘리지 않아요)
  useLayoutEffect(() => { list.current.scrollLeft = list.current.scrollWidth; }, [metric]);

  return (
    <section className="home__card" aria-labelledby="recent-title">
      <div className="home__card-head">
        <h2 className="home__card-title home__recent-title" id="recent-title">
          최근 기록<span className="home__bar" aria-hidden="true" /><span className="home__recent-k">{METRICS[metric].label}</span>
        </h2>
        <Chip className="home__chip hit-44" onClick={onSet}>설정</Chip>
      </div>
      <ul className="home__minis" ref={list} tabIndex={0} aria-label="최근 기록 (옆으로 넘겨보기)">
        {RECENT.map((r) => (
          <li key={r.date} className={`home__mini${r[metric] === max ? ' is-best' : ''}`}>
            <span className="home__mini-date">{r.date}</span>
            <span className="home__mini-value">{r[metric]}{UNIT[metric]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
