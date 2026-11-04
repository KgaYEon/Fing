// AI 소개 — 피그마 "ai cont"
import Icon from '../../components/Icon.jsx';
import { Badge } from '../../components/Chip.jsx';

export default function AiIntro() {
  return (
    <section className="ai-intro" aria-labelledby="ai-hello">
      <span className="ai-intro__icon"><Icon name="ai" size={32} /></span>
      <div className="ai-intro__text">
        <h2 className="ai-intro__title" id="ai-hello">오늘 서핑, 뭐가 궁금해요?</h2>
        <p className="ai-intro__sub">내 기록과 오늘의 파도를 바탕으로<br />이해하기 쉽게 답해드려요</p>
      </div>
      <Badge>오늘의 죽도 파도 · 최근 기록 반영</Badge>
    </section>
  );
}
