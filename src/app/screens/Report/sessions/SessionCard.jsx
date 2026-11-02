// 서핑 기록 카드 — 피그마 "cont/card" (= 디자인시스템 Record card)
// 카드를 누르면 선택(파란 테두리), 별을 누르면 즐겨찾기
import Icon from '../../../components/Icon.jsx';
import { longDate, NEW_ID } from '../report-data.js';

export default function SessionCard({ s, selected, onSelect, fav, onFav }) {
  const title = longDate(s.date);
  return (
    <article className={`record-card report-card${selected ? ' is-selected' : ''}`}>
      <button type="button" className="report-card__pick" aria-pressed={selected} aria-label={`${title} 기록 ${selected ? '선택 해제' : '선택'}`} onClick={() => onSelect(s.id)} />
      <div className="record-card__head">
        <div className="record-card__title">
          <span className="record-card__date">{title}{s.id === NEW_ID && <span className="badge badge--sm">NEW</span>}</span>
          <span className="record-card__meta">{s.spot} / {s.height}m</span>
        </div>
        <button type="button" className="record-card__fav" aria-pressed={fav} aria-label={fav ? '즐겨찾기 해제' : '즐겨찾기'} onClick={() => onFav(s.id)}>
          <Icon name={fav ? 'star-2' : 'star-str'} size={20} />
        </button>
      </div>
      <div className="record-card__foot">
        <span className="record-card__note">라이딩 {s.rides}회 / {s.minutes}분</span>
        <span className="record-card__rate">캐치율 {s.catch}%</span>
      </div>
    </article>
  );
}
