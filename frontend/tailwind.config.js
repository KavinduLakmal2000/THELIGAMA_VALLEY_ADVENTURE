/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "Impact", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        ui: ["'Syne'", "sans-serif"],
      },
      colors: {
        brand: {
          cyan: "#06b6d4",
          teal: "#14b8a6",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
