import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dmmono: ['"DM Mono"', 'monospace'], // Nutzt DM Mono, Fallback: Monospace
      },
      scale: {
        '200': '2.0', // Skaliert auf 200%
        '300': '3.0', // Skaliert auf 175%
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        gradient: "gradient 120s ease infinite",
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 0%' }, 
      '50%': { backgroundPosition: '100% 100%' },
        },
      },
      backgroundSize: {
        "200%": "200%",
      },
      transform: {
        'flip': 'rotateY(180deg)',
      },
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  plugins: [],
} satisfies Config;
