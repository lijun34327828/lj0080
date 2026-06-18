/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          50: '#F5F3FF',
          100: '#E0DBFF',
          200: '#C4B5FD',
          500: '#6366F1',
          700: '#312E81',
          800: '#1E1B4B',
          900: '#141233',
          950: '#0A0920',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          300: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 30px rgba(245, 158, 11, 0.35)',
        'glow-ink': '0 0 40px rgba(99, 102, 241, 0.25)',
        'card': '0 10px 40px -10px rgba(30, 27, 75, 0.35)',
      },
      backgroundImage: {
        'grid-ink': 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)',
        'radial-glow': 'radial-gradient(ellipse at top, rgba(99,102,241,0.20), transparent 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
