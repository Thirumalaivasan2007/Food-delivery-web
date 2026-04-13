/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff5a00",
        secondary: "#333333",
        veg: "#008000",
        nonveg: "#800000",
      },
    },
  },
  plugins: [],
}
