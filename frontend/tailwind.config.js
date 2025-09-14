const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-red": "#dc143c",
        "brand-red-dark": "#8b0000",
        dark: "#121212",
        "light-dark": "#1a1a1a",
        "card-dark": "#222222",
        "primary-text": "#ffffff",
        "secondary-text": "#cccccc",
      },

      borderColor: {
        "brand-red-light": "rgba(220, 20, 60, 0.3)",
      },

      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
