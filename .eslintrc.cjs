module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "archive"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  globals: {
    cy: "readonly",
    Cypress: "readonly",
    describe: "readonly",
    context: "readonly",
    it: "readonly",
    specify: "readonly",
    before: "readonly",
    beforeEach: "readonly",
    after: "readonly",
    afterEach: "readonly",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
