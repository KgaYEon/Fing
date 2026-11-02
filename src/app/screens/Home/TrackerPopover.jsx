// 트래커 연결 상태 카드 — 피그마 7:1791(정상) · 33:941(배터리 부족) · 33:823(해제) · 33:904(오류)
import Icon from '../../components/Icon.jsx';

export const TRACKER_STATES = {
  ok: { label: '정상 연결됨', icon: 'link' },
  low: { label: '배터리 부족', icon: 'problem', desc: '라이딩 전, 기기 충전을 해주세요' },
  off: { label: '연결 해제됨', icon: 'disconnect' },
  error: { label: '기기 오류', icon: 'problem', desc: '계속 연결되지 않나요? 서비스 센터를 방문해 주세요.', noBattery: true },
};

const battIcon = (b) => (b <= 20 ? 'batt-low' : b <= 60 ? 'batt-half' : 'batt-full');

export default function TrackerPopover({ id, state, battery, popRef }) {
  const s = TRACKER_STATES[state] || TRACKER_STATES.ok;
  const batt = state === 'off' ? null : battery;
  return (
    <div className="home-pop" id={id} ref={popRef} role="dialog" aria-label="트래커 연결 상태" data-state={state}>
      <div className="home-pop__top">
        <div className="home-pop__text">
          <span className="home-pop__eyebrow">FING TRACKER</span>
          <span className="home-pop__status"><Icon name="on" className="home__dot" />{s.label}</span>
          {s.desc && <span className="home-pop__desc">{s.desc}</span>}
        </div>
        <span className="home-pop__icon"><Icon name={s.icon} /></span>
      </div>
      {!s.noBattery && (
        <div className="home-pop__batt">
          <span className="home-pop__batt-k">배터리</span>
          <span className="home-pop__batt-v">
            {batt != null && <Icon name={battIcon(batt)} className="home-pop__batt-ic" />}
            {batt == null ? '-' : `${batt}%`}
          </span>
        </div>
      )}
    </div>
  );
}
