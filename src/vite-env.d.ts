/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 生产构建时填写：DeepSeek 转发服务的根地址（含协议与域名，无末尾斜杠），如 https://api.xxx.com */
  readonly VITE_API_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
