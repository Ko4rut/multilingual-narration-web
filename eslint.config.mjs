import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/features/dashboard/**/*.{ts,tsx}"],
    rules: {
      "no-ternary": "error",
      curly: ["error", "all"],
    },
  },
  {
    files: ["src/features/dashboard/components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ArrowFunctionExpression",
          message: "Use function declarations or named function callbacks for dashboard rendering. Keep event handlers in hooks.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
