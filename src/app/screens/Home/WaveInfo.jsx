// 오늘의 파도 — 피그마 "홈 서핑 정보 섹션 / wave info"
import Icon from '../../components/Icon.jsx';
import FitDonut from './FitDonut.jsx';

const today = () => {
  const d = new Date();
  return `${d.getMonth() + 1}월 ${d.getDate()}일 · ${d.getHours() < 12 ? '오전' : '오후'}`;
};

export default function WaveInfo({ wave }) {
  return (
    <section className="home__wave" aria-labelledby="wave-spot">
      <div className="home__wave-head">
        <div className="home__place">
          <p className="home__date">{today()}</p>
          <h2 className="home__spot" id="wave-spot">{wave.spot}</h2>
        </div>
      </div>
      <div className="home__wave-body">
        <div className="home__metrics">
          <div className="home__height">
            <span className="home__height-k">파고</span>
            <span className="home__height-v"><b>{wave.height}</b><span className="home__unit">m</span></span>
          </div>
          <FitDonut value={wave.fit} />
        </div>
        <ul className="home__weather">
          <li className="home__weather-item"><Icon name="wind" size={20} /><span className="home__weather-k">바람</span><span className="home__weather-v">{wave.wind}</span></li>
          <li className="home__weather-item"><Icon name="time" size={20} /><span className="home__weather-k">만조</span><span className="home__weather-v">{wave.tide}</span></li>
        </ul>
        <p className="home__note">{wave.note}</p>
      </div>
    </section>
  );
}
