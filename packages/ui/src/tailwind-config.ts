import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af'
        }
      }
    }
  }
};

export default config;
