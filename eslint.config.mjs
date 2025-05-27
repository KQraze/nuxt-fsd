// @ts-nocheck
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettier from "eslint-plugin-prettier";
import * as eslintConfigPrettier from "eslint-config-prettier";

export default withNuxt(
  {
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    },
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/.nuxt",
      "**/.output",
      "**/*.d.ts",
    ],
  },
);
