import { deepseekChatCompletionsUrl } from "./apiUrl";

function looksLikeHtml(s: string): boolean {
  const t = s.trimStart().slice(0, 80).toLowerCase();
  return t.startsWith("<!doctype") || t.startsWith("<html") || t.startsWith("<head");
}

export async function callDeepSeekChat(systemPrompt: string, userContent: string): Promise<string> {
  const url = deepseekChatCompletionsUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
    }),
  });

  const raw = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch {
    const html = looksLikeHtml(raw);
    const hint404 =
      res.status === 404 || html
        ? " 常见原因：未通过 Vite 开发/预览服务器访问（直接打开 dist 或静态托管未配置转发时，/api/deepseek 会返回 HTML 404）；或部署子路径未与 Vite base 对齐。请使用 npm run dev / npm run preview，或为线上环境配置 API 反向代理。"
        : "";
    throw new Error(
      `接口返回非 JSON（HTTP ${res.status}）。请确认已在 .env 配置 DEEPSEEK_API_KEY，且通过可转发 /api/deepseek 的方式访问前端。${hint404}`
    );
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error?: { message?: string } }).error?.message ?? raw)
        : raw;
    throw new Error(msg || `请求失败（${res.status}）`);
  }

  const choices = (data as { choices?: { message?: { content?: string } }[] }).choices;
  const text = choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("模型未返回有效内容，请稍后重试。");
  }
  return text;
}
