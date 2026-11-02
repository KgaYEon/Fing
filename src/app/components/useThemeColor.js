// 화면마다 폰 상단 색(theme-color)을 맞춰요
import { useEffect } from 'react';

export default function useThemeColor(color) {
  useEffect(() => {
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.append(m); }
    m.content = color;
  }, [color]);
}
