module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:promise/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "promise"],
  reportUnusedDisableDirectives: true,
  rules: {
    eqeqeq: ["warn", "smart"],
    // disable main unused vars line
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn", // or error
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "func-style": ["warn"],
    "require-await": ["error"],
    "@typescript-eslint/no-floating-promises": "error",
    "import/no-default-export": "warn",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "prefer-const": ["warn", { destructuring: "all" }],
  },
};
