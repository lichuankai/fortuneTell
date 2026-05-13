import { useCallback, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { DateSelectGroup } from "./DateSelectGroup";
import { TimeSelectGroup } from "./TimeSelectGroup";
import { buildBirthUserContent } from "../fortune/buildUserContent";
import { callDeepSeekChat } from "../fortune/callDeepSeek";
import type { BirthFormState, Gender } from "../fortune/types";

type Props = {
  backTo: string;
  title: string;
  subtitle: string;
  systemPrompt: string;
  userLead: string;
  submitLabel?: string;
};

const initialState: BirthFormState = {
  birthDate: "",
  birthTime: "",
  gender: "",
  calendar: "solar",
  birthPlace: "",
  question: "",
};

export function FortuneForm({ backTo, title, subtitle, systemPrompt, userLead, submitLabel = "开始排盘" }: Props) {
  const [birthDate, setBirthDate] = useState(initialState.birthDate);
  const [birthTime, setBirthTime] = useState(initialState.birthTime);
  const [gender, setGender] = useState<Gender>(initialState.gender);
  const [calendar, setCalendar] = useState(initialState.calendar);
  const [birthPlace, setBirthPlace] = useState(initialState.birthPlace);
  const [question, setQuestion] = useState(initialState.question);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setResult("");

      if (!birthDate.trim() || !birthTime.trim()) {
        setError("请填写出生日期与出生时刻。");
        return;
      }

      const params: BirthFormState = {
        birthDate: birthDate.trim(),
        birthTime: birthTime.trim(),
        gender,
        calendar,
        birthPlace,
        question,
      };

      setLoading(true);
      try {
        const userContent = buildBirthUserContent(userLead, params);
        const text = await callDeepSeekChat(systemPrompt, userContent);
        setResult(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "请求出错，请稍后重试。");
      } finally {
        setLoading(false);
      }
    },
    [birthDate, birthTime, birthPlace, calendar, gender, question, systemPrompt, userLead]
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
            <label htmlFor="calendar">历法</label>
            <select id="calendar" value={calendar} onChange={(e) => setCalendar(e.target.value)}>
              <option value="solar">公历</option>
              <option value="lunar">农历（请在备注中写清对应公历）</option>
            </select>
          </div>

          <div className="row2">
            <DateSelectGroup
              idPrefix="birth"
              label="出生日期"
              value={birthDate}
              onChange={setBirthDate}
            />
            <TimeSelectGroup
              idPrefix="birth"
              label="出生时刻"
              value={birthTime}
              onChange={setBirthTime}
            />
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="gender">性别（可选）</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="">不指定</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="birthPlace">出生地 / 时区（可选）</label>
              <input
                id="birthPlace"
                type="text"
                placeholder="例：北京市，东八区"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="question">想问的重点（可选）</label>
            <textarea
              id="question"
              rows={3}
              placeholder="例：近年事业变动、感情走势……"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
            <h2 className="resultTitle">推演结果</h2>
            <div className="resultBody">{result}</div>
          </section>
        ) : null}
      </main>

      <p className="footerNote">命理分析仅供娱乐与文化研究，不构成任何决策依据。</p>
    </div>
  );
}
