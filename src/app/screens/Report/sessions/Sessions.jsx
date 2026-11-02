// 서핑별 — 필터 칩 · 월별 기록 카드 · 아래 버튼
// 카드를 누르면 선택, 다시 누르면 선택 취소 (최대 2개)
//   0개: 비교하기(누를 수 없음) · 1개: 기록 보기 → 그 기록 상세 · 2개: 비교하기 → 두 기록 비교
//   2개 고른 상태에서 다른 카드를 누르면 → 먼저 고른 것이 빠지고 새 카드가 들어가요
// 고른 기록은 다른 칩(달·즐겨찾기)으로 바꿔도, 상세를 보고 돌아와도 그대로 남아요. "선택 취소"로 한 번에 비워요.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChipTabs from '../../../components/ChipTabs.jsx';
import Button from '../../../components/Button.jsx';
import { toast } from '../../../../ui/ui.js';
import { SESSIONS, dateParts } from '../report-data.js';
import useFavorites from '../useFavorites.js';
import SessionCard from './SessionCard.jsx';

const MAX_PICK = 2;
const PICK_KEY = 'fing.report.picked';
const loadPicked = () => { try { const v = JSON.parse(sessionStorage.getItem(PICK_KEY)); return Array.isArray(v) ? v.filter((id) => SESSIONS.some((s) => s.id === id)).slice(0, MAX_PICK) : []; } catch { return []; } };
const monthOf = (s) => dateParts(s.date).m;

export default function Sessions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [picked, setPicked] = useState(loadPicked);
  useEffect(() => { try { sessionStorage.setItem(PICK_KEY, JSON.stringify(picked)); } catch {} }, [picked]);
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

  const select = (id) => {
    if (picked.includes(id)) { setPicked(picked.filter((x) => x !== id)); return; }       // 다시 누르면 취소
    if (picked.length >= MAX_PICK) { setPicked([...picked.slice(1), id]); toast('먼저 고른 기록 대신 새 기록을 골랐어요'); return; }
    setPicked([...picked, id]);
  };
  const clear = () => setPicked([]);

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
        {picked.length > 0 && (
          <div className="report__pick">
            <span className="report__pick-msg" role="status">{picked.length === 1 ? '하나 더 고르면 두 기록을 비교할 수 있어요' : '두 기록을 골랐어요'}</span>
            <button type="button" className="report__pick-clear" onClick={clear}>선택 취소</button>
          </div>
        )}
        <Button disabled={picked.length === 0} onClick={compare}>{picked.length === 1 ? '기록 보기' : '비교하기'}</Button>
      </div>
    </>
  );
}
