// 대화 기록 — 휴대폰에 저장 (마이 > 내 데이터 관리 > AI 대화 기록 삭제로 지워요)
import { useEffect, useState } from 'react';
import { answer } from './answers.js';

export const CHAT_KEY = 'fing.ai.chat';
const load = () => { try { const v = JSON.parse(localStorage.getItem(CHAT_KEY)); return Array.isArray(v) ? v : []; } catch { return []; } };

export default function useChat() {
  const [messages, setMessages] = useState(load);
  const [thinking, setThinking] = useState(false);
  useEffect(() => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-50))); } catch {} }, [messages]);

  const ask = (q) => {
    const text = q.trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { id: Date.now(), from: 'me', text }]);
    setThinking(true);
    setTimeout(() => {   // 생각하는 척
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'ai', ...answer(text) }]);
      setThinking(false);
    }, 900);
  };
  return { messages, thinking, ask };
}
