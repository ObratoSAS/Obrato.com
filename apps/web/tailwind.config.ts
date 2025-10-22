import type { Config } from 'tailwindcss';
import base from '@obrato/ui/tailwind-config';

const config: Config = {
  presets: [base],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ]
};

export default config;
