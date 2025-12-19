/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import type { UserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import", "global-builtin", "color-functions"],
        quietDeps: true,
      },
    },
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.png", "assets/**/*.{jpg,png,webp,woff,woff2}"],
      manifest: {
        name: "Weestoater",
        short_name: "Weestoater",
        description: "Ian Burrett's personal website",
        theme_color: "#fd9402",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,webp,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTest.ts",
    exclude: ["node_modules", "dist", "e2e-tests/**"],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/src/test-mocks/file-mock.ts",
    },
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "cypress/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "backend/**",
        "ai-experiments/**",
        "scripts/**",
        "e2e-tests/**",
        "src/interfaces/**",
        "src/test-mocks/**",
        "src/__tests__/**",
        ".eslintrc.cjs",
        "playwright.config.ts",
        "vite.config.ts",
        "setupTest.ts",
        "src/main.tsx",
        "src/App.tsx",
        "src/content/react/utils.js",
        "src/content/about/ShapesDemo.tsx",
        "src/components/football/goalScorerDetails.tsx",
        "src/pages/SeasonPage.tsx",
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes("node_modules")) {
            if (id.includes("ag-charts")) return "vendor-ag-charts";
            if (id.includes("ag-grid")) return "vendor-ag-grid";
            if (id.includes("react")) return "vendor-react";
            if (id.includes("bootstrap")) return "vendor-bootstrap";
            return "vendor"; // all other vendor modules
          }
          // Split out football data by season for lazy loading
          if (id.includes("src/data/") && id.includes("-matches")) {
            const match = id.match(/(\d{4}-\d{2})-matches/);
            if (match) return `data-matches-${match[1]}`;
          }
          if (id.includes("src/data/") && id.includes("-goals")) {
            const match = id.match(/(\d{4}-\d{2})-goals/);
            if (match) return `data-goals-${match[1]}`;
          }
        },
        assetFileNames: (assetInfo: { name?: string }) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/style.min.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
    chunkSizeWarningLimit: 1000, // ag-grid and ag-charts are large but lazy-loaded
  },
});
