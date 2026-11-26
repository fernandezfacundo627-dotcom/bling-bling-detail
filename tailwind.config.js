/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#09090B',
        surface: '#121215',
        'surface-subtle': '#18181C',
        'surface-hover': '#1F1F24',
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'border-active': 'rgba(255, 255, 255, 0.18)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
