// 약관 확인 및 동의 — 피그마 "마이-개인정보 처리방침" (90:1046)
// 선택 동의를 끌 때는 확인 모달 (111:1416 위치 · 111:1701 마케팅 · 111:1720 야간), 켤 때는 바로 켜요
import { useState } from 'react';
import { MenuGroup, MenuRow } from '../../components/MenuList.jsx';
import { Badge } from '../../components/Chip.jsx';
import Modal from '../../components/Modal.jsx';
import { toast } from '../../../ui/ui.js';
import SubPage from './SubPage.jsx';
import { AGREED_AT } from './my-data.js';
import { useConsents } from './useMyStore.js';

const OFF = {
  location: { title: '위치 기반 서비스를 끌까요?', sub: '더 이상 서핑이 기록되지 않아요' },
  marketing: { title: '마케팅 정보 수신을 끌까요?', sub: '더 이상 마케팅 정보를 수신하지 않아요' },
  night: { title: '야간 알림 수신을 끌까요?', sub: '더 이상 오후 9시~오전 8시에 알람을 받지 않아요' },
};

export default function Terms() {
  const [c, set] = useConsents();
  const [ask, setAsk] = useState(null);
  const change = (key) => (on) => { if (on) { set({ [key]: true }); toast('동의했어요'); } else setAsk(key); };
  const agreed = <Badge>{AGREED_AT} 동의</Badge>;

  return (
    <SubPage title="약관 확인 및 동의" className="my-terms">
      <MenuGroup title="필수 동의 항목">
        <MenuRow title="이용 약관 보기" to="/my/terms/service" right={agreed} arrow={false} />
        <MenuRow title="개인정보 처리 방침 보기" to="/my/terms/privacy" right={agreed} arrow={false} />
      </MenuGroup>
      <MenuGroup title="선택 동의 항목">
        <MenuRow title="위치 기반 서비스 동의" desc="서핑하는 동안의 위치로 기록을 만들어요" toggle={{ checked: c.location, onChange: change('location') }} />
        <MenuRow title="마케팅 정보 수신 동의" desc="이벤트와 새 기능 소식을 알림으로 받아요" toggle={{ checked: c.marketing, onChange: change('marketing') }} />
        <MenuRow title="야간 알림 동의" desc="오후 9시~오전 8시에도 이벤트 소식을 받아요" toggle={{ checked: c.night, onChange: change('night') }} />
      </MenuGroup>
      <Modal
        open={!!ask}
        tone="danger"
        title={ask && OFF[ask].title}
        sub={ask && OFF[ask].sub}
        cancel="취소"
        confirm="끄기"
        onCancel={() => setAsk(null)}
        onConfirm={() => { set({ [ask]: false }); setAsk(null); }}
      />
    </SubPage>
  );
}
