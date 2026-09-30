import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist", "node_modules", "coverage"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/no-danger": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // Aturan 1.1: dependensi hanya mengarah ke bawah.
  // components/ui tidak boleh mengimpor dari features atau services.
  {
    files: ["src/components/ui/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/**", "**/services/**"],
              message:
                "components/ui tidak boleh mengimpor dari features atau services (aturan 1.1).",
            },
          ],
        },
      ],
    },
  },
  // services adalah pintu data murni: tanpa React, UI, atau features.
  {
    files: ["src/services/**/*.js"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-*", "**/components/**", "**/features/**"],
              message:
                "services tidak boleh mengimpor React, UI, atau features (aturan 1.1).",
            },
          ],
        },
      ],
    },
  },
];
