// 대화 — 휴대폰에 저장 (마이 > 내 데이터 관리 > AI 대화 기록 삭제로 지워요)
// 질문은 Claude에게 보내요 (개발 서버의 /__ai). 연결이 안 되면(키 없음·오프라인) 정해진 답으로 대답해요.
import { useEffect, useRef, useState } from 'react';
import { answer } from './answers.js';
import { buildContext } from './context.js';

export const CHAT_KEY = 'fing.ai.chat';
const load = () => { try { const v = JSON.parse(localStorage.getItem(CHAT_KEY)); return Array.isArray(v) ? v : []; } catch { return []; } };

async function askClaude(history) {
  const r = await fetch('/__ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: history, context: buildContext() }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.text) throw new Error(data.error || `http ${r.status}`);
  return data.text;
}

export default function useChat() {
  const [messages, setMessages] = useState(load);
  const [thinking, setThinking] = useState(false);
  const offline = useRef(false);   // 한 번 키가 없다고 나오면 그다음부터는 바로 정해진 답
  useEffect(() => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-50))); } catch {} }, [messages]);

  const ask = async (q) => {
    const text = q.trim();
    if (!text || thinking) return;
    const next = [...messages, { id: Date.now(), from: 'me', text }];
    setMessages(next);
    setThinking(true);
    const canned = answer(text);   // 정해진 답 — 연결이 안 될 때 쓰고, 이동 버튼(링크)은 Claude 답에도 붙여요
    let reply;
    try {
      if (offline.current) throw new Error('offline');
      const history = next.map((m) => ({ role: m.from === 'me' ? 'user' : 'assistant', content: m.text }));
      const ai = await askClaude(history);
      reply = { text: ai, links: canned.suggest ? [] : canned.links, by: 'claude' };
    } catch (e) {
      if (String(e.message) === 'no-key') offline.current = true;
      await new Promise((r) => setTimeout(r, Math.min(1400, 500 + canned.text.length * 8)));   // 생각하는 척 (긴 답일수록 조금 더)
      reply = { ...canned, by: 'local' };
    }
    setMessages((m) => [...m, { id: Date.now() + 1, from: 'ai', ...reply }]);
    setThinking(false);
  };
  return { messages, thinking, ask };
}
