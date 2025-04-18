/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Noto Sans TC", "Roboto", "Helvetica", "Arial", "sans-serif"],
      serif: ["Noto Sans TC", "Roboto", "Helvetica", "Arial", "sans-serif"],
      body: ["Noto Sans TC", "Roboto", "Helvetica", "Arial", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#F0F4F8",
        secondary: "#8698aa",
        buy: "#00b15d",
        sell: "#FF5B5A",
        error: "#92400e",
        warning: "#f97316",
        info: "#575958",
        success: "#4ade80",
      },
    },
  },
  plugins: [],
});
