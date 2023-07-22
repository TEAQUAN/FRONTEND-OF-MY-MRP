/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
          primary: "#171717",
          secondary: "#272727",
          "dark-subtle": "rgba(255, 255, 255,0.5)",
          "light-subtle": "rgba(255, 255, 255,0.5)"
      }
    },
  },
  plugins: [],
}