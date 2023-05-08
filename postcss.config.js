module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    purgecss: {
      content: [
        "./pages/**/*.{html,ts,tsx}",
        "./components/**/*.{html,ts,tsx,jsx}",
        "./forms/**/*.{html,ts,tsx}",
        "./modals/**/*.{html,ts,tsx}",
        "./config/**/*.{html,ts,tsx}",
        "./node_modules/react-tailwindcss-select/dist/index.esm.js",
        "./styles/**/*.{css}",
      ],
      safelist: ["html", "body"],
    },
    // ...(process.env.NODE_ENV === "production"
    //   ? { cssnano: { preset: "default" } }
    //   : {}),
  },
};
