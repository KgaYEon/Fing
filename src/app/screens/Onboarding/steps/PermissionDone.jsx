// 권한 설정 완료 — 피그마 439:2876 (위 바 비어 있음)
// 블루투스를 허용했을 때 권한 요청 창 다음에 나와요
import IconBox from '../../../components/IconBox.jsx';
import useStep from '../useStep.js';
import { Step, Top, Foot } from '../parts.jsx';

export default function PermissionDone() {
  const { go, dir } = useStep('permission-done');
  return (
    <Step name="permission-done" dir={dir}>
      <Top />
      <div className="ob__center ob__center--perm">
        <IconBox name="check" className="icon-box--status" />
        <h1 className="ob__title ob__title--center">권한 설정이<br />완료되었습니다!</h1>
      </div>
      <Foot onClick={() => go()}>다음으로</Foot>
    </Step>
  );
}
