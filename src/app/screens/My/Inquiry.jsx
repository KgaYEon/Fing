// 문의하기 — 피그마 "마이-수정" (90:1262)
// 제목·내용을 쓰면 "제출하기"가 눌려요. 쓰다가 나가면 저장 안 된다고 물어봐요.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import { setNavGuard, clearNavGuard } from '../../components/navGuard.js';
import { toast, wait } from '../../../ui/ui.js';
import SubPage from './SubPage.jsx';

const TITLE_MAX = 40;
const BODY_MAX = 1000;

export default function Inquiry() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [leaveTo, setLeaveTo] = useState(null);
  const dirty = !!(title.trim() || body.trim());
  const ok = !!title.trim() && body.trim().length >= 5;

  useEffect(() => { if (dirty) setNavGuard((to) => setLeaveTo(to)); else clearNavGuard(); return clearNavGuard; }, [dirty]);
  const goBack = (to) => (to ? navigate(to) : window.history.state?.idx > 0 ? navigate(-1) : navigate('/my', { replace: true }));

  const submit = async () => {
    setBusy(true);
    await wait(700);   // 보내는 척 (나중에 서버 연결)
    clearNavGuard();
    toast('문의를 보냈어요. 답변은 이메일로 알려드릴게요', 2600);
    goBack();
  };

  return (
    <SubPage
      title="문의 하기"
      onBack={() => (dirty ? setLeaveTo('back') : goBack())}
      footer={<Button disabled={!ok} busy={busy} onClick={submit}>제출하기</Button>}
      className="my-ask"
    >
      <div className="my-ask__form">
        <input className="my-ask__title" type="text" placeholder="문의 제목" aria-label="문의 제목" maxLength={TITLE_MAX} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="my-ask__body" placeholder={"문의 내용을 입력해주세요\n답변은 가입한 이메일로 보내드려요"} aria-label="문의 내용" maxLength={BODY_MAX} value={body} onChange={(e) => setBody(e.target.value)} />
        <span className="my-ask__count" aria-live="polite">{body.length} / {BODY_MAX}자</span>
      </div>
      <Modal
        open={!!leaveTo}
        title="작성 중인 문의가 있어요"
        sub="나가면 쓴 내용이 사라져요"
        cancel="계속 쓰기"
        confirm="나가기"
        onCancel={() => setLeaveTo(null)}
        onConfirm={() => { const to = leaveTo; setLeaveTo(null); clearNavGuard(); goBack(to === 'back' ? null : to); }}
      />
    </SubPage>
  );
}
