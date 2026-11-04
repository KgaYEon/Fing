// 말풍선 — 피그마 "질문 말풍선"(오른쪽, 연파랑) · "답변 말풍선"(왼쪽, 흰색 + 이동 버튼)
import { Link } from 'react-router-dom';

export default function Message({ m }) {
  if (m.from === 'me') return <div className="ai-msg ai-msg--me"><p>{m.text}</p></div>;
  return (
    <div className="ai-msg ai-msg--ai">
      <p>{m.text}</p>
      {m.links?.length > 0 && (
        <div className="ai-msg__links">
          {m.links.map((l) => <Link key={l.to + l.label} to={l.to} className={`button ai-msg__btn${l.primary ? '' : ' button--secondary'}`}>{l.label}</Link>)}
        </div>
      )}
    </div>
  );
}

export function Thinking() {
  return <div className="ai-msg ai-msg--ai ai-msg--thinking" role="status" aria-label="답변을 만들고 있어요"><span /><span /><span /></div>;
}
