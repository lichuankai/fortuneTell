import type { BirthFormState } from "./types";

/** 将表单历法值展开为发给模型的中文说明（表单内使用 solar / lunar 短值） */
export function formatCalendarForPrompt(calendar: string): string {
  if (calendar === "lunar") {
    return "农历（请在备注或「用户特别关注」中写清对应公历日期，以便准确排盘）";
  }
  if (calendar === "solar") {
    return "公历";
  }
  if (calendar.includes("农历")) {
    return "农历（请在备注或「用户特别关注」中写清对应公历日期，以便准确排盘）";
  }
  return calendar === "公历" ? "公历" : calendar || "公历";
}

export function buildBirthUserContent(lead: string, params: BirthFormState): string {
  const lines = [
    lead,
    "",
    `历法：${formatCalendarForPrompt(params.calendar)}`,
    `出生日期：${params.birthDate}`,
    `出生时刻：${params.birthTime}（24 小时制，以用户本地输入为准；若为夏令时请注明是否已自行换算）`,
    params.gender ? `性别：${params.gender}` : "性别：未说明（请按通用角度分析，必要时两处兼谈）",
    params.birthPlace.trim()
      ? `出生地 / 时区说明：${params.birthPlace.trim()}`
      : "出生地 / 时区：未提供（请按东八区标准时间推算并说明）",
    params.question.trim() ? `\n用户特别关注：${params.question.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
