/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        primary: {
          DEFAULT: '#FF6B95', // Pink
          dark: '#E84C7B',
          light: '#FFB5C9',
        },
        secondary: {
          DEFAULT: '#5C8AE6', // Blue
          dark: '#3A6AC8',
          light: '#A3BFFA',
        },
        accent: {
          DEFAULT: '#60D8C1', // Teal
          dark: '#38B2A0',
          light: '#A2F0E2',
        },
        // UI colors
        background: {
          DEFAULT: '#FFFFFF',
          alt: '#F7F9FC',
        },
        text: {
          DEFAULT: '#333333',
          light: '#71717A',
          lighter: '#A1A1AA',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'button': '0 4px 14px -3px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
} 