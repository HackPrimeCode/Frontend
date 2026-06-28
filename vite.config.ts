import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        timeout: 60000,
        proxyTimeout: 60000,
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, _req, _res) => {
            proxyReq.setHeader("Connection", "close");
          });
          proxy.on("proxyReqWs", (proxyReq) => {
            proxyReq.setTimeout(0);
          });
          proxy.on("error", (err: any, _req: IncomingMessage, res: any) => {
            if (err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
              res.writeHead(502, { "Content-Type": "text/plain" });
              res.end("Сетевой стек бэкенда прогревается, обновите страницу.");
            }
          });
        },
      },
    },
  },
});
