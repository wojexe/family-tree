import { svelte } from "@sveltejs/vite-plugin-svelte";
import basicSsl from "@vitejs/plugin-basic-ssl";
/// <reference types="vitest" />
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), basicSsl()],
  test: {
    globals: true,
    environment: "jsdom",
    includeSource: ["src/**/*.{js,ts,svelte}"],
    setupFiles: ["./setupTest.ts"],
    coverage: {
      exclude: ["setupTest.ts"],
    },
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
