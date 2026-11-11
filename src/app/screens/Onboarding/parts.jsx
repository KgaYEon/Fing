// 온보딩 화면들이 같이 쓰는 조각
import { useEffect, useRef } from 'react';
import Button from '../../components/Button.jsx';
import Icon from '../../components/Icon.jsx';

/** 단계 화면 틀 — 들어올 때 옆에서 밀려오고, 제목에 포커스 */
export function Step({ name, dir, children, focusTitle = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = ref.current.querySelector('h1');
    if (focusTitle && h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }, [focusTitle]);
  return <section ref={ref} className={`ob__step ob__step--${name}`} data-dir={dir}>{children}</section>;
}

/** 줄바꿈 있는 제목 — ['첫 줄', '둘째 줄'] */
export const Lines = ({ lines }) => lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>);

/** 위: 뒤로가기(←) · 오른쪽 글자 버튼 — 피그마 온보딩 틀의 "onboarding top"
 *  <Top onBack={back} action="건너뛰기" onAction={skip} />  (둘 다 없으면 빈 자리만 차지해요) */
export function Top({ onBack, action, onAction }) {
  return (
    <div className="ob__top">
      {onBack && <button type="button" className="ob__top-back" onClick={onBack} aria-label="뒤로가기"><Icon name="arr-left" size={40} /></button>}
      {action && <button type="button" className="ob__top-action" onClick={onAction}>{action}</button>}
    </div>
  );
}

/** 아래: 버튼 하나 — 피그마 온보딩 틀의 "Button" (모든 단계가 같은 자리)
 *  disabled면 회색(unselected) 모양으로 바뀌고 눌리지 않아요 */
export function Foot({ children, ...btn }) {
  return (
    <div className="ob__foot">
      <Button {...btn}>{children}</Button>
    </div>
  );
}

/** 질문 진행 막대 */
export function Progress({ n, total }) {
  return (
    <div className="ob__progress" role="progressbar" aria-label="질문 진행" aria-valuemin={0} aria-valuemax={total} aria-valuenow={n} aria-valuetext={`${total}개 중 ${n}번째`}>
      <span className="ob__progress-fill" style={{ '--from': (n - 1) / total, '--to': n / total }} />
    </div>
  );
}
