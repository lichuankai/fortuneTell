import { useCallback, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { buildTarotUserContent } from "../fortune/buildTarotUserContent";
import { callDeepSeekChat } from "../fortune/callDeepSeek";

type Props = {
  backTo: string;
  title: string;
  subtitle: string;
  systemPrompt: string;
  submitLabel?: string;
};

export function TarotForm({ backTo, title, subtitle, systemPrompt, submitLabel = "开牌解读" }: Props) {
  const [matter, setMatter] = useState("");
  const [spread, setSpread] = useState("三张牌：过去 — 现在 — 建议");
  const [deckNote, setDeckNote] = useState("伟特系牌意为主");
  const [manualCards, setManualCards] = useState("");
  const [seedNote, setSeedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setResult("");

      if (!matter.trim()) {
        setError("请填写占卜问题。");
        return;
      }

      setLoading(true);
      try {
        const userContent = buildTarotUserContent({
          matter,
          spread,
          deckNote,
          manualCards,
          seedNote,
        });
        const text = await callDeepSeekChat(systemPrompt, userContent);
        setResult(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "请求出错，请稍后重试。");
      } finally {
        setLoading(false);
      }
    },
    [matter, spread, deckNote, manualCards, seedNote, systemPrompt]
  );

  return (
    <div className="app">
      <nav className="navBar">
        <Link to={backTo} className="navLink">
          ← 返回
        </Link>
      </nav>

      <header className="header">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </header>

      <main className="card">
        <form className="formGrid" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="tarotMatter">占卜问题</label>
            <textarea
              id="tarotMatter"
              rows={3}
              placeholder="例：这段关系近期该如何自处……"
              value={matter}
              onChange={(e) => setMatter(e.target.value)}
              required
            />
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="tarotSpread">牌阵</label>
              <select id="tarotSpread" value={spread} onChange={(e) => setSpread(e.target.value)}>
                <option value="单张：核心讯息">单张：核心讯息</option>
                <option value="三张牌：过去 — 现在 — 建议">三张牌：过去 — 现在 — 建议</option>
                <option value="三张牌：现状 — 阻碍 — 出路">三张牌：现状 — 阻碍 — 出路</option>
                <option value="由你根据问题推荐牌阵并说明">由你根据问题推荐牌阵并说明</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="tarotDeck">牌系偏好</label>
              <select id="tarotDeck" value={deckNote} onChange={(e) => setDeckNote(e.target.value)}>
                <option value="伟特系牌意为主">伟特系牌意为主</option>
                <option value="不限牌系，说明即可">不限牌系，说明即可</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="tarotManual">已抽牌面（可选，含位置与正逆）</label>
            <textarea
              id="tarotManual"
              rows={4}
              placeholder="若已用实体牌占卜，请按位置写出牌名与正逆；留空则由模型模拟抽牌。"
              value={manualCards}
              onChange={(e) => setManualCards(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tarotSeed">抽牌参考数字或说明（可选）</label>
            <input
              id="tarotSeed"
              type="text"
              placeholder="例：7、21（用作模拟抽牌的种子）"
              value={seedNote}
              onChange={(e) => setSeedNote(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "解读中…" : submitLabel}
            </button>
            <span className="hint">需在项目根目录 .env 配置 DEEPSEEK_API_KEY</span>
          </div>
        </form>

        {error ? <div className="error">{error}</div> : null}

        {result ? (
          <section className="result" aria-live="polite">
            <h2 className="resultTitle">牌面解读</h2>
            <div className="resultBody">{result}</div>
          </section>
        ) : null}
      </main>

      <p className="footerNote">塔罗仅供娱乐与反思，请理性看待。</p>
    </div>
  );
}
