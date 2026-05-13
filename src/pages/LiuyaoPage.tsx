import { LiuyaoForm } from "../components/LiuyaoForm";
import { SYSTEM_PROMPT_LIUYAO } from "../fortune/prompts";

export function LiuyaoPage() {
  return (
    <LiuyaoForm
      backTo="/"
      title="六爻 · 周易"
      subtitle="问事占断 · DeepSeek 辅助解读 · 仅供文化参考"
      systemPrompt={SYSTEM_PROMPT_LIUYAO}
      submitLabel="起卦推演"
    />
  );
}
