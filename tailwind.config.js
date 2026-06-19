/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      colors: {
        express: {
          DEFAULT: '#FF6B35',
          50: '#FFF3ED',
          100: '#FFE0CC',
          500: '#FF6B35',
          600: '#E85A26',
          700: '#C44615',
        },
        cold: {
          DEFAULT: '#06B6D4',
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
        },
        city: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        deep: {
          900: '#0A1628',
          800: '#0F2A4A',
          700: '#1E3A5F',
          600: '#2A4A73',
        },
      },
      keyframes: {
        'halo-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: '0.2', transform: 'translate(-50%, -50%) scale(1.4)' },
        },
        'danger-shake': {
          '0%, 100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '25%': { transform: 'translate(-50%, -50%) rotate(-2deg)' },
          '75%': { transform: 'translate(-50%, -50%) rotate(2deg)' },
        },
        'ripple': {
          '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'translate(-50%, -50%) scale(1.6)', opacity: '0' },
        },
        'float-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, -40%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'breath': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.15' },
        },
        'cold-fog': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.25' },
          '50%': { transform: 'translateY(-10px) translateX(5px)', opacity: '0.1' },
        },
      },
      animation: {
        'halo-pulse': 'halo-pulse 2s ease-in-out infinite',
        'danger-shake': 'danger-shake 0.6s ease-in-out infinite',
        'ripple': 'ripple 3s ease-out infinite',
        'float-in': 'float-in 0.4s ease-out both',
        'slide-up': 'slide-up 0.5s ease-out both',
        'breath': 'breath 4s ease-in-out infinite',
        'cold-fog': 'cold-fog 8s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
