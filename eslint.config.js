import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // 1. GLOBAL IGNORES
  // This must be the first object and only contain 'ignores'
  {
    ignores: [
      "**/dist/**", 
      "**/node_modules/**", 
      "eslint.config.js",
      "drizzle.config.ts"
    ],
  },

  // 2. BASE CONFIGS
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // 3. TYPE-AWARE SETTINGS
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "vitest.config.ts", 
            "drizzle.config.ts", 
            "eslint.config.js"
          ],
        }, // The modern way for v10+
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 4. CUSTOM RULES
  {
    rules: {
      // The rule you requested
      "@typescript-eslint/no-unsafe-type-assertion": "error",
      
      // Recommended fixes for your 146 errors
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // 5. PRETTIER
  prettierConfig,
);