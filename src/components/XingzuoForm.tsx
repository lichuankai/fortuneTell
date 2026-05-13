import { useCallback, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { DateSelectGroup } from "./DateSelectGroup";
import { TimeSelectGroup } from "./TimeSelectGroup";
import { buildXingzuoUserContent } from "../fortune/buildXingzuoUserContent";
import { callDeepSeekChat } from "../fortune/callDeepSeek";
import type { Gender } from "../fortune/types";

type Props = {
  backTo: string;
  title: string;
  subtitle: string;
  systemPrompt: string;
  submitLabel?: string;
};

export function XingzuoForm({ backTo, title, subtitle, systemPrompt, submitLabel = "生成解读" }: Props) {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [focus, setFocus] = useState("综合");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setResult("");

      if (!birthDate.trim()) {
        setError("请填写公历生日。");
        return;
      }

      setLoading(true);
      try {
        const userContent = buildXingzuoUserContent({
          birthDate: birthDate.trim(),
          birthTime: birthTime.trim(),
          birthPlace,
          gender,
          focus,
          question,
        });
        const text = await callDeepSeekChat(systemPrompt, userContent);
        setResult(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "请求出错，请稍后重试。");
      } finally {
        setLoading(false);
      }
    },
    [birthDate, birthTime, birthPlace, gender, focus, question, systemPrompt]
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
          <div className="row2">
            <DateSelectGroup
              idPrefix="xzBirth"
              label="公历生日"
              value={birthDate}
              onChange={setBirthDate}
            />
            <TimeSelectGroup
              idPrefix="xzBirth"
              label="出生时刻（用于上升等）"
              value={birthTime}
              onChange={setBirthTime}
              optional
            />
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="xzGender">性别（可选）</label>
              <select id="xzGender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="">不指定</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="xzBirthPlace">出生地 / 时区（可选）</label>
              <input
                id="xzBirthPlace"
                type="text"
                placeholder="例：上海，东八区"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="xzFocus">解读侧重</label>
            <select id="xzFocus" value={focus} onChange={(e) => setFocus(e.target.value)}>
              <option value="综合">综合（性格与当下）</option>
              <option value="事业">事业</option>
              <option value="感情">感情</option>
              <option value="财运">财运</option>
              <option value="人际">人际</option>
              <option value="自我成长">自我成长</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="xzQuestion">具体问题或补充（可选）</label>
            <textarea
              id="xzQuestion"
              rows={3}
              placeholder="例：近期是否适合换城市工作……"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "生成中…" : submitLabel}
            </button>
            <span className="hint">需在项目根目录 .env 配置 DEEPSEEK_API_KEY</span>
          </div>
        </form>

        {error ? <div className="error">{error}</div> : null}

        {result ? (
          <section className="result" aria-live="polite">
            <h2 className="resultTitle">解读结果</h2>
            <div className="resultBody">{result}</div>
          </section>
        ) : null}
      </main>

      <p className="footerNote">占星解读仅供娱乐与自我觉察，不构成专业建议。</p>
    </div>
  );
}
