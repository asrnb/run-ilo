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
        // Warm deep darks — tropical predawn, not cold navy
        predawn: {
          50:  '#f8f4ec',
          100: '#f0e8d4',
          200: '#dfd0b8',
          300: '#c8a886',
          400: '#a87f60',
          500: '#7a5c3e',
          600: '#473520',
          700: '#2e2218',
          800: '#1c1610',
          900: '#0e0b08',
          950: '#050302',
        },
        sunrise:  '#f97057',  // warm coral — primary CTA
        mango:    '#ffb347',  // golden yellow — marathon highlight
        festival: '#16c25e',  // vibrant green — local fiesta energy
        love:     '#f43f5e',  // rose red — City of Love, Iloilo
        royal:    '#4a90e2',  // bright sky blue — Iloilo sky
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
