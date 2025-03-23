import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'gradient-slide': {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '100% 100%' },
        }
      },
      animation: {
        'gradient-slide': 'gradient-slide 3s linear infinite',
      },
      // ... other existing theme extensions
    },
  },
  plugins: [],
};

export default config; 