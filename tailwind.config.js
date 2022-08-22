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
      spacing: {
        'remScreen': 'calc(100vh - 3.5rem)',
      },
      minHeight: {
        'remScreen': 'calc(100vh - 3.5rem)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
