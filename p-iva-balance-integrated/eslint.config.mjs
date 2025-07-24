import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // 🚫 Ignore generated files and build directories
    ignores: [
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
      "node_modules/**/*",
      "public/**/*",
      ".env*",
      "**/*.min.js",
      "**/*.bundle.js"
    ]
  },
  {
    rules: {
      // 🔥 Elevate unused variables from warning to ERROR
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],

      // 🔥 Elevate unused expressions from warning to ERROR  
      "@typescript-eslint/no-unused-expressions": ["error", {
        "allowShortCircuit": false,
        "allowTaggedTemplates": false,
        "allowTernary": false
      }],

      // ✅ Keep existing strict rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-require-imports": "error",

      // 🔥 Additional TypeScript strict rules (verified available)
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-non-null-assertion": "warn", // Keep as warning for flexibility
      "@typescript-eslint/prefer-as-const": "error",

      // 🔥 General JavaScript best practices as errors
      "prefer-const": "error", // Native ESLint rule, not TypeScript specific
      "no-console": ["warn", { "allow": ["warn", "error"] }], // Allow console.warn/error
      "no-debugger": "error",
      "no-duplicate-case": "error",
      "no-empty": "error",
      "no-fallthrough": "error",
      "no-irregular-whitespace": "error",
      "no-unreachable": "error",
      "no-unsafe-negation": "error",
      "valid-typeof": "error"
    }
  },
  {
    // 🧪 Relax rules for test files
    files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Allow any in tests
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_|^mock",
        "caughtErrorsIgnorePattern": "^_"
      }]
    }
  },
  {
    // ⚙️ Relax rules for config files
    files: ["**/*.config.*", "**/jest.setup.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "warn", // Allow require in config files
      "@typescript-eslint/no-var-requires": "warn", // Allow require in config files
      "@typescript-eslint/no-empty-function": "warn" // Allow empty functions in setup
    }
  }
];

export default eslintConfig;
