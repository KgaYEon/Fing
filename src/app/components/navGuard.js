// 화면을 떠나기 전에 확인하기 (예: 프로필 수정 중 저장 안 하고 나가려 할 때)
// 화면에서 setNavGuard((to) => { 모달 열기 }) → 아래 탭·뒤로가기를 누르면 이동 대신 이 함수가 불려요
let guard = null;
export const setNavGuard = (fn) => { guard = fn; };
export const clearNavGuard = () => { guard = null; };
export const runNavGuard = (to) => { if (!guard) return false; guard(to); return true; };
