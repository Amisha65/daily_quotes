// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Vite dev server proxy: forward /api requests to local backend
    proxy: {
      "/api": {
        target: "http://localhost:5000", // change if your backend runs on a different port
        changeOrigin: true, // set Origin header to target
        secure: false, // accept self-signed certs (dev)
        ws: false, // set true only if you need websocket proxying
        // ensure path is forwarded exactly as /api/..., no rewrite needed for your server
        // but include rewrite example if you want to strip /api prefix:
        // rewrite: (path) => path.replace(/^\/api/, "/api")
      },
    },
    // optional: show helpful message when starting dev server
    // port: 5173, // only set if you want a fixed dev port
  },
});
