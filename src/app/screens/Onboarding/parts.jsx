// 온보딩 화면들이 같이 쓰는 조각
import { useEffect, useRef } from 'react';
import Button from '../../components/Button.jsx';

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

/** 아래: "아래 계속하기 버튼을 눌러…" + 버튼 하나 */
export function FootOne({ children, ...btn }) {
  return (
    <div className="ob__foot ob__foot--one">
      <p className="ob__hint">아래 계속하기 버튼을 눌러 진행해주세요</p>
      <Button {...btn}>{children}</Button>
    </div>
  );
}

/** 아래: 이전으로 · 다음으로 */
export function FootPair({ onPrev, onNext, nextOk }) {
  return (
    <div className="ob__foot">
      <div className="ob__pair">
        <Button variant="secondary" onClick={onPrev}>이전으로</Button>
        <Button disabled={!nextOk} onClick={onNext}>다음으로</Button>
      </div>
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
