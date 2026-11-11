// 기록 준비 — 피그마 439:3209
import useStep from '../useStep.js';
import { Step, Top, Foot } from '../parts.jsx';

export default function Intro() {
  const { go, back, skip, dir } = useStep('intro');
  return (
    <Step name="intro" dir={dir}>
      <Top onBack={back} action="건너뛰기" onAction={skip} />
      <div className="ob__center ob__center--intro">
        <div className="ob__head ob__head--center ob__head--tight">
          <h1 className="ob__title">이제, 나에게 맞는 기록을<br />준비해볼까요?</h1>
          <p className="ob__sub">몇 가지만 답하면 준비가 끝나요</p>
        </div>
      </div>
      <Foot onClick={() => go()}>다음으로</Foot>
    </Step>
  );
}
