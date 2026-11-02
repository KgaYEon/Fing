// 기록 준비 — 피그마 193:2471
import Button from '../../../components/Button.jsx';
import useStep from '../useStep.js';
import { Step } from '../parts.jsx';

export default function Intro() {
  const { go, dir } = useStep('intro');
  return (
    <Step name="intro" dir={dir}>
      <div className="ob__center ob__center--intro">
        <div className="ob__head ob__head--center ob__head--tight">
          <h1 className="ob__title">이제, 나에게 맞는 기록을<br />준비해볼까요?</h1>
          <p className="ob__sub">몇 가지만 답하면 준비가 끝나요</p>
        </div>
      </div>
      <div className="ob__foot ob__foot--stack">
        <Button variant="secondary" onClick={() => go('done')}>건너뛰기</Button>
        <Button onClick={() => go()}>설정하러 가기</Button>
      </div>
    </Step>
  );
}
