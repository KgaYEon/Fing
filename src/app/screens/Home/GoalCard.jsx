// 나의 목표 — 피그마 "card" (목표 + 지금 기록 시작하기)
import Button from '../../components/Button.jsx';
import { Chip } from '../../components/Chip.jsx';
import { toast } from '../../../ui/ui.js';
import { GOALS } from './home-data.js';

export default function GoalCard({ metric, onSet }) {
  const g = GOALS[metric];
  return (
    <section className="home__card home__goal" aria-labelledby="goal-title">
      <div className="home__card-head">
        <h2 className="home__card-title" id="goal-title">나의 목표</h2>
        <Chip className="home__chip hit-44" onClick={onSet}>목표 설정</Chip>
      </div>
      <div className="home__goal-body">
        <p className="home__goal-main"><b>{g.value}</b><span>{g.unit}</span></p>
        <p className="home__goal-sub">나의 최고기록 기준</p>
      </div>
      <Button className="home__cta" onClick={() => toast('기록 화면은 아직 준비 중이에요')}>지금 기록 시작하기</Button>
    </section>
  );
}
