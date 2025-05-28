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
            return "wheel-of-names/sounds/[name].[ext]"; // Ensure sounds folder is correctly referenced
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
  publicDir: "public", // Ensure public directory is copied to dist
});
