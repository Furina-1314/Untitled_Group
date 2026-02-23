import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lofi: {
          bg: '#f5f1eb',
          panel: '#fffaf5',
          accent: '#9a7aa0',
          text: '#43394a'
        }
      }
    }
  },
  plugins: []
};

export default config;
