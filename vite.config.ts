import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// ShinGiTai-owned Vite config switch-test.
//
// This branch intentionally replaces the generated Lovable config so we can
// test whether the app can build and run from direct project dependencies.
// Do not merge this branch until local build/dev validation passes.

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
