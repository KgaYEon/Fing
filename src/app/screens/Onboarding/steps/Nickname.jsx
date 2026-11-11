// 닉네임 — 피그마 439:2924 (빈칸) · 439:3041 (입력) · 439:2986 (너무 김)
// 건너뛰기: 닉네임이 비어 있거나 너무 길면 예시 이름(춤추는 돌고래 01)으로 정하고 질문 시작(기록 준비)으로
import { useEffect, useRef } from 'react';
import useStep from '../useStep.js';
import { Step, Top, Foot } from '../parts.jsx';
import { NICK_MAX, NICK_SAMPLE, nickState, nickLength } from '../flow.js';

export default function Nickname() {
  const { data, update, go, dir } = useStep('nickname');
  const value = data.nickDraft ?? data.nickname ?? '';
  const st = nickState(value);
  const input = useRef(null);

  // 폰에서 키보드가 화면을 덮지 않게, 들어오는 움직임이 끝난 뒤 포커스
  useEffect(() => { const t = setTimeout(() => input.current?.focus({ preventScroll: true }), 300); return () => clearTimeout(t); }, []);

  const onChange = (e) => update({ nickDraft: e.target.value, nickname: e.target.value.trim() });
  const next = () => { if (st.ok) go(); };
  const skipStep = () => { if (!st.ok) update({ nickDraft: NICK_SAMPLE, nickname: NICK_SAMPLE }); go(); };   // 건너뛰기: 질문 시작(기록 준비)으로

  return (
    <Step name="nickname" dir={dir} focusTitle={false}>
      <Top action="건너뛰기" onAction={skipStep} />
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
            placeholder={NICK_SAMPLE}
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
      <Foot disabled={!st.ok} onClick={next}>다음으로</Foot>
    </Step>
  );
}
