// 회원 탈퇴 — 피그마 "마이" (111:1767) + 확인 모달 (130:2043)
// 모달에 "탈퇴하면 되돌릴 수 없어요"를 똑같이 입력해야 탈퇴 버튼이 눌려요
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import { wait } from '../../../ui/ui.js';
import SubPage from './SubPage.jsx';
import { STATS, RIDES_TOTAL } from './my-data.js';

const PHRASE = '탈퇴하면 되돌릴 수 없어요';

export default function Withdraw() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const surf = STATS.find((s) => s.key === 'surf').value;
  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/my/account', { replace: true }));

  const leave = async () => {
    setBusy(true);
    await wait(800);
    // 이 기기에 저장된 핑 정보를 모두 지우고 처음 화면으로
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('fing.')).forEach((k) => localStorage.removeItem(k));
      Object.keys(sessionStorage).filter((k) => k.startsWith('fing.')).forEach((k) => sessionStorage.removeItem(k));
    } catch {}
    navigate('/', { replace: true });
  };

  return (
    <SubPage
      title="회원 탈퇴"
      fallback="/my/account"
      tabBar={false}
      className="my-withdraw"
      footer={(
        <div className="my-withdraw__btns">
          <Button variant="danger-sec" onClick={back}>돌아가기</Button>
          <Button variant="danger" onClick={() => { setTyped(''); setOpen(true); }}>탈퇴하기</Button>
        </div>
      )}
    >
      <div className="my-withdraw__head">
        <h2 className="my-withdraw__title">회원 탈퇴 하기</h2>
        <p className="my-withdraw__sub">서비스를 탈퇴하기 전<br />아래 정보를 먼저 확인해주세요</p>
      </div>
      <div className="my-notes">
        <section className="my-note">
          <h3 className="my-note__title">탈퇴하면 모든 기록이 사라져요</h3>
          <p className="my-note__label">사라지는 기록</p>
          <ul className="my-note__list">
            <li>서핑 {surf}번, 라이딩 {RIDES_TOTAL}개의 기록</li>
            <li>내 최고 기록과 처음 해낸 것</li>
            <li>AI 대화 기록과 프로필</li>
          </ul>
        </section>
        <section className="my-note">
          <h3 className="my-note__title">함께 확인해주세요</h3>
          <ul className="my-note__list">
            <li>삭제된 기록은 되돌릴 수 없어요</li>
            <li>접속 기록은 3개월간 보관한 뒤 삭제해요</li>
            <li>트래커 연결이 자동으로 해제돼요</li>
            <li>같은 이메일로 재가입 해도 기록은 돌아오지 않아요</li>
          </ul>
        </section>
      </div>

      <Modal
        open={open}
        tone="danger"
        title="정말 탈퇴하시겠어요?"
        sub="탈퇴를 위해 아래 문구를 입력해주세요"
        cancel="취소"
        confirm="탈퇴하기"
        confirmDisabled={typed.trim() !== PHRASE}
        busy={busy}
        onCancel={() => setOpen(false)}
        onConfirm={leave}
      >
        <div className="modal__field">
          <input className="modal__input" type="text" placeholder={PHRASE} aria-label={`"${PHRASE}" 입력`} value={typed} onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && typed.trim() === PHRASE && !e.nativeEvent.isComposing) leave(); }} />
        </div>
      </Modal>
    </SubPage>
  );
}
