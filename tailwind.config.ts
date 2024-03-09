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
        outset: "0px 1px 1px 0px rgba(255, 255, 255, 0.18) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.12) inset, 0px -0.5px 2px 0px rgba(0, 0, 0, 0.08) inset, 0px 0px 0px 0.5px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.05), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
        outsetDark: "0px 1px 1px 0px rgba(255, 255, 255, 0.08) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.04) inset, 0px 2px 4px 0px rgba(255, 255, 255, 0.08) inset, 0px 0px 0px 0.5px rgba(255, 255, 255, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.05), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
        outsetHover: "0px 1px 1px 0px rgba(255, 255, 255, 0.18) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.12) inset, 0px -0.5px 2px 0px rgba(0, 0, 0, 0.08) inset, 0px 0px 0px 0.5px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.05), 0px 0px 4px 0px rgba(0, 0, 0, 0.08)",
        // outsetHover: "0px 1px 1px 0px rgba(255, 255, 255, 0.18) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.12) inset, 0px -0.5px 2px 0px rgba(0, 0, 0, 0.08) inset, 0px 0px 0px 0.5px rgba(34, 197, 94, 0.08), 0px 1px 3px 0px rgba(34, 197, 94, 0.05), 0px 0px 2px 0px rgba(34, 197, 94, 0.12)",
      },
      keyframes: {},
    },
    nightwind: {
      colors: {
        white: "neutral.900",
        neutral: {
          50: "neutral.900",
          500: "neutral.400"
        },
        // green: {
        //   50: "green.50",
        //   100: "green.100",
        //   200: "green.200",
        //   300: "green.300",
        //   400: "green.400",
        //   500: "green.500",
        //   600: "green.600",
        //   700: "green.700",
        //   800: "green.800",
        //   900: "green.900",
        //   950: "green.950",
        // }
        // Color mappings go here
      },
      colorClasses: [
        "gradient",
      ],
    },
  },
  darkMode: "class",
  plugins: [require("nightwind")],
}
export default config
