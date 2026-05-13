import { XingzuoForm } from "../components/XingzuoForm";
import { SYSTEM_PROMPT_XINGZUO } from "../fortune/prompts";

export function XingzuoPage() {
  return (
    <XingzuoForm
      backTo="/"
      title="占星 · 星座"
      subtitle="西方占星视角 · DeepSeek 辅助解读 · 仅供文化参考"
      systemPrompt={SYSTEM_PROMPT_XINGZUO}
      submitLabel="生成解读"
    />
  );
}
