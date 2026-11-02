// 권한 안내 — 피그마 190:2257
// 실제 권한 요청은 앱(네이티브)에서 붙일 예정 — 지금은 잠깐 기다리는 척만 해요
import { useState } from 'react';
import IconBox from '../../../components/IconBox.jsx';
import { wait } from '../../../../ui/ui.js';
import useStep from '../useStep.js';
import { Step, FootOne } from '../parts.jsx';
import { PERMISSIONS } from '../content.js';

export default function Permission() {
  const { go, dir } = useStep('permission');
  const [busy, setBusy] = useState(false);
  const allow = async () => { setBusy(true); await wait(600); go(); };

  return (
    <Step name="permission" dir={dir}>
      <div className="ob__body ob__body--perm">
        <h1 className="ob__title">원활한 앱 사용을 위해<br />접근 권한을 허용해주세요</h1>
        <div className="ob__perms">
          {PERMISSIONS.map(({ group, items }) => (
            <section key={group} className="ob__perm-group" aria-label={`${group}적 접근 권한`}>
              <h2 className="ob__perm-label">{group}적 접근 권한</h2>
              <ul className="ob__perm-list">
                {items.map((p) => (
                  <li key={p.title} className="ob__perm">
                    <IconBox name={p.icon} />
                    <span className="ob__perm-text"><b>{p.title}</b><span>{p.sub}</span></span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="ob__note">선택 권한의 경우 허용하지 않아도 서비스를 사용하실 수 있으나,<br />일부 서비스 이용이 제한될 수 있어요.</p>
      </div>
      <FootOne busy={busy} onClick={allow}>계속하기</FootOne>
    </Step>
  );
}
