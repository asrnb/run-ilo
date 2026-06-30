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
        predawn: {
          50:  '#f0f3ff',
          100: '#dde3ff',
          200: '#c0ccff',
          300: '#93a4ff',
          400: '#6677ef',
          500: '#4451d4',
          600: '#3030b8',
          700: '#22229a',
          800: '#171870',  // deep navy
          900: '#0d0e2e',  // darkest predawn
          950: '#060718',
        },
        sunrise: '#f97057',  // warm coral
        mango:   '#ffb347',  // first-light gold
      },
      fontFamily: {
        display: ['var(--font-archivo)', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
