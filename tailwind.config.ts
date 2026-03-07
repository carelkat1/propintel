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
        bg: {
          DEFAULT: "#080c14",
          card: "#0c1220",
          input: "#0a0f1a",
          nav: "#0a0e18",
        },
        border: {
          DEFAULT: "#141c2e",
          hover: "#334155",
          nav: "#111827",
        },
        brand: {
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        score: {
          hot: "#ef4444",
          warm: "#f97316",
          watch: "#eab308",
          cold: "#22c55e",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
          dim: "#475569",
        },
        whatsapp: "#25D366",
        email: "#0ea5e9",
      },
      fontFamily: {
        sans: ["'Nunito Sans'", "sans-serif"],
        mono: ["'Azeret Mono'", "monospace"],
        heading: ["'Outfit'", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease both",
        "slide-in": "slideIn 0.25s ease",
        "slide-up": "slideUp 0.3s ease",
      },
    },
  },
  plugins: [],
};
export default config;
