// 앱 시작점 — 디자인 토큰·공통 스타일을 불러오고 화면을 붙여요.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../styles/base.css';
import './app.css';
import App from './App.jsx';

// 컴퓨터에서 폰 틀(402 × 940)이 창 안에 다 들어오도록 통째로 줄여요 (늘리지는 않아요)
const FRAME = { w: 402, h: 940, margin: 48 };
function fitFrame() {
  const z = Math.min(1, (innerHeight - FRAME.margin) / FRAME.h, (innerWidth - FRAME.margin) / FRAME.w);
  document.documentElement.style.setProperty('--frame-zoom', Math.max(0.3, z).toFixed(4));
}
fitFrame();
addEventListener('resize', fitFrame);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
