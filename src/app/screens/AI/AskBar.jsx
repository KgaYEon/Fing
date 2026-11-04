// 질문 입력 바 — 피그마 "AI 질문 입력 바" (+ 누르면 입력 중 모양 58:571)
import { useState } from 'react';
import Icon from '../../components/Icon.jsx';

export default function AskBar({ onAsk, busy }) {
  const [text, setText] = useState('');
  const can = !!text.trim() && !busy;
  const send = (e) => { e.preventDefault(); if (!can) return; onAsk(text); setText(''); };
  return (
    <form className="ai-ask" onSubmit={send}>
      <input className="ai-ask__input" type="text" placeholder="궁금한 내용을 물어보세요" aria-label="AI에게 질문" enterKeyHint="send" maxLength={200} value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" className="ai-ask__send" aria-label="질문 보내기" aria-disabled={!can || undefined}><Icon name="send" /></button>
    </form>
  );
}
