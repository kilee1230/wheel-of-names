import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/wheel-of-names/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".wav")) {
            return "sounds/[name].[ext]";
          }
          return "assets/[name].[ext]";
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("Wheel")) {
            return "wheel";
          }
          if (id.includes("NameEntries")) {
            return "name-entries";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjusted chunk size warning limit
  },
  publicDir: "public", // Use publicDir to copy sounds folder to dist
});
