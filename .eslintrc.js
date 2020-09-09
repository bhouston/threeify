// eslint-disable-next-line no-undef
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "cflint", "import"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["*.md", "*.js"],
  rules: {
    "@typescript-eslint/ban-types": 1,
    "@typescript-eslint/explicit-function-return-type": 2,
    "@typescript-eslint/member-ordering": 2,
    "@typescript-eslint/naming-convention": [
      2,
      {
        selector: "default",
        format: ["camelCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
      {
        selector: "default",
        format: ["PascalCase"],
        modifiers: ["static"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "enumMember",
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/no-unnecessary-condition": 1,
    "@typescript-eslint/no-unsafe-call": 2,
    "@typescript-eslint/no-unsafe-member-access": 1,
    "@typescript-eslint/no-unsafe-return": 2,
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/prefer-nullish-coalescing": 2,
    "@typescript-eslint/strict-boolean-expressions": [
      2,
      { allowString: false, allowNumber: false, allowNullableObject: false },
    ],
    "@typescript-eslint/no-this-alias": 0,
    "consistent-this": [2, "that"],
    curly: [2, "all"],
    eqeqeq: "error",
    "import/newline-after-import": ["error", { count: 1 }],
    "max-len": [2, 120],
    "no-alert": 2,
    "no-invalid-this": 1,
    "no-var": 2,
    "no-unused-expressions": 2,
    quotes: ["error", "double"],
    "sort-imports": [
      0,
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
    "spaced-comment": 2,
  },
};
