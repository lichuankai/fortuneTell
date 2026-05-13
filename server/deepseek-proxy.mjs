/**
 * 独立 DeepSeek 转发服务（部署到与前端不同源或同机器另一端口均可）。
 * 环境变量：DEEPSEEK_API_KEY（必填）、PORT（默认 8787）
 * 启动：npm run proxy-server
 * 前端构建：VITE_API_PROXY_URL=https://你的代理域名 npm run build
 */
import http from "node:http";
const PORT = Number(process.env.PORT) || 8787;
const API_KEY = process.env.DEEPSEEK_API_KEY?.trim();

function corsHeaders(origin) {
  const allow = origin && origin !== "null" ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders(origin));
    res.end();
    return;
  }

  const pathOnly = (req.url || "").split("?")[0];
  if (req.method !== "POST" || pathOnly !== "/api/deepseek/chat/completions") {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  if (!API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) });
    res.end(JSON.stringify({ error: { message: "服务器未配置 DEEPSEEK_API_KEY" } }));
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    res.writeHead(400, corsHeaders(origin));
    res.end();
    return;
  }

  try {
    const r = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body,
    });
    const text = await r.text();
    res.writeHead(r.status, {
      "Content-Type": r.headers.get("content-type") || "application/json; charset=utf-8",
      ...corsHeaders(origin),
    });
    res.end(text);
  } catch (e) {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) });
    res.end(JSON.stringify({ error: { message: String(e?.message || e) } }));
  }
});

server.listen(PORT, () => {
  console.log(`DeepSeek proxy listening on http://127.0.0.1:${PORT}`);
  console.log(`转发路径 POST /api/deepseek/chat/completions`);
});
