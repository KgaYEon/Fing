// 추천 질문 — 피그마 "추천 질문 섹션" (가운데 줄 + "이런 질문은 어때요?" + 칩)
import Icon from '../../components/Icon.jsx';
import { SUGGESTIONS } from './answers.js';

export default function Suggestions({ onPick, disabled }) {
  return (
    <section className="ai-suggest" aria-labelledby="ai-suggest-title">
      <p className="ai-suggest__head" id="ai-suggest-title"><Icon name="ai" size={16} />이런 질문은 어때요?</p>
      <div className="ai-suggest__list">
        {SUGGESTIONS.map((q) => (
          <button key={q} type="button" className="chip ai-suggest__chip" disabled={disabled} onClick={() => onPick(q)}>{q}</button>
        ))}
      </div>
    </section>
  );
}
