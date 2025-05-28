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
      },
    },
  },
  publicDir: "sounds", // Ensure sounds directory is copied to dist
});
