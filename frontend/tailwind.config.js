/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: { 950: '#0a0e18', 900: '#0f131d', 800: '#171b26', 700: '#1c1f2a', 600: '#262a35' },
        neon: { cyan: '#4cd7f6', blue: '#3b82f6', violet: '#a78bfa', magenta: '#f472b6' },
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 28px rgba(76,215,246,.28)',
      },
    },
  },
  plugins: [],
}
