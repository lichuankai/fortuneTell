import type { Gender } from "./types";

export type XingzuoFormState = {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: Gender;
  focus: string;
  question: string;
};

export function buildXingzuoUserContent(params: XingzuoFormState): string {
  const lines = [
    "请根据以下信息进行西方占星 / 星座方向的解读。",
    "",
    `公历生日：${params.birthDate}`,
    params.birthTime.trim()
      ? `出生时刻（24 小时制）：${params.birthTime}`
      : "出生时刻：未提供（上升与宫位无法精确，请主要依据太阳星座并说明局限）",
    params.birthPlace.trim() ? `出生地 / 时区：${params.birthPlace.trim()}` : "出生地 / 时区：未提供",
    params.gender ? `性别：${params.gender}` : "性别：未说明",
    `希望侧重的领域：${params.focus}`,
  ];
  if (params.question.trim()) {
    lines.push("", "用户具体问题或补充：", params.question.trim());
  }
  return lines.join("\n");
}
