module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
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
    "func-style": ["warn"],
    "require-await": ["error"],
    "@typescript-eslint/no-floating-promises": "error",
    "import/no-default-export": 2,
    "@typescript-eslint/strict-boolean-expressions": [
      "warn",
      { allowNullableObject: true },
    ],
  },
};
