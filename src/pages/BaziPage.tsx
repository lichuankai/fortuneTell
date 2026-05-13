import { FortuneForm } from "../components/FortuneForm";
import { SYSTEM_PROMPT_BAZI } from "../fortune/prompts";

export function BaziPage() {
  return (
    <FortuneForm
      backTo="/"
      title="八字命理"
      subtitle="由 DeepSeek 大模型推演 · 仅供文化参考"
      systemPrompt={SYSTEM_PROMPT_BAZI}
      userLead="请为我进行八字命理分析。"
    />
  );
}
