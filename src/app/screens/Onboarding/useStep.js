// 각 단계 화면에서 쓰는 도구 — 답 저장, 다음/이전으로
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { FLOW } from './flow.js';

export default function useStep(step) {
  const { data, update } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { prev, next } = FLOW[step];

  const go = (to = next) => navigate(`/onboarding/${to}`, { state: { from: step, dir: 'fwd' } });
  const back = () => {
    if (!prev) return;
    // 바로 앞 단계에서 왔으면 브라우저 뒤로가기와 똑같이
    if (location.state?.from === prev) navigate(-1);
    else navigate(`/onboarding/${prev}`, { replace: true, state: { dir: 'back' } });
  };
  const skip = () => go('done');   // 건너뛰기 — 남은 질문 없이 바로 준비 끝으로
  return { data, update, go, back: prev ? back : undefined, skip, dir: location.state?.dir || 'fwd' };
}
