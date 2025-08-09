import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(59,130,246,0.35), 0 0 18px rgba(59,130,246,0.25)",
      },
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        "bg-lift": "var(--bg-lift)",
        stroke: "var(--stroke)",
        brand: "var(--brand)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-sub": "var(--text-sub)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
