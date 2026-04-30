import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"
import svgr from "vite-plugin-svgr"
import basicSsl from "@vitejs/plugin-basic-ssl"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
  plugins: [react(), checker({ typescript: true }), svgr(), basicSsl()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://meetup.local:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 10000,
    environment: "jsdom",
    globals: true,
  },
})
