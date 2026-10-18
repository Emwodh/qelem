import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAFAFA",
          warm: "#F8F8F6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F4F4F5",
          inset: "#F9FAFB",
        },
        cobalt: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        studio: "0 4px 20px rgba(0, 0, 0, 0.03)",
        "studio-md": "0 8px 30px rgba(0, 0, 0, 0.04)",
        "studio-lg": "0 20px 50px rgba(0, 0, 0, 0.06)",
        "studio-float": "0 25px 60px -15px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
