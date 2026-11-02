// 질문 1·2·3 — 피그마 193:2577 · 194:1862 · 198:1928
// 하나 골라야 "다음으로"가 눌려요. 3번은 2번 답에 따라 "추천"이 붙어요.
import Choice from '../../../components/Choice.jsx';
import useStep from '../useStep.js';
import { Step, Lines, FootPair, Progress } from '../parts.jsx';
import { QUESTIONS, QUESTION_COUNT, RECOMMEND } from '../content.js';

function Question({ id }) {
  const { data, update, go, back, dir } = useStep(id);
  const q = QUESTIONS[id];
  const rec = id === 'q3' ? RECOMMEND[data.q2] || 'catch' : null;

  return (
    <Step name={id} dir={dir}>
      <Progress n={q.n} total={QUESTION_COUNT} />
      <div className="ob__body ob__body--q">
        <div className="ob__head ob__head--pad">
          <h1 className="ob__title" id={`${id}-title`}><Lines lines={q.title} /></h1>
          <p className="ob__sub">{q.sub}</p>
        </div>
        <div className="ob__choices" role="radiogroup" aria-labelledby={`${id}-title`}>
          {q.options.map((o) => (
            <Choice
              key={o.value}
              name={id}
              value={o.value}
              checked={data[id] === o.value}
              onChange={(v) => update({ [id]: v })}
              title={o.title}
              sub={o.sub}
              badge={o.value === rec ? '추천' : null}
            />
          ))}
        </div>
      </div>
      <FootPair onPrev={back} onNext={() => go()} nextOk={!!data[id]} />
    </Step>
  );
}

export const Q1 = () => <Question id="q1" />;
export const Q2 = () => <Question id="q2" />;
export const Q3 = () => <Question id="q3" />;
