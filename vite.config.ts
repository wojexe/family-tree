/// <reference types="vitest" />
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  plugins: [svelte(), basicSsl()],
  test: {
    globals: true,
    environment: "jsdom",
    includeSource: ["src/**/*.{js,ts,svelte}"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
