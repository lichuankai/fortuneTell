export type LiuyaoFormState = {
  matter: string;
  category: string;
  method: string;
  refDate: string;
  refTime: string;
  numA: string;
  numB: string;
  manualNotes: string;
};

export function buildLiuyaoUserContent(params: LiuyaoFormState): string {
  const lines = [
    "请为我进行周易六爻占卜分析。",
    "",
    `所占之事：${params.matter.trim()}`,
    `占类侧重：${params.category}`,
    `起卦说明：${params.method}`,
  ];

  if (params.refDate.trim() && params.refTime.trim()) {
    lines.push(`参考公历时间（用于起卦）：${params.refDate.trim()} ${params.refTime.trim()}`);
  } else if (params.refDate.trim() || params.refTime.trim()) {
    lines.push(`参考公历时间（部分填写）：日期 ${params.refDate.trim() || "未填"}，时刻 ${params.refTime.trim() || "未填"}`);
  } else {
    lines.push("参考公历时间：未提供（若需时间起卦请说明你的假设）");
  }

  const na = params.numA.trim();
  const nb = params.numB.trim();
  if (na || nb) {
    lines.push(`报数（梅花等可用）：${na || "—"} 与 ${nb || "—"}`);
  }

  if (params.manualNotes.trim()) {
    lines.push("", "用户补充的卦象 / 摇卦记录 / 其他说明：", params.manualNotes.trim());
  }

  return lines.join("\n");
}
