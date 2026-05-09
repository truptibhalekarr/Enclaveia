/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff8f8",
          100: "#f8dedf",
          200: "#e3b4b6",
          300: "#d9a5a7"
        },
        wine: {
          50: "#fff4f7",
          100: "#f7d9e3",
          500: "#7a1739",
          600: "#6d1231",
          700: "#4b0b25",
          900: "#2c0618"
        },
        ink: "#381024",
        cream: "#fffaf7",
        sage: "#6d806b"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(75, 11, 37, 0.14)",
        line: "0 1px 0 rgba(75, 11, 37, 0.12)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
