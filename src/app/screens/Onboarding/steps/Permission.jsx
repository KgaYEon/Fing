// 권한 안내 — 피그마 439:2806
// "권한 설정하기" → 폰의 권한 요청 창이 블루투스 · 알림 · 위치 · 사진 순서로 하나씩 떠요 (PermissionAsk)
// 실제 권한 요청은 앱(네이티브)에서 붙일 예정 — 지금은 고른 답만 저장해요 (data.permissions)
import { useRef, useState } from 'react';
import IconBox from '../../../components/IconBox.jsx';
import useStep from '../useStep.js';
import { Step, Top, Foot } from '../parts.jsx';
import { PERMISSIONS, PERMISSION_ASKS } from '../content.js';
import PermissionAsk from './PermissionAsk.jsx';

export default function Permission() {
  const { update, go, back, dir } = useStep('permission');
  const [step, setStep] = useState(-1);   // 지금 떠 있는 요청 창 (-1: 없음)
  const answers = useRef({});

  const onAnswer = (value) => {
    answers.current[PERMISSION_ASKS[step].key] = value;
    if (step < PERMISSION_ASKS.length - 1) { setStep(step + 1); return; }
    setStep(-1);
    update({ permissions: { ...answers.current } });
    go(answers.current.bluetooth === 'denied' ? 'bluetooth' : 'permission-done');
  };

  return (
    <Step name="permission" dir={dir}>
      <Top onBack={back} />
      <div className="ob__body ob__body--perm">
        <h1 className="ob__title">원활한 앱 사용을 위해<br />접근 권한을 허용해주세요</h1>
        <div className="ob__perms">
          {PERMISSIONS.map(({ group, items }) => (
            <section key={group} className="ob__perm-group" aria-label={`${group}적 접근 권한`}>
              <h2 className="ob__perm-label">{group}적 접근 권한</h2>
              <ul className="ob__perm-list">
                {items.map((p) => (
                  <li key={p.title} className="ob__perm">
                    <IconBox name={p.icon} />
                    <span className="ob__perm-text"><b>{p.title}</b><span>{p.sub}</span></span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="ob__note">선택 권한의 경우 허용하지 않아도 서비스를 사용하실 수 있으나,<br />일부 서비스 이용이 제한될 수 있어요.</p>
      </div>
      <Foot onClick={() => setStep(0)}>권한 설정하기</Foot>
      {step >= 0 && <PermissionAsk ask={PERMISSION_ASKS[step]} last={step === PERMISSION_ASKS.length - 1} onAnswer={onAnswer} />}
    </Step>
  );
}
