import { dirname } from "path";
import { fileURLToPath } from "url";
// eslint-disable-next-line import/no-extraneous-dependencies
import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dir,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "airbnb",
    "airbnb-typescript"
  ),
  ...compat.config({
    parserOptions: {
      project: "./tsconfig.json",
    },
  }),
  {
    rules: {
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/function-component-definition": ["off"],
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
