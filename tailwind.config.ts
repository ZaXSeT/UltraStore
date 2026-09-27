import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F1EA",       // Warm Ivory
        surface: "#FFFFFF",      // Chalk
        ink: "#202724",          // Graphite
        muted: "#59635E",        // Slate Olive
        brand: {
          DEFAULT: "#184E46",    // Petrol Green
          soft: "#E4ECE6",       // Mist
        },
        accent: {
          DEFAULT: "#A84329",    // Burnt Orange
          soft: "#F4E5DC",       // Clay Wash
        },
        line: "#D9DDD5",         // Warm Grey
        control: "#78857C",      // Mid Slate
        error: "#A12D2D",        // Brick
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      }
    },
  },
  plugins: [],
};

export default config;
