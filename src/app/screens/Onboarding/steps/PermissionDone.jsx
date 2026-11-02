// 권한 완료 — 피그마 193:2386
import Icon from '../../../components/Icon.jsx';
import useStep from '../useStep.js';
import { Step, FootOne } from '../parts.jsx';

export default function PermissionDone() {
  const { go, dir } = useStep('permission-done');
  return (
    <Step name="permission-done" dir={dir}>
      <div className="ob__center ob__center--done">
        <span className="icon-box icon-box--lg icon-box--md-r"><Icon name="check" size={28} /></span>
        <h1 className="ob__title ob__title--center">권한 설정이<br />완료되었습니다!</h1>
      </div>
      <FootOne onClick={() => go()}>계속하기</FootOne>
    </Step>
  );
}
