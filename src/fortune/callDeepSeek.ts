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
    const hint401 =
      res.status === 401
        ? " HTTP 401 且非 JSON：多为未带有效 Authorization（请在运行转发服务的环境设置 DEEPSEEK_API_KEY 并重启，见 server/deepseek-proxy.mjs）；或请求被网关返回了 HTML/纯文本。注意：仅把密钥写在构建机 .env 不会注入线上静态页，密钥必须在代理进程或反代层生效。"
        : "";
    throw new Error(
      `接口返回非 JSON（HTTP ${res.status}）。本地开发请在 .env 配置 DEEPSEEK_API_KEY 并用 npm run dev / preview；线上需同源或 VITE_API_PROXY_URL 将 POST /api/deepseek/chat/completions 转发到 DeepSeek 或 Node 代理，且代理侧必须配置密钥。${hint404}${hint401}`
    );
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error?: { message?: string } }).error?.message ?? raw)
        : raw;
    const hint401 =
      res.status === 401
        ? " 开发：在项目根目录或 fortuneTell/.env.local 配置 DEEPSEEK_API_KEY（或 VITE_DEEPSEEK_API_KEY）后重启 npm run dev；生产：Nginx 须注入有效的 Authorization Bearer。"
        : "";
    throw new Error((msg || `请求失败（${res.status}）`) + hint401);
  }

  const choices = (data as { choices?: { message?: { content?: string } }[] }).choices;
  const text = choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("模型未返回有效内容，请稍后重试。");
  }
  return text;
}
