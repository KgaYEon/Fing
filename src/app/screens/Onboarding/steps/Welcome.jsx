// 환영 — 피그마 439:2760
// 위 오른쪽 "로그아웃" → 로그인 화면으로
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon.jsx';
import { ROUTES } from '../../../routes.js';
import useStep from '../useStep.js';
import { Step, Top, Foot } from '../parts.jsx';

export default function Welcome() {
  const { go, dir } = useStep('welcome');
  const navigate = useNavigate();
  return (
    <Step name="welcome" dir={dir}>
      <Top action="로그아웃" onAction={() => navigate(ROUTES.login.path, { replace: true })} />
      <div className="ob__center ob__center--welcome">
        <span className="icon-box icon-box--lg"><Icon name="paper" size={32} /></span>
        <div className="ob__head ob__head--center">
          <p className="ob__eyebrow">반갑습니다 서퍼님!</p>
          <h1 className="ob__title">시작하기 전에<br />몇 가지 권한 허용이 필요해요</h1>
        </div>
      </div>
      <Foot onClick={() => go()}>계속하기</Foot>
    </Step>
  );
}
