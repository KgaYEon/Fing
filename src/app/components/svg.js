// SVG 문자열 → 리액트에서 쓸 수 있게 viewBox와 안쪽 내용으로 나눠요
const cache = new Map();
export function splitSvg(str) {
  if (!str) return null;
  if (cache.has(str)) return cache.get(str);
  const viewBox = (str.match(/viewBox="([^"]+)"/) || [])[1];
  const inner = str.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const out = { viewBox, inner };
  cache.set(str, out);
  return out;
}
