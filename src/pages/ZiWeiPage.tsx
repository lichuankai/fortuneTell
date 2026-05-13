import { FortuneForm } from "../components/FortuneForm";
import { SYSTEM_PROMPT_ZIWEI } from "../fortune/prompts";

export function ZiWeiPage() {
  return (
    <FortuneForm
      backTo="/"
      title="紫微斗数"
      subtitle="由 DeepSeek 大模型推演 · 仅供文化参考"
      systemPrompt={SYSTEM_PROMPT_ZIWEI}
      userLead="请为我进行紫微斗数命盘分析。"
      submitLabel="起紫微盘"
    />
  );
}
