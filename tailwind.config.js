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
        cream: '#FFF8F0',
        warm: {
          50: '#FFF5E8',
          100: '#FFE6C9',
          200: '#F5A65B',
          300: '#E88A3A',
          400: '#D4711F',
          500: '#B85B0E',
        },
        matcha: {
          50: '#F2F8EA',
          100: '#D9ECC1',
          200: '#88B04B',
          300: '#6A8E37',
          400: '#4E6B25',
        },
        rose: {
          cat: '#E8B4B8',
          catDark: '#C48A8F',
        },
        cocoa: {
          50: '#F5EFE8',
          100: '#8B6B4D',
          200: '#6B4423',
          300: '#4A2E15',
        }
      },
      fontFamily: {
        cute: ['"ZCOOL KuaiLe"', '"Ma Shan Zheng"', 'cursive'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(245, 166, 91, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(245, 166, 91, 0.8)' },
        },
      }
    },
  },
  plugins: [],
};
