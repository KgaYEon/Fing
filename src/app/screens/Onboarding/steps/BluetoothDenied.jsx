// 블루투스 권한 거절 — 피그마 439:4101 (위 오른쪽 건너뛰기만)
// "설정으로 이동하기": 진짜 앱에선 폰 설정을 열어요 — 여기선 블루투스 권한 요청 창을 다시 띄워요
//   허용하면 → 권한 설정 완료 / 또 거절하면 → 이 화면에 그대로
// 건너뛰기: 블루투스 없이 닉네임으로 (트래커 연결은 나중에)
import { useState } from 'react';
import IconBox from '../../../components/IconBox.jsx';
import useStep from '../useStep.js';
import { Step, Top, Foot } from '../parts.jsx';
import { PERMISSION_ASKS } from '../content.js';
import PermissionAsk from './PermissionAsk.jsx';

const BT = PERMISSION_ASKS.find((a) => a.key === 'bluetooth');

export default function BluetoothDenied() {
  const { data, update, go, dir } = useStep('bluetooth');
  const [asking, setAsking] = useState(false);

  const onAnswer = (value) => {
    setAsking(false);
    update({ permissions: { ...data.permissions, bluetooth: value } });
    if (value !== 'denied') go('permission-done');
  };

  return (
    <Step name="bluetooth" dir={dir}>
      <Top action="건너뛰기" onAction={() => go('nickname')} />
      <div className="ob__center ob__center--perm">
        <IconBox name="bluetooth" className="icon-box--status" />
        <div className="ob__head ob__head--center">
          <h1 className="ob__title">트래커와 연결하려면<br />근처 기기 권한이 필요해요</h1>
          <p className="ob__sub">권한을 허용해주세요</p>
        </div>
      </div>
      <Foot onClick={() => setAsking(true)}>설정으로 이동하기</Foot>
      {asking && <PermissionAsk ask={BT} last onAnswer={onAnswer} />}
    </Step>
  );
}
