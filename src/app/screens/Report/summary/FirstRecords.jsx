// 첫 기록 모음 — 피그마 "rdcord"
import Icon from '../../../components/Icon.jsx';
import { toast } from '../../../../ui/ui.js';
import { FIRSTS } from '../report-data.js';

export default function FirstRecords() {
  return (
    <section className="report__sec" aria-labelledby="first-title">
      <div className="report__sec-head">
        <h2 className="report__sec-title" id="first-title">첫 기록 모음</h2>
        <button type="button" className="report__more" onClick={() => toast('첫 기록 모음 화면은 아직 준비 중이에요')}>더 보기<Icon name="arr-right" size={20} /></button>
      </div>
      <ul className="report-firsts">
        {FIRSTS.map((f) => (
          <li key={f.date + f.text} className="report-firsts__item">
            <span className="report-firsts__date">{f.date}</span>
            <span className="report-firsts__text">{f.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
