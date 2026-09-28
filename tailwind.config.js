/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        base: {
          950: "#05070d",
          900: "#0a0f1a",
          850: "#0d1424",
          800: "#111a2e",
          700: "#182238",
          600: "#22304d",
          border: "rgba(148, 178, 219, 0.12)",
        },
        accent: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          electric: "#5eb1ff",
        },
        risk: {
          low: "#22c55e",
          moderate: "#eab308",
          high: "#f97316",
          critical: "#ef4444",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(56, 189, 248, 0.15)",
        "glow-sm": "0 0 12px rgba(56, 189, 248, 0.12)",
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(rgba(148,178,219,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,178,219,0.05) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.14), transparent 60%)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.9" },
          "70%": { transform: "scale(1.8)", opacity: "0" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
