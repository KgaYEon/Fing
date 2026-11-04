// 홈 — 피그마 "홈" 섹션 Home(284:2221)
// 위: HomeHeader / 내용: WaveInfo · GoalCard · BestRecords · RecentRecords / 아래: TabBar
import { useState } from 'react';
import useThemeColor from '../../components/useThemeColor.js';
import TabBar from '../../components/TabBar.jsx';
import HomeHeader from './HomeHeader.jsx';
import WaveInfo from './WaveInfo.jsx';
import GoalCard from './GoalCard.jsx';
import BestRecords from './BestRecords.jsx';
import RecentRecords from './RecentRecords.jsx';
import MetricSheet from './MetricSheet.jsx';
import useHomeSettings from './useHomeSettings.js';
import { WAVE } from './home-data.js';
import './home.css';

export default function Home() {
  const [settings, setSetting] = useHomeSettings();
  const [sheet, setSheet] = useState(null); // 'goal' | 'recent' | null
  useThemeColor('#FFFFFF');

  return (
    <div className="screen home">
      <HomeHeader />
      <main className="home__main">
        <WaveInfo wave={WAVE} />
        <GoalCard metric={settings.goal} onSet={() => setSheet('goal')} />
        <BestRecords />
        <RecentRecords metric={settings.recent} onSet={() => setSheet('recent')} />
      </main>
      <TabBar />
      <MetricSheet kind={sheet} current={sheet ? settings[sheet] : null} onSave={setSetting} onClose={() => setSheet(null)} />
    </div>
  );
}
