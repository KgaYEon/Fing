// 서핑별 — 필터 칩 · 월별 기록 카드 · 비교하기
// 카드 1개 고르면 → 그 기록 상세 (평균과 비교), 2개 고르면 → 두 기록 비교
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChipTabs from '../../../components/ChipTabs.jsx';
import Button from '../../../components/Button.jsx';
import { toast } from '../../../../ui/ui.js';
import { SESSIONS, dateParts } from '../report-data.js';
import useFavorites from '../useFavorites.js';
import SessionCard from './SessionCard.jsx';

const MAX_PICK = 2;
const monthOf = (s) => dateParts(s.date).m;

export default function Sessions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [picked, setPicked] = useState([]);
  const [favs, toggleFav] = useFavorites();

  // 칩: 전체 · 즐겨찾기 · 기록이 있는 달
  const months = [...new Set(SESSIONS.map(monthOf))];
  const chips = [{ key: 'all', label: '전체' }, { key: 'fav', label: '즐겨찾기' }, ...months.map((m) => ({ key: `m${m}`, label: `${String(m).padStart(2, '0')}월` }))];

  const shown = SESSIONS.filter((s) => filter === 'all' || (filter === 'fav' ? favs.has(s.id) : `m${monthOf(s)}` === filter));
  const groups = useMemo(() => {
    const g = new Map();
    for (const s of shown) { const m = monthOf(s); if (!g.has(m)) g.set(m, []); g.get(m).push(s); }
    return [...g];
  }, [shown]);

  const select = (id) => setPicked((p) => {
    if (p.includes(id)) return p.filter((x) => x !== id);
    if (p.length >= MAX_PICK) { toast(`기록은 ${MAX_PICK}개까지 고를 수 있어요`); return p; }
    return [...p, id];
  });

  const compare = () => {
    if (picked.length === 1) navigate(`/report/session/${picked[0]}`);
    else navigate(`/report/compare?ids=${[...picked].sort((a, b) => SESSIONS.findIndex((s) => s.id === b) - SESSIONS.findIndex((s) => s.id === a)).join(',')}`);
  };

  return (
    <>
      <main className="report__main report__main--sessions">
        <ChipTabs label="기록 고르기" size="lg" className="report__filters" value={filter} onChange={setFilter} items={chips} />
        {groups.length === 0 && <p className="report__empty">{filter === 'fav' ? '별을 눌러 즐겨찾기한 기록이 여기에 모여요' : '기록이 없어요'}</p>}
        {groups.map(([m, list]) => (
          <section key={m} className="report-month" aria-label={`${m}월 기록`}>
            <h2 className="report-month__title">{m}월 · 서핑 {SESSIONS.filter((s) => monthOf(s) === m).length}번</h2>
            {list.map((s) => (
              <SessionCard key={s.id} s={s} selected={picked.includes(s.id)} onSelect={select} fav={favs.has(s.id)} onFav={toggleFav} />
            ))}
          </section>
        ))}
      </main>
      <div className="report__dock">
        <Button disabled={picked.length === 0} onClick={compare}>비교하기</Button>
      </div>
    </>
  );
}
