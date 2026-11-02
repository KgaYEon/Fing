// 즐겨찾기 (별) — 휴대폰에 저장
import { useEffect, useState } from 'react';

const KEY = 'fing.favorites';
export default function useFavorites() {
  const [favs, setFavs] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []); } catch { return new Set(); } });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify([...favs])); } catch {} }, [favs]);
  const toggle = (id) => setFavs((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return [favs, toggle];
}
