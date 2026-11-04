// 마이에서 바꾸는 값들 — 휴대폰에 저장 (프로필 · 알림 · 선택 동의)
import { useEffect, useState } from 'react';
import { DEFAULT_PROFILE } from './my-data.js';

const read = (k, fallback) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; } catch { return fallback; } };
function useStored(key, init) {
  const [v, setV] = useState(() => ({ ...init, ...read(key, {}) }));
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, (patch) => setV((o) => ({ ...o, ...patch }))];
}

/** 프로필 — 온보딩에서 정한 닉네임을 이어받아요 */
export function useProfile() {
  const onboard = read('fing.profile', {});
  return useStored('fing.my.profile', { ...DEFAULT_PROFILE, ...(onboard.nickname ? { nickname: onboard.nickname } : {}) });
}
/** 알림 (마이 첫 화면) — 피그마 기본값: 기록 도착 켬 · 파도 끔 · 기록 갱신 끔 */
export const useAlerts = () => useStored('fing.my.alerts', { arrive: true, wave: false, record: false });
/** 선택 동의 (약관 확인 및 동의) — 피그마 기본값: 모두 켬 */
export const useConsents = () => useStored('fing.my.consents', { location: true, marketing: true, night: true });

/** 첫 서핑 일자부터 오늘까지 며칠째인지 (첫날 = 1일째) */
export function daysSince(iso) {
  const start = new Date(`${iso}T00:00:00`); const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((today - start) / 86400000) + 1);
}
