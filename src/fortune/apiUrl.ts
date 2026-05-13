/**
 * 生产环境：静态资源站点上没有 Vite 代理，需在构建时设置 VITE_API_PROXY_URL，
 * 指向你部署的转发服务（见 server/deepseek-proxy.mjs），或 Nginx 反代同源 /api/deepseek。
 * 开发环境：留空则走同源 /api/deepseek，由 Vite 代理到 DeepSeek。
 */
export function deepseekChatCompletionsUrl(): string {
  const proxyOrigin = import.meta.env.VITE_API_PROXY_URL?.trim();
  if (proxyOrigin) {
    const root = proxyOrigin.replace(/\/+$/, "");
    return `${root}/api/deepseek/chat/completions`;
  }

  const raw = import.meta.env.BASE_URL ?? "/";
  const base = raw.endsWith("/") && raw.length > 1 ? raw.slice(0, -1) : raw.replace(/\/$/, "");
  return `${base}/api/deepseek/chat/completions`;
}
