import { useCallback, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { DateSelectGroup } from "./DateSelectGroup";
import { TimeSelectGroup } from "./TimeSelectGroup";
import { buildLiuyaoUserContent } from "../fortune/buildLiuyaoUserContent";
import { callDeepSeekChat } from "../fortune/callDeepSeek";

type Props = {
  backTo: string;
  title: string;
  subtitle: string;
  systemPrompt: string;
  submitLabel?: string;
};

export function LiuyaoForm({ backTo, title, subtitle, systemPrompt, submitLabel = "起卦推演" }: Props) {
  const [matter, setMatter] = useState("");
  const [category, setCategory] = useState("泛占");
  const [method, setMethod] = useState("请根据参考时间与问题推演卦象（说明法则）");
  const [refDate, setRefDate] = useState("");
  const [refTime, setRefTime] = useState("");
  const [numA, setNumA] = useState("");
  const [numB, setNumB] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setResult("");

      if (!matter.trim()) {
        setError("请填写所占之事。");
        return;
      }

      setLoading(true);
      try {
        const userContent = buildLiuyaoUserContent({
          matter,
          category,
          method,
          refDate,
          refTime,
          numA,
          numB,
          manualNotes,
        });
        const text = await callDeepSeekChat(systemPrompt, userContent);
        setResult(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "请求出错，请稍后重试。");
      } finally {
        setLoading(false);
      }
    },
    [matter, category, method, refDate, refTime, numA, numB, manualNotes, systemPrompt]
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
            <label htmlFor="matter">所占之事</label>
            <textarea
              id="matter"
              rows={4}
              placeholder="例：近期工作变动是否可行……"
              value={matter}
              onChange={(e) => setMatter(e.target.value)}
              required
            />
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="category">占类侧重</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="泛占">泛占</option>
                <option value="事业">事业</option>
                <option value="感情">感情</option>
                <option value="财运">财运</option>
                <option value="健康">健康</option>
                <option value="学业">学业</option>
                <option value="诉讼出行">诉讼 / 出行</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="method">卦象来源</label>
              <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="请根据参考时间与问题推演卦象（说明法则）">
                  未自摇卦：请据参考时间与问题推演（写明法则）
                </option>
                <option value="我已起好卦或已知卦名与动爻，见下方补充说明">
                  已有卦象：见下方补充说明
                </option>
              </select>
            </div>
          </div>

          <div className="row2">
            <DateSelectGroup
              idPrefix="ref"
              label="参考日期（起卦用，可选）"
              value={refDate}
              onChange={setRefDate}
            />
            <TimeSelectGroup
              idPrefix="ref"
              label="参考时刻"
              value={refTime}
              onChange={setRefTime}
              optional
            />
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="numA">梅花报数甲（可选）</label>
              <input
                id="numA"
                type="number"
                inputMode="numeric"
                placeholder="正整数"
                value={numA}
                onChange={(e) => setNumA(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="numB">梅花报数乙（可选）</label>
              <input
                id="numB"
                type="number"
                inputMode="numeric"
                placeholder="正整数"
                value={numB}
                onChange={(e) => setNumB(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="manualNotes">卦象 / 摇卦记录 / 补充（可选）</label>
            <textarea
              id="manualNotes"
              rows={3}
              placeholder="例：本卦雷水解，三爻动，变卦……或铜钱老阳少阴等记录"
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "推演中…" : submitLabel}
            </button>
            <span className="hint">需在项目根目录 .env 配置 DEEPSEEK_API_KEY</span>
          </div>
        </form>

        {error ? <div className="error">{error}</div> : null}

        {result ? (
          <section className="result" aria-live="polite">
            <h2 className="resultTitle">占断结果</h2>
            <div className="resultBody">{result}</div>
          </section>
        ) : null}
      </main>

      <p className="footerNote">占卜仅供文化参考，请勿替代现实决策与专业意见。</p>
    </div>
  );
}
