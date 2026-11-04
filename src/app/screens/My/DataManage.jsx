// 내 데이터 관리 — 피그마 "마이-계정관리-내데이터관리" (130:2542)
// 내보내기: 서핑 기록을 엑셀에서 열리는 파일(.csv)로 저장
// AI 대화 삭제 · 서핑 기록 초기화: 피그마에 확인 모달이 없어서 같은 모양으로 물어봐요
import { useState } from 'react';
import { MenuGroup, MenuRow } from '../../components/MenuList.jsx';
import Modal from '../../components/Modal.jsx';
import { toast } from '../../../ui/ui.js';
import SubPage from './SubPage.jsx';
import { SESSIONS, perHour } from '../Report/report-data.js';

function exportCsv() {
  const head = ['날짜', '장소', '파고(m)', '라이딩(회)', '시간(분)', '캐치율(%)', '평균 라이딩(초)', '최장 라이딩(초)', '1시간 파도 수(개)'];
  const rows = SESSIONS.map((s) => [s.date, s.spot, s.height, s.rides, s.minutes, s.catch, s.avg, s.longest, perHour(s)]);
  const csv = '﻿' + [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');   // ﻿: 엑셀에서 한글 안 깨지게
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `fing-records-${new Date().toISOString().slice(0, 10)}.csv`   /* 영어 이름: 일부 브라우저가 한글 파일 이름을 "download"로 바꿔버려요 */ });
  document.body.append(a); a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1000);
}

const ASK = {
  ai: { title: 'AI 대화 기록을 지울까요?', sub: '지운 대화는 되돌릴 수 없어요', confirm: '지우기', done: 'AI 대화 기록을 지웠어요' },
  reset: { title: '서핑 기록을 초기화할까요?', sub: '계정은 그대로 두고 기록만 처음부터 시작해요', confirm: '초기화하기', done: '서핑 기록을 초기화했어요' },
};

export default function DataManage() {
  const [ask, setAsk] = useState(null);
  const confirm = () => {
    if (ask === 'ai') { try { localStorage.removeItem('fing.ai.chat'); } catch {} }
    if (ask === 'reset') ['fing.favorites', 'fing.home', 'fing.report.picked'].forEach((k) => { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch {} });
    toast(ASK[ask].done);
    setAsk(null);
  };
  return (
    <SubPage title="내 데이터 관리" fallback="/my/account">
      <MenuGroup title="메뉴">
        <MenuRow title="내 기록 내보내기" desc="지금까지의 서핑 기록을 파일로 저장해요" onClick={() => { exportCsv(); toast('서핑 기록 파일을 저장했어요'); }} arrow={false} />
        <MenuRow title="AI 대화 기록 삭제" desc="AI와 나눈 질문과 답변을 모두 지워요" onClick={() => setAsk('ai')} arrow={false} />
        <MenuRow title="서핑 기록 초기화" desc="계정은 그대로 두고 기록만 처음부터 시작해요" tone="danger" onClick={() => setAsk('reset')} arrow={false} />
      </MenuGroup>
      <Modal open={!!ask} tone="danger" title={ask && ASK[ask].title} sub={ask && ASK[ask].sub} confirm={ask && ASK[ask].confirm} onCancel={() => setAsk(null)} onConfirm={confirm} />
    </SubPage>
  );
}
