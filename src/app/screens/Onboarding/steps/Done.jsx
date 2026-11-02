// 준비 끝 — 피그마 205:2105
// "핑 시작하기" → 답 저장 + 온보딩 끝 표시 → 홈
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon.jsx';
import Button from '../../../components/Button.jsx';
import { wait } from '../../../../ui/ui.js';
import { ROUTES, markOnboarded } from '../../../routes.js';
import useStep from '../useStep.js';
import { Step } from '../parts.jsx';
import { DRAFT } from '../flow.js';
import Confetti from './Confetti.jsx';

export default function Done() {
  const { data, dir } = useStep('done');
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    setBusy(true);
    try {
      localStorage.setItem('fing.profile', JSON.stringify({ nickname: data.nickname || '', surfing: data.q1 || null, level: data.q2 || null, goal: data.q3 || null }));
      sessionStorage.removeItem(DRAFT);
    } catch {}
    markOnboarded();
    await wait(400);
    navigate(ROUTES.home.path, { replace: true });
  };

  return (
    <Step name="done" dir={dir}>
      <div className="ob__center ob__center--finish">
        <span className="ob__burst">
          <Confetti />
          <span className="icon-box icon-box--finish"><Icon name="check" size={28} /></span>
        </span>
        <div className="ob__head ob__head--center">
          <h1 className="ob__title">핑과 함께 할 준비가<br />모두 끝났어요!</h1>
          <p className="ob__sub">핑과 함께 서핑을 시작해볼까요?</p>
        </div>
      </div>
      <div className="ob__foot"><Button busy={busy} onClick={finish}>핑 시작하기</Button></div>
    </Step>
  );
}
