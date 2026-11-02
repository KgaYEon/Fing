// 홈 설정 (목표 기준 · 최근 기록 기준) — 휴대폰에 저장해서 다시 와도 유지
import { useEffect, useState } from 'react';
import { METRICS } from './home-data.js';

const KEY = 'fing.home';
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };

export default function useHomeSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = read(KEY);
    const profile = read('fing.profile');
    return {
      goal: saved.goal || (METRICS[profile.goal] ? profile.goal : 'catch'), // 온보딩 3번 답을 처음 목표로
      recent: saved.recent || 'count',
    };
  });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {} }, [settings]);
  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
  return [settings, set];
}
