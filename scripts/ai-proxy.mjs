// AI 연결 — 앱의 AI 화면이 POST /__ai 로 질문을 보내면, 여기서 Claude에게 물어보고 답을 돌려줘요.
// API 키는 이 컴퓨터의 .env.local 파일에만 두고, 브라우저(앱 화면)로는 절대 보내지 않아요.
//   .env.local 예시:  ANTHROPIC_API_KEY=sk-ant-...
// 키가 없거나 연결이 안 되면 앱은 원래의 정해진 답으로 대답해요.

const MODEL = 'claude-haiku-5-5';   // 빠르고 저렴한 모델 — 간단한 대화용
const MAX_TOKENS = 400;

const SYSTEM = `너는 서핑 기록 앱 "핑(Fing)"의 AI 도우미야.
- 사용자는 서핑을 배우는 사람이야. 쉬운 말로, 친근한 존댓말("~해요")로 답해.
- 답은 짧게. 보통 2~4문장, 길어도 6문장을 넘기지 마. 표나 마크다운(#, **, -)은 쓰지 마.
- 아래 "사용자 정보"에 있는 기록과 오늘 파도를 근거로 답해. 거기 없는 숫자는 지어내지 마.
- 인사나 가벼운 말에는 가볍게 대답하고, 서핑이나 기록에 대해 물어보라고 자연스럽게 이어줘.
- 바다 안전이 걸린 질문(입수해도 되는지 등)은 판단을 대신하지 말고, 현장 안전요원과 기상 특보를 확인하라고 안내해.
- 서핑·기록·바다와 상관없는 부탁은 짧게 거절하고 서핑 이야기로 돌려.`;

const readBody = (req) => new Promise((resolve, reject) => {
  let s = '';
  req.on('data', (c) => { s += c; if (s.length > 50_000) reject(new Error('too big')); });
  req.on('end', () => resolve(s));
  req.on('error', reject);
});

export function aiProxy(getKey) {
  const handle = async (req, res, next) => {
    if (req.url !== '/__ai') return next();
    const send = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(obj)); };
    if (req.method !== 'POST') return send(405, { error: 'method' });
    const key = getKey();
    if (!key) return send(503, { error: 'no-key' });
    try {
      const { messages = [], context = '' } = JSON.parse(await readBody(req));
      // 최근 대화 10개까지만, 글자 수도 제한
      const history = messages.slice(-10)
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
      while (history.length && history[0].role !== 'user') history.shift();
      if (!history.length || history[history.length - 1].role !== 'user') return send(400, { error: 'bad-messages' });

      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system: `${SYSTEM}\n\n[사용자 정보]\n${String(context).slice(0, 4000)}`, messages: history }),
        signal: AbortSignal.timeout(20_000),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return send(502, { error: 'api', status: r.status, message: data?.error?.message || '' });
      const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
      return send(200, { text });
    } catch (e) {
      return send(502, { error: 'fail', message: String(e.message || e) });
    }
  };
  return {
    name: 'fing-ai-proxy',
    configureServer(s) { s.middlewares.use(handle); },
    configurePreviewServer(s) { s.middlewares.use(handle); },
  };
}
