// 닉네임 — 피그마 193:2525 (빈칸) · 362:2842 (입력) · 362:2890 (너무 김)
import { useEffect, useRef } from 'react';
import useStep from '../useStep.js';
import { Step, FootPair } from '../parts.jsx';
import { NICK_MAX, nickState, nickLength } from '../flow.js';

export default function Nickname() {
  const { data, update, go, back, dir } = useStep('nickname');
  const value = data.nickDraft ?? data.nickname ?? '';
  const st = nickState(value);
  const input = useRef(null);

  // 폰에서 키보드가 화면을 덮지 않게, 들어오는 움직임이 끝난 뒤 포커스
  useEffect(() => { const t = setTimeout(() => input.current?.focus({ preventScroll: true }), 300); return () => clearTimeout(t); }, []);

  const onChange = (e) => update({ nickDraft: e.target.value, nickname: e.target.value.trim() });
  const next = () => { if (st.ok) go(); };

  return (
    <Step name="nickname" dir={dir} focusTitle={false}>
      <div className="ob__body ob__body--nick">
        <div className="ob__head">
          <h1 className="ob__title" id="nick-title">닉네임으로 사용할<br />서퍼님의 이름을 알려주세요!</h1>
          <p className="ob__sub" id="nick-sub">{NICK_MAX}글자 이내로 작성해주세요</p>
        </div>
        <div className="ob__field" data-tone={st.tone}>
          <input
            ref={input}
            className="ob__input"
            type="text"
            autoComplete="nickname"
            enterKeyHint="next"
            spellCheck={false}
            placeholder="닉네임을 입력해주세요"
            aria-labelledby="nick-title"
            aria-describedby="nick-sub nick-msg"
            aria-invalid={st.tone === 'danger'}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); next(); } }}
          />
          <div className="ob__field-msg">
            <span id="nick-msg" className="ob__msg">{st.msg}</span>
            <span className="ob__count" aria-hidden="true">{nickLength(value)} / {NICK_MAX}자</span>
          </div>
        </div>
      </div>
      <FootPair onPrev={back} onNext={next} nextOk={st.ok} />
    </Step>
  );
}
