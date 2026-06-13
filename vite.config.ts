import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/wanxia-data": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true
      },
      "/api/wanxia-cache": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true
      },
      "/api/open-meteo": {
        target: "https://historical-forecast-api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/open-meteo/, "")
      },
      "/api/air-quality": {
        target: "https://air-quality-api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/air-quality/, "")
      }
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    environmentOptions: {
      jsdom: {
        url: "http://127.0.0.1:5173/"
      }
    }
  }
});
