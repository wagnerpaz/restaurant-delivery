const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  mode: "jit",
  content: [
    "./pages/**/*.{html,ts,tsx}",
    "./components/**/*.{html,ts,tsx}",
    "./forms/**/*.{html,ts,tsx}",
    "./modals/**/*.{html,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      lato: ["Lato"],
    },
    colors: {
      "dark-100": "#4c5265",
      "dark-200": "#40445a",
      "dark-300": "#3d3e51",
      "dark-400": "#323949",
      "dark-500": "#212129",
      "light-high": "#DCDCDC",
      "light-medium": "#949494",
      "light-low": "#5E5E5E",
    },
    container: {},
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/istockphoto-515373062-612x612.jpg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
});
