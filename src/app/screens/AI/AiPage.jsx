// AI — 피그마 "AI" 섹션 (46:267 처음 · 174:3080 질문 · 174:3200 답변)
// 처음: 소개 + 추천 질문 · 질문하면: 소개 아래로 대화가 이어져요
import { useEffect, useRef } from 'react';
import TabBar from '../../components/TabBar.jsx';
import TrackerChip from '../../components/TrackerChip.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import AiIntro from './AiIntro.jsx';
import Suggestions from './Suggestions.jsx';
import Message, { Thinking } from './Message.jsx';
import AskBar from './AskBar.jsx';
import useChat from './useChat.js';
import './ai.css';

export default function AiPage() {
  const { messages, thinking, ask } = useChat();
  const list = useRef(null);
  const last = messages[messages.length - 1];
  useThemeColor('#F5F8FB');

  // 새 말풍선이 생기면 맨 아래로
  useEffect(() => { const el = list.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: messages.length ? 'smooth' : 'auto' }); }, [messages.length, thinking]);

  return (
    <div className="screen ai">
      <header className="ai__head">
        <h1 className="ai__title">AI</h1>
        <TrackerChip label="기기 연결됨" />
      </header>
      <main className={`ai__main${messages.length ? '' : ' is-empty'}`} ref={list} aria-live="polite">
        <AiIntro />
        {messages.length === 0 && <Suggestions onPick={ask} disabled={thinking} />}
        {messages.length > 0 && (
          <div className="ai-chat">
            {messages.map((m) => <Message key={m.id} m={m} />)}
            {thinking && <Thinking />}
            {!thinking && last?.suggest && <Suggestions onPick={ask} />}
          </div>
        )}
      </main>
      <div className="ai__dock"><AskBar onAsk={ask} busy={thinking} /></div>
      <TabBar />
    </div>
  );
}
