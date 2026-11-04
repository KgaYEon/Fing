// 위 고정 영역 — 피그마 "헤드고정": 로고 + 트래커 칩 (누르면 상태 카드)
import { Logo } from '../../components/Logo.jsx';
import TrackerChip from '../../components/TrackerChip.jsx';
import TabHeader from '../../components/TabHeader.jsx';

export default function HomeHeader() {
  return (
    <TabHeader className="home__head">
      <h1 className="home__logo"><Logo label="Fing 홈" /></h1>
      <TrackerChip />
    </TabHeader>
  );
}
