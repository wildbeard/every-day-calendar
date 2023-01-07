/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  "overrides": [
    {
      "files": [
        "pages/**/*.vue",
        "layouts/**/*.vue",
      ],
      "rules": {
        "vue/multi-word-component-names": "off",
      },
    },
  ],
  "rules": {
    "vue/script-setup-uses-vars": "error",
    "vue/html-closing-bracket-newline": [
      "error",
      {
        "singleline": "never",
        "multiline": "never",
      },
    ],
    "vue/html-self-closing": [
      "error",
      {
        "html": {
          "void": "never",
          "normal": "never",
          "component": "always",
        },
      },
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        "singleline": {
          "max": 1,
        },
        "multiline": {
          "max": 1,
        },
      },
    ],
    "vue/no-multiple-template-root": "off",
    "max-len": [
      "error",
      {
        "code": 300,
        "ignorePattern": "d=\"([\\s\\S]*?)\"",
      },
    ],
    "no-return-assign": [
      "error",
      "except-parens",
    ],
    "no-plusplus": [
      "error",
      {
        "allowForLoopAfterthoughts": true,
      },
    ],
    "space-before-function-paren": "off",
    "semi": ["error", "always"],
    "comma-dangle": [
      "error",
      "always-multiline",
    ],
    "newline-per-chained-call": [
      "error",
      {
        "ignoreChainWithDepth": 1,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
