import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        embrace: {
          black:  "#1d1d1f",
          white:  "#ffffff",
          gray:   "#f5f5f7",
          border: "#d2d2d7",
          muted:  "#6e6e73",
          accent: "#e63946",
          gold:   "#d4af37",
          // Keep legacy aliases for compatibility
          dark:   "#1d1d1f",
          light:  "#f5f5f7",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight:   "-0.025em",
        normal:  "-0.01em",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
