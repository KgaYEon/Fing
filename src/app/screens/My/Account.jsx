// 계정 관리 — 피그마 "마이" (111:1153) + 로그아웃 모달 (90:1029)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuGroup, MenuRow } from '../../components/MenuList.jsx';
import Modal from '../../components/Modal.jsx';
import SubPage from './SubPage.jsx';
import { ACCOUNT } from './my-data.js';

export default function Account() {
  const navigate = useNavigate();
  const [ask, setAsk] = useState(false);
  return (
    <SubPage title="계정 관리">
      <MenuGroup title="메뉴">
        <MenuRow title="로그인 정보" desc={ACCOUNT.email} descLg />
        <MenuRow title="내 데이터 관리" tone="soft" to="/my/account/data" />
        <MenuRow title="로그아웃" tone="danger" onClick={() => setAsk(true)} arrow={false} />
        <MenuRow title="회원 탈퇴" tone="danger" to="/my/account/withdraw" />
      </MenuGroup>
      <Modal
        open={ask}
        tone="danger"
        title="로그아웃 하시겠습니까?"
        sub="언제든 다시 돌아올 수 있어요"
        cancel="닫기"
        confirm="로그아웃 하기"
        onCancel={() => setAsk(false)}
        onConfirm={() => navigate('/login', { replace: true })}   // 기록은 남겨둬요 (다시 로그인하면 홈으로)
      />
    </SubPage>
  );
}
