/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#14243B',
        teal: { DEFAULT: '#20B8A5', dark: '#178C7D' },
        surface: '#F5F7FA',
        ink: '#202B3C',
        muted: '#64748B',
        line: '#E2E8F0'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: { card: '0 1px 3px rgba(20,36,59,.08), 0 1px 2px rgba(20,36,59,.04)' }
    }
  },
  plugins: []
};
