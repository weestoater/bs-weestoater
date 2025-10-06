/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTest.ts",
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/src/test-mocks/file-mock.ts",
    },
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "cypress/"],
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
        },
        assetFileNames: (assetInfo: { name?: string }) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/style.min.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
