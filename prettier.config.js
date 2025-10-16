/** @type {import("prettier").Config} */
const config = {
  bracketSpacing: true,
  arrowParens: "always",
  semi: false,
  trailingComma: "none",
  tabWidth: 2,
  useTabs: false,
  endOfLine: "auto",
  singleQuote: true,
  printWidth: 120,
  jsxSingleQuote: true,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
