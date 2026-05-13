import { useEffect, useMemo, useState } from "react";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export type TimeParts = { h: number | ""; m: number | "" };

export function partsFromHm(value: string): TimeParts {
  const t = value.trim();
  if (!t) return { h: "", m: "" };
  const m = t.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!m) return { h: "", m: "" };
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(mi) || h < 0 || h > 23 || mi < 0 || mi > 59) {
    return { h: "", m: "" };
  }
  return { h, m: mi };
}

type Props = {
  idPrefix: string;
  label: string;
  value: string;
  onChange: (hm: string) => void;
  /** 为 true 时允许时、分均未选（提交空字符串） */
  optional?: boolean;
};

export function TimeSelectGroup({ idPrefix, label, value, onChange, optional = false }: Props) {
  const [parts, setParts] = useState<TimeParts>(() => partsFromHm(value));

  useEffect(() => {
    setParts(partsFromHm(value));
  }, [value]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const push = (next: TimeParts) => {
    setParts(next);
    if (next.h !== "" && next.m !== "") {
      onChange(`${pad2(next.h)}:${pad2(next.m)}`);
    } else {
      onChange("");
    }
  };

  const onHour = (v: string) => {
    if (!v) {
      push({ h: "", m: "" });
      return;
    }
    const h = Number(v);
    if (parts.m === "") {
      push({ h, m: "" });
      return;
    }
    push({ h, m: parts.m });
  };

  const onMinute = (v: string) => {
    if (!v) {
      push({ h: parts.h, m: "" });
      return;
    }
    const mi = Number(v);
    if (parts.h === "") {
      push({ h: "", m: mi });
      return;
    }
    push({ h: parts.h, m: mi });
  };

  const labelId = `${idPrefix}-time-label`;

  return (
    <div className="field">
      <span className="fieldLabelStatic" id={labelId}>
        {label}
        {optional ? <span className="fieldOptionalMark">（可选）</span> : null}
      </span>
      <div className="timeSelectRow" role="group" aria-labelledby={labelId}>
        <select
          id={`${idPrefix}-hour`}
          className="dateSelect"
          value={parts.h === "" ? "" : String(parts.h)}
          onChange={(e) => onHour(e.target.value)}
          aria-label="时"
        >
          <option value="">时</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {pad2(h)} 时
            </option>
          ))}
        </select>
        <select
          id={`${idPrefix}-minute`}
          className="dateSelect"
          value={parts.m === "" ? "" : String(parts.m)}
          onChange={(e) => onMinute(e.target.value)}
          aria-label="分"
        >
          <option value="">分</option>
          {minutes.map((m) => (
            <option key={m} value={m}>
              {pad2(m)} 分
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
