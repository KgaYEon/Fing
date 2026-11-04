// 서핑 기록 카드 — 피그마 "cont/card" (= 디자인시스템 Record card)
// 보통: 카드를 누르면 그 기록 상세로 · 별은 즐겨찾기
// 비교 모드: 카드를 누르면 고르기(왼쪽 동그라미에 체크) · 별은 숨겨요
import Icon from '../../../components/Icon.jsx';
import { longDate, NEW_ID } from '../report-data.js';

export default function SessionCard({ s, mode, selected, onOpen, onSelect, fav, onFav }) {
  const title = longDate(s.date);
  const picking = mode === 'pick';
  return (
    <article className={`record-card report-card${picking ? ' is-picking' : ''}${selected ? ' is-selected' : ''}`}>
      {picking
        ? <button type="button" className="report-card__pick" role="checkbox" aria-checked={selected} aria-label={`${title} 기록 고르기`} onClick={() => onSelect(s.id)} />
        : <button type="button" className="report-card__pick" aria-label={`${title} 기록 보기`} onClick={() => onOpen(s.id)} />}
      <div className="record-card__head">
        <div className="record-card__title">
          <span className="record-card__date">
            {picking && <span className="report-card__check" aria-hidden="true">{selected && <Icon name="check" size={14} />}</span>}
            {title}{s.id === NEW_ID && <span className="badge badge--sm">NEW</span>}
          </span>
          <span className="record-card__meta">{s.spot} / {s.height}m</span>
        </div>
        {!picking && (
          <button type="button" className="record-card__fav hit-44" aria-pressed={fav} aria-label={fav ? '즐겨찾기 해제' : '즐겨찾기'} onClick={() => onFav(s.id)}>
            <Icon name={fav ? 'star-2' : 'star-str'} size={20} />
          </button>
        )}
      </div>
      <div className="record-card__foot">
        <span className="record-card__note">라이딩 {s.rides}회 / {s.minutes}분</span>
        <span className="record-card__rate">캐치율 {s.catch}%{!picking && <Icon name="arr-right" size={16} className="report-card__go" />}</span>
      </div>
    </article>
  );
}
