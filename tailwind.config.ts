import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: "#FF6A00", bright: "#FF8A2B" },
        char: "#080604",
        cream: "#f5e6c8",
        termgreen: "#39FF14",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,106,0,0.5)",
        "glow-sm": "0 0 15px rgba(255,106,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
