// 약관 시트 — 피그마 "마이-개인정보 처리방침" 화면 내용 (legal.js)
import Sheet from '../../components/Sheet.jsx';
import { TERMS, PRIVACY } from '../../legal.js';

export default function LegalSheet({ doc, onClose }) {
  const d = doc === 'terms' ? TERMS : doc === 'privacy' ? PRIVACY : null;
  return (
    <Sheet open={!!d} onClose={onClose} title={d?.title}>
      {d && <div dangerouslySetInnerHTML={{ __html: d.body }} />}
    </Sheet>
  );
}
