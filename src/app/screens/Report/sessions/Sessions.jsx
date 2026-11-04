// 서핑별 — 필터 칩 · 월별 기록 카드 · 아래 버튼
// 보통: 카드를 누르면 그 기록 상세 · 아래 "두 기록 비교하기"를 누르면 비교 모드
// 비교 모드: 위에 파란 안내 + 카드 왼쪽 동그라미 · 2개를 고르면 "이 두 기록 비교하기"가 눌려요
//   고른 카드를 다시 누르면 빠져요 · 2개 고른 뒤 다른 카드를 누르면 안내만 (몰래 바꾸지 않아요) · "취소"로 비교 모드 끝
// 비교 화면에 갔다 돌아와도 고른 상태가 남아요
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChipTabs from '../../../components/ChipTabs.jsx';
import Button from '../../../components/Button.jsx';
import { toast } from '../../../../ui/ui.js';
import { SESSIONS, dateParts } from '../report-data.js';
import useFavorites from '../useFavorites.js';
import SessionCard from './SessionCard.jsx';

const MAX_PICK = 2;
const KEY = 'fing.report.pick';
const load = () => { try { const v = JSON.parse(sessionStorage.getItem(KEY)); return v && v.mode === 'pick' ? { mode: 'pick', picked: (v.picked || []).filter((id) => SESSIONS.some((s) => s.id === id)).slice(0, MAX_PICK) } : { mode: 'view', picked: [] }; } catch { return { mode: 'view', picked: [] }; } };
const monthOf = (s) => dateParts(s.date).m;

export default function Sessions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [{ mode, picked }, setPick] = useState(load);
  const [favs, toggleFav] = useFavorites();
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify({ mode, picked })); } catch {} }, [mode, picked]);

  const months = [...new Set(SESSIONS.map(monthOf))];
  const chips = [{ key: 'all', label: '전체' }, { key: 'fav', label: '즐겨찾기' }, ...months.map((m) => ({ key: `m${m}`, label: `${String(m).padStart(2, '0')}월` }))];
  const shown = SESSIONS.filter((s) => filter === 'all' || (filter === 'fav' ? favs.has(s.id) : `m${monthOf(s)}` === filter));
  const groups = useMemo(() => {
    const g = new Map();
    for (const s of shown) { const m = monthOf(s); if (!g.has(m)) g.set(m, []); g.get(m).push(s); }
    return [...g];
  }, [shown]);

  const start = () => setPick({ mode: 'pick', picked: [] });
  const cancel = () => setPick({ mode: 'view', picked: [] });
  const select = (id) => {
    if (picked.includes(id)) { setPick({ mode, picked: picked.filter((x) => x !== id) }); return; }
    if (picked.length >= MAX_PICK) { toast('2개까지 고를 수 있어요. 고른 기록을 한 번 더 눌러 빼주세요', 2600); return; }
    setPick({ mode, picked: [...picked, id] });
  };
  const compare = () => {
    const ordered = [...picked].sort((a, b) => SESSIONS.findIndex((s) => s.id === b) - SESSIONS.findIndex((s) => s.id === a));   // 예전 → 최근
    navigate(`/report/compare?ids=${ordered.join(',')}`);
  };
  const ready = picked.length === MAX_PICK;

  return (
    <>
      <main className={`report__main report__main--sessions${mode === 'pick' ? ' is-picking' : ''}`}>
        <ChipTabs label="기록 고르기" size="lg" className="report__filters" value={filter} onChange={setFilter} items={chips} />
        {mode === 'pick' && (
          <div className="report__mode" role="status">
            <span><b>비교할 기록 2개</b>를 골라주세요</span>
            <span className="report__mode-count">{picked.length} / {MAX_PICK}</span>
          </div>
        )}
        {groups.length === 0 && <p className="report__empty">{filter === 'fav' ? '별을 눌러 즐겨찾기한 기록이 여기에 모여요' : '기록이 없어요'}</p>}
        {groups.map(([m, list]) => (
          <section key={m} className="report-month" aria-label={`${m}월 기록`}>
            <h2 className="report-month__title">{m}월 · 서핑 {SESSIONS.filter((s) => monthOf(s) === m).length}번</h2>
            {list.map((s) => (
              <SessionCard key={s.id} s={s} mode={mode} selected={picked.includes(s.id)} onOpen={(id) => navigate(`/report/session/${id}`)} onSelect={select} fav={favs.has(s.id)} onFav={toggleFav} />
            ))}
          </section>
        ))}
      </main>
      <div className="report__dock">
        {mode === 'view'
          ? <Button variant="secondary" onClick={start}>두 기록 비교하기</Button>
          : (
            <div className="report__dock-pair">
              <Button variant="secondary" onClick={cancel}>취소</Button>
              <Button disabled={!ready} onClick={compare}>{ready ? '이 두 기록 비교하기' : `${MAX_PICK - picked.length}개 더 골라주세요`}</Button>
            </div>
          )}
      </div>
    </>
  );
}
