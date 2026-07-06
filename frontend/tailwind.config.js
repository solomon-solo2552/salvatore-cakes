/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: "#2B1810",
        cocoa: "#4A2E22",
        vanilla: "#FBF3E7",
        blush: "#D98C93",
        blushdark: "#B96872",
        gold: "#C9A15A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
