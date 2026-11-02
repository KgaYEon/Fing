// 화면마다 위쪽 색을 맞춰요 — 폰의 상단 색(theme-color) + 폰 틀의 상태바 바탕색
import { useEffect } from 'react';

export default function useThemeColor(color) {
  useEffect(() => {
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.append(m); }
    m.content = color;
    document.documentElement.style.setProperty('--status-bg', color);
  }, [color]);
}
