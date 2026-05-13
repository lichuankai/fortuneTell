import { useEffect, useMemo, useState } from "react";

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export type DateParts = { y: number | ""; m: number | ""; d: number | "" };

export function partsFromIso(value: string): DateParts {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { y: "", m: "", d: "" };
  }
  const [ys, ms, ds] = value.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!Number.isFinite(y) || m < 1 || m > 12 || d < 1) {
    return { y: "", m: "", d: "" };
  }
  const max = daysInMonth(y, m);
  return { y, m, d: Math.min(d, max) };
}

function clampDay(y: number, m: number, d: number): number {
  return Math.min(d, daysInMonth(y, m));
}

type Props = {
  idPrefix: string;
  label: string;
  value: string;
  onChange: (iso: string) => void;
};

export function DateSelectGroup({ idPrefix, label, value, onChange }: Props) {
  const [parts, setParts] = useState<DateParts>(() => partsFromIso(value));

  useEffect(() => {
    setParts(partsFromIso(value));
  }, [value]);

  const yearEnd = useMemo(() => new Date().getFullYear() + 1, []);
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = yearEnd; y >= 1900; y--) list.push(y);
    return list;
  }, [yearEnd]);

  const maxDay =
    parts.y !== "" && parts.m !== "" ? daysInMonth(parts.y, parts.m) : 31;
  const dayOptions = useMemo(() => {
    const arr: number[] = [];
    for (let d = 1; d <= maxDay; d++) arr.push(d);
    return arr;
  }, [maxDay]);

  const push = (next: DateParts) => {
    setParts(next);
    if (next.y !== "" && next.m !== "" && next.d !== "") {
      const d = clampDay(next.y, next.m, next.d);
      onChange(`${next.y}-${pad2(next.m)}-${pad2(d)}`);
    } else {
      onChange("");
    }
  };

  const onYear = (v: string) => {
    if (!v) {
      push({ y: "", m: "", d: "" });
      return;
    }
    const y = Number(v);
    if (parts.m === "" || parts.d === "") {
      push({ y, m: parts.m, d: parts.d });
      return;
    }
    const d = clampDay(y, parts.m, parts.d);
    push({ y, m: parts.m, d });
  };

  const onMonth = (v: string) => {
    if (!v) {
      push({ y: parts.y, m: "", d: "" });
      return;
    }
    const m = Number(v);
    if (parts.y === "") {
      push({ y: "", m: m, d: "" });
      return;
    }
    const y = parts.y;
    const dRaw = parts.d === "" ? 1 : parts.d;
    const d = clampDay(y, m, dRaw);
    push({ y, m, d });
  };

  const onDay = (v: string) => {
    if (!v) {
      push({ y: parts.y, m: parts.m, d: "" });
      return;
    }
    const d = Number(v);
    if (parts.y === "" || parts.m === "") {
      push({ y: parts.y, m: parts.m, d });
      return;
    }
    const y = parts.y;
    const m = parts.m;
    const d2 = clampDay(y, m, d);
    push({ y, m, d: d2 });
  };

  const labelId = `${idPrefix}-date-label`;

  return (
    <div className="field">
      <span className="fieldLabelStatic" id={labelId}>
        {label}
      </span>
      <div className="dateSelectRow" role="group" aria-labelledby={labelId}>
        <select
          id={`${idPrefix}-year`}
          className="dateSelect"
          value={parts.y === "" ? "" : String(parts.y)}
          onChange={(e) => onYear(e.target.value)}
          aria-label="年"
        >
          <option value="">年</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y} 年
            </option>
          ))}
        </select>
        <select
          id={`${idPrefix}-month`}
          className="dateSelect"
          value={parts.m === "" ? "" : String(parts.m)}
          onChange={(e) => onMonth(e.target.value)}
          aria-label="月"
        >
          <option value="">月</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m} 月
            </option>
          ))}
        </select>
        <select
          id={`${idPrefix}-day`}
          className="dateSelect"
          value={parts.d === "" ? "" : String(parts.d)}
          onChange={(e) => onDay(e.target.value)}
          aria-label="日"
        >
          <option value="">日</option>
          {dayOptions.map((d) => (
            <option key={d} value={d}>
              {d} 日
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
