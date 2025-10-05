import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("ag-charts")) return "vendor-ag-charts";
            if (id.includes("ag-grid")) return "vendor-ag-grid";
            if (id.includes("react")) return "vendor-react";
            if (id.includes("bootstrap")) return "vendor-bootstrap";
            return "vendor"; // all other vendor modules
          }
          if (id.includes("pages/")) return "pages";
          if (id.includes("components/")) return "components";
        },
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || "";
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(fileName)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(fileName)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
  },
});
