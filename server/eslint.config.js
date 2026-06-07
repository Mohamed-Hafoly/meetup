import js from "@eslint/js"
import globals from "globals"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),

  {
    files: ["**/*.js"],
    extends: [js.configs.recommended ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",
      "no-undef": "error",

      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "warn",
      "no-duplicate-imports": "error",
    },
  },
])
