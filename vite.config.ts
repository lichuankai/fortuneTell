import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/deepseek": {
          target: "https://api.deepseek.com",
          changeOrigin: true,
          rewrite: (path) => "/v1" + path.replace(/^\/api\/deepseek/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              const key = env.DEEPSEEK_API_KEY;
              if (key) {
                proxyReq.setHeader("Authorization", `Bearer ${key}`);
              }
            });
          },
        },
      },
    },
    preview: {
      proxy: {
        "/api/deepseek": {
          target: "https://api.deepseek.com",
          changeOrigin: true,
          rewrite: (path) => "/v1" + path.replace(/^\/api\/deepseek/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              const key = env.DEEPSEEK_API_KEY;
              if (key) {
                proxyReq.setHeader("Authorization", `Bearer ${key}`);
              }
            });
          },
        },
      },
    },
  };
});
