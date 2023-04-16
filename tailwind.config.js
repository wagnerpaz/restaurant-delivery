const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./pages/**/*.{html,ts,tsx}",
    "./components/**/*.{html,ts,tsx,jsx}",
    "./forms/**/*.{html,ts,tsx}",
    "./modals/**/*.{html,ts,tsx}",
    "./config/**/*.{html,ts,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    fontFamily: {
      lato: ["Lato"],
    },
    colors: {
      hero: "var(--color-hero)",
      "hero-a11y-high": "var(--color-hero-a11y-high)",
      "hero-a11y-medium": "var(--color-hero-a11y-medium)",
      "hero-a11y-low": "var(--color-hero-a11y-low)",
      "main-100": "var(--color-main-100)",
      "main-200": "var(--color-main-200)",
      "main-300": "var(--color-main-300)",
      "main-400": "var(--color-main-400)",
      "main-500": "var(--color-main-500)",
      menu: "var(--color-menu)",
      "menu-a11y": "var(--color-menu-a11y)",
      "contrast-high": "var(--color-contrast-high)",
      "contrast-medium": "var(--color-contrast-medium)",
      "contrast-low": "var(--color-contrast-low)",
      "main-a11y-high": "var(--color-main-a11y-high)",
      "main-a11y-medium": "var(--color-main-a11y-medium)",
      "main-a11y-low": "var(--color-main-a11y-low)",
      "contrast-a11y-high": "var(--color-contrast-a11y-high)",
      "contrast-a11y-medium": "var(--color-contrast-a11y-medium)",
      "contrast-a11y-low": "var(--color-contrast-a11y-low)",
      money: "var(--color-money)",
    },
    container: {},
    extend: {
      backgroundImage: {
        "hero-pattern": "var(--pattern-hero)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
});
