import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        accent: {
          DEFAULT: "#007AFF",
          50: "#EBF4FF",
          100: "#D0E8FF",
          200: "#A1D1FF",
          300: "#66B5FF",
          400: "#3D9EFF",
          500: "#007AFF",
          600: "#0062CC",
          700: "#004A99",
          800: "#003366",
          900: "#001A33",
        },
        surface: {
          DEFAULT: "#F5F5F7",
          card: "#FFFFFF",
          elevated: "#FBFBFD",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        card: "0 2px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)",
        "card-hover":
          "0 8px 40px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06)",
        glow: "0 0 20px rgba(0, 122, 255, 0.15)",
      },
      animation: {
        "ring-fill": "ringFill 1.2s ease-out forwards",
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.2s ease-out forwards",
      },
      keyframes: {
        ringFill: {
          "0%": { strokeDashoffset: "251.2" },
          "100%": { strokeDashoffset: "var(--target-offset)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
