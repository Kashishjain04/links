module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '520px',
        // => @media (min-width: 520px) { ... }
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
