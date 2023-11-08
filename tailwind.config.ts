import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--inter)', 'sans-serif'],
      serif: ['var(--libre-caslon-condensed)', 'serif'],
    },
    extend: {
      boxShadow: {
        outset: "0px 1px 1px 0px rgba(255, 255, 255, 0.18) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.05) inset, 0px -0.5px 2px 0px rgba(0, 0, 0, 0.08) inset, 0px 0px 0px 0.5px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.05), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)"
      }
    },
  },
  plugins: [],
}
export default config
