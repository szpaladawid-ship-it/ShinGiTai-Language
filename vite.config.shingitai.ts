import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// ShinGiTai-owned Vite config candidate.
//
// This file is intentionally side-by-side with the current vite.config.ts.
// It is part of the Vite extraction spike and should not be treated as active
// until it is tested locally with build/dev.
//
// Test manually with:
// npx vite build --config vite.config.shingitai.ts
// npx vite dev --config vite.config.shingitai.ts

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    viteReact(),
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-start",
    ],
  },
});
