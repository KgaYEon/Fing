// 프로필 수정 — 피그마 "마이-수정" (85:731) + 저장 안 하고 나갈 때 모달 (90:1007)
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import { setNavGuard, clearNavGuard } from '../../components/navGuard.js';
import { toast } from '../../../ui/ui.js';
import { nickState, NICK_MAX } from '../Onboarding/flow.js';
import SubPage from './SubPage.jsx';
import ProfileAvatar from './ProfileAvatar.jsx';
import { useProfile } from './useMyStore.js';

// 고른 사진을 작게 줄여서 저장 (휴대폰 저장 공간 아끼기)
function shrink(file, max = 240) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src); resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const today = () => new Date().toISOString().slice(0, 10);

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [saved, save] = useProfile();
  const [form, setForm] = useState(saved);
  const [leaveTo, setLeaveTo] = useState(null);   // 모달: 어디로 나가려는지
  const fileRef = useRef(null);
  const nick = nickState(form.nickname);
  const dirty = form.nickname !== saved.nickname || form.firstDate !== saved.firstDate || form.photo !== saved.photo;
  const valid = nick.ok && !!form.firstDate;

  // 바뀐 게 있으면 아래 탭으로 나갈 때도 먼저 물어보기
  useEffect(() => { if (dirty) setNavGuard((to) => setLeaveTo(to)); else clearNavGuard(); return clearNavGuard; }, [dirty]);

  const goBack = (to) => (to ? navigate(to) : window.history.state?.idx > 0 ? navigate(-1) : navigate('/my', { replace: true }));
  const onBack = () => (dirty ? setLeaveTo('back') : goBack());
  const commit = () => { save({ ...form, nickname: form.nickname.trim() }); clearNavGuard(); toast('프로필을 저장했어요'); };
  const saveAndLeave = (to) => { if (!valid) { setLeaveTo(null); toast(nick.msg || '첫 서핑 일자를 입력해주세요'); return; } commit(); goBack(to === 'back' ? null : to); };

  const pick = async (e) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast('사진 파일을 골라주세요'); return; }
    try { setForm((o) => ({ ...o, photo: null })); const url = await shrink(f); setForm((o) => ({ ...o, photo: url })); } catch { toast('사진을 불러오지 못했어요'); }
  };

  return (
    <SubPage
      title="프로필 수정"
      onBack={onBack}
      className="my-edit"
    >
      <div className="my-edit__photo">
        <button type="button" className="my-edit__avatar" onClick={() => fileRef.current.click()} aria-label="프로필 사진 변경">
          <ProfileAvatar photo={form.photo} size={100} iconSize={56} />
        </button>
        <button type="button" className="my-edit__photo-btn" onClick={() => fileRef.current.click()}>프로필 사진 변경</button>
        {form.photo && <button type="button" className="my-edit__photo-del" onClick={() => setForm((o) => ({ ...o, photo: null }))}>기본 이미지로</button>}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
      </div>

      <div className="my-fields">
        <div className="my-field" data-tone={nick.tone === 'danger' ? 'danger' : ''}>
          <label className="my-field__label" htmlFor="nick">닉네임</label>
          <input id="nick" className="my-field__input" type="text" autoComplete="nickname" spellCheck={false} value={form.nickname}
            onChange={(e) => setForm((o) => ({ ...o, nickname: e.target.value }))} aria-invalid={nick.tone === 'danger'} aria-describedby="nick-msg" />
          <span className="my-field__msg" id="nick-msg">{nick.tone === 'danger' ? nick.msg : !form.nickname.trim() ? '닉네임을 입력해주세요' : `${[...form.nickname.trim()].length} / ${NICK_MAX}자`}</span>
        </div>
        <div className="my-field">
          <label className="my-field__label" htmlFor="first">핑과 함께 한 첫 서핑 일자</label>
          <input id="first" className="my-field__input" type="date" max={today()} value={form.firstDate} onChange={(e) => setForm((o) => ({ ...o, firstDate: e.target.value }))} />
        </div>
      </div>

      <Button className="my-edit__save" disabled={!valid || !dirty} onClick={() => saveAndLeave(null)}>저장하고 나가기</Button>

      <Modal
        open={!!leaveTo}
        title="수정 내용이 저장되지 않았어요"
        sub="나가기 전, 내용을 저장할까요?"
        cancel="저장 없이 나가기"
        onDismiss={() => setLeaveTo(null)}
        confirm="저장하고 나가기"
        onCancel={() => { const to = leaveTo; setLeaveTo(null); clearNavGuard(); goBack(to === 'back' ? null : to); }}
        onConfirm={() => { const to = leaveTo; setLeaveTo(null); saveAndLeave(to); }}
      />
    </SubPage>
  );
}
