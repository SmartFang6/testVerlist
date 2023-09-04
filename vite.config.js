import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 9527,
    open: true,
    proxy: {
      "/api": {
        target: "https://api.lanjuxiaoyuan.com",
        changeOrigin: true,
        ws: true,
        // rewrite: (path) => {
        //   return path.replace(/^\/api\/userManage/, "/userPermissionTest/");
        // },
      },
    },
  },
});
