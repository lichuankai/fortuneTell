export type TarotFormState = {
  matter: string;
  spread: string;
  deckNote: string;
  manualCards: string;
  seedNote: string;
};

export function buildTarotUserContent(params: TarotFormState): string {
  const lines = [
    "请为我进行塔罗占卜解读。",
    "",
    `占卜问题：${params.matter.trim()}`,
    `牌阵 / 张数设定：${params.spread}`,
    `牌系偏好：${params.deckNote}`,
  ];
  if (params.manualCards.trim()) {
    lines.push("", "用户已抽好或指定的牌面（含位置与正逆）：", params.manualCards.trim());
  } else {
    lines.push("", "用户未提供实体牌面，请你按约定方式模拟抽牌并列出结果。");
  }
  if (params.seedNote.trim()) {
    lines.push("", "用于抽牌的参考数字或说明（可选）：", params.seedNote.trim());
  }
  return lines.join("\n");
}
