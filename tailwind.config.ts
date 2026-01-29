import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Soft, calming maternal palette
        lavender: {
          50: '#faf8ff',
          100: '#f3edff',
          200: '#e9deff',
          300: '#d6c4ff',
          400: '#bc9cff',
          500: '#a170ff',
          600: '#8b4cf7',
          700: '#7a3ae3',
          800: '#6630bf',
          900: '#54299c',
        },
        rose: {
          50: '#fff5f7',
          100: '#ffe8ed',
          200: '#ffd6df',
          300: '#ffb3c4',
          400: '#ff859f',
          500: '#ff5279',
          600: '#f02d5e',
          700: '#ca1d4a',
          800: '#a81c42',
          900: '#8d1c3d',
        },
        peach: {
          50: '#fff8f5',
          100: '#ffede5',
          200: '#ffdccc',
          300: '#ffc2a6',
          400: '#ff9e73',
          500: '#ff7a45',
          600: '#f05a24',
          700: '#ca451a',
          800: '#a33a19',
          900: '#86341a',
        },
        sage: {
          50: '#f6f9f6',
          100: '#e8f0e8',
          200: '#d1e1d1',
          300: '#adc9ad',
          400: '#82aa82',
          500: '#5f8c5f',
          600: '#4a724a',
          700: '#3d5c3d',
          800: '#344a34',
          900: '#2c3e2c',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': '50% 0%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': '50% 100%'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
