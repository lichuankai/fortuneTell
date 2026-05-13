import { TarotForm } from "../components/TarotForm";
import { SYSTEM_PROMPT_TAROT } from "../fortune/prompts";

export function TarotPage() {
  return (
    <TarotForm
      backTo="/"
      title="塔罗牌"
      subtitle="牌阵与牌意 · DeepSeek 辅助解读 · 仅供文化参考"
      systemPrompt={SYSTEM_PROMPT_TAROT}
      submitLabel="开牌解读"
    />
  );
}
