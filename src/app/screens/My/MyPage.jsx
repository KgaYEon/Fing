// 마이 — 피그마 "마이" (67:330)
// 프로필 카드 · 트래커 · 알림(스위치) · 일반(메뉴)
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import TabBar from '../../components/TabBar.jsx';
import { MenuGroup, MenuRow } from '../../components/MenuList.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import { toast } from '../../../ui/ui.js';
import ProfileAvatar from './ProfileAvatar.jsx';
import { STATS, TRACKER } from './my-data.js';
import { useProfile, useAlerts, daysSince } from './useMyStore.js';
import './my.css';

const soon = (what) => () => toast(`${what} 화면은 아직 준비 중이에요`);

function ProfileCard() {
  const [p] = useProfile();
  return (
    <section className="my-card" aria-label="내 프로필">
      <div className="my-card__head">
        <ProfileAvatar photo={p.photo} />
        <div className="my-card__who">
          <h2 className="my-card__name">{p.nickname}</h2>
          <p className="my-card__days">핑과 함께 {daysSince(p.firstDate)}일째 파도 타는 중</p>
        </div>
        <Link to="/my/profile" className="my-card__edit" aria-label="프로필 수정"><Icon name="edit" size={16} /></Link>
      </div>
      <dl className="my-stats">
        {STATS.map((s) => (
          <div key={s.key} className="my-stats__item">
            <dt>{s.label}</dt>
            <dd><b>{s.value}</b><span>{s.unit}</span></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TrackerGroup() {
  return (
    <MenuGroup title="트래커">
      <li className="menu-row my-tracker">
        <span className="my-tracker__info">
          <span className="my-tracker__icon"><Icon name="device" /></span>
          <span className="menu-row__text">
            <span className="menu-row__title my-tracker__name">핑 트래커</span>
            <span className={`my-tracker__state${TRACKER.connected ? ' is-on' : ''}`}><Icon name="on" className="my-tracker__dot" />{TRACKER.connected ? '연결됨' : '연결 안 됨'}</span>
          </span>
        </span>
        <span className="my-tracker__batt"><Icon name={TRACKER.battery > 60 ? 'batt-full' : TRACKER.battery > 20 ? 'batt-half' : 'batt-low'} size={36} />{TRACKER.battery}%</span>
      </li>
      <MenuRow title="착용 가이드" tone="soft" onClick={soon('착용 가이드')} arrow />
      <MenuRow title="기기 연결 관리" tone="soft" onClick={soon('기기 연결 관리')} arrow />
    </MenuGroup>
  );
}

function AlertGroup() {
  const [a, set] = useAlerts();
  return (
    <MenuGroup title="알림">
      <MenuRow title="기록 도착 알림" desc="서핑 기록이 동기화되면 알려드려요" toggle={{ checked: a.arrive, onChange: (v) => set({ arrive: v }) }} />
      <MenuRow title="파도 알림" desc="서핑하기 좋은 파도가 오면 알려드려요" toggle={{ checked: a.wave, onChange: (v) => set({ wave: v }) }} />
      <MenuRow title="개인 기록 갱신 알림" desc="레전드 기록을 넘으면 알려드려요" toggle={{ checked: a.record, onChange: (v) => set({ record: v }) }} />
    </MenuGroup>
  );
}

export default function MyPage() {
  useThemeColor('#F5F8FB');
  return (
    <div className="screen my">
      <header className="my__head"><h1 className="my__title">마이</h1></header>
      <main className="my__main">
        <ProfileCard />
        <TrackerGroup />
        <AlertGroup />
        <MenuGroup title="일반">
          <MenuRow title="계정관리" tone="soft" to="/my/account" />
          <MenuRow title="알림 설정" tone="soft" onClick={soon('알림 설정')} arrow />
          <MenuRow title="문의하기" tone="soft" to="/my/inquiry" />
          <MenuRow title="약관 확인 및 동의" tone="soft" to="/my/terms" />
        </MenuGroup>
      </main>
      <TabBar />
    </div>
  );
}
