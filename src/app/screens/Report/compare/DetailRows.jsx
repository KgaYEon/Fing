// 기록 상세 비교 / 보기 — 피그마 "record cards" (비교 종목 · 과거기록 · 최근기록)
// 최근 기록이 더 좋아지면 파란색, 나빠지면 빨간색
const ROWS = [
  { key: 'caught', label: '캐치 횟수', unit: '회' },
  { key: 'catch', label: '캐치율', unit: '%' },
  { key: 'avg', label: '평균 라이딩', unit: '초' },
  { key: 'longest', label: '최장 라이딩', unit: '초' },
  { key: 'count', label: '1시간 파도 수', unit: '개' },
];

export default function DetailRows({ title, a, b, labels = ['과거기록', '최근기록'] }) {
  return (
    <section className="report__sec" aria-labelledby="rows-title">
      <h2 className="report__sec-title" id="rows-title">{title}</h2>
      <table className="report-rows">
        <thead>
          <tr><th scope="col">비교 종목</th><th scope="col">{labels[0]}</th><th scope="col">{labels[1]}</th></tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const tone = b[r.key] > a[r.key] ? 'up' : b[r.key] < a[r.key] ? 'down' : '';
            return (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                <td>{a[r.key]}{r.unit}</td>
                <td className={tone && `is-${tone}`}>{b[r.key]}{r.unit}{tone && <span className="sr-only">{tone === 'up' ? ' (올랐어요)' : ' (내렸어요)'}</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
