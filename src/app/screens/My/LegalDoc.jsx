// 이용 약관 (90:1145) · 개인정보 처리 방침 (111:778) 전체 화면 — 내용은 legal.js (로그인 시트와 같은 글)
import { Navigate, useParams } from 'react-router-dom';
import { TERMS, PRIVACY } from '../../legal.js';
import SubPage from './SubPage.jsx';

export default function LegalDoc() {
  const { doc } = useParams();
  const d = doc === 'service' ? TERMS : doc === 'privacy' ? PRIVACY : null;
  if (!d) return <Navigate to="/my/terms" replace />;
  return (
    <SubPage title={d.title} fallback="/my/terms" className="my-doc">
      <div dangerouslySetInnerHTML={{ __html: d.body }} />
    </SubPage>
  );
}
