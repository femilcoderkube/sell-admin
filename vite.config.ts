import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

import javascriptObfuscator from "vite-plugin-javascript-obfuscator";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Sell Admin",
        short_name: "Sell Admin",
        scope: "/",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 3000000,
      },
    }),
    javascriptObfuscator({
      options: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        rotateStringArray: true,
        stringArrayEncoding: ['rc4'],
        stringArrayThreshold: 0.75,
        splitStrings: true,
        // disableConsoleOutput: false,
        // debugProtection: isProduction ? true : false,
        target: "browser",
      },
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules/**",
        "public/**",
        "src/**/*.test.{js,jsx,ts,tsx}",
      ],
      apply: "build",
    }),

  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/socket.io": {
        // target: "https://devnode.coderkubes.com",
        target: "https://staging-backend.primeeleague.com",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  commonjsOptions: {
    esmExternals: true,
  },
});
