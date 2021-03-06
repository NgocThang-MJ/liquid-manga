const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "500px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        top: "#0f2027",
        middle: "#203a43",
        bottom: "#2c5364",
      },
      lineClamp: {
        10: "10",
      },
      fontFamily: {
        dancing: ["Dancing Script, cursive"],
      },
      width: {
        "half-screen": "50vw",
        "3-quarter-screen": "75vw",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
