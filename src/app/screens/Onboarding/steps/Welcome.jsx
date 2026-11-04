// 환영 — 피그마 190:2194
import Icon from '../../../components/Icon.jsx';
import useStep from '../useStep.js';
import { Step, FootOne } from '../parts.jsx';

export default function Welcome() {
  const { go, dir } = useStep('welcome');
  return (
    <Step name="welcome" dir={dir}>
      <div className="ob__center ob__center--welcome">
        <span className="icon-box icon-box--lg"><Icon name="paper" size={32} /></span>
        <div className="ob__head ob__head--center">
          <p className="ob__eyebrow">반갑습니다 서퍼님!</p>
          <h1 className="ob__title">시작하기 전에<br />몇 가지 권한 허용이 필요해요</h1>
        </div>
      </div>
      <FootOne onClick={() => go()}>권한 확인하기</FootOne>
    </Step>
  );
}
