/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "var(--navy)", 700: "var(--navy-700)" },
        blue: { DEFAULT: "var(--blue)", light: "var(--blue-light)" },
        slate: {
          DEFAULT: "var(--slate)",
          100: "var(--slate-100)",
          200: "var(--slate-200)",
          300: "var(--slate-300)",
        },
        teal: "var(--teal)",
        green: { DEFAULT: "var(--green)", bg: "var(--green-bg)" },
        amber: { DEFAULT: "var(--amber)", bg: "var(--amber-bg)" },
        red: { DEFAULT: "var(--red)", bg: "var(--red-bg)" },
        surface: "var(--surface)",
        bg: "var(--bg)",
        border: "var(--border)",
        text: { DEFAULT: "var(--text)", soft: "var(--text-soft)" },
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      fontFamily: {
        sans: [
          "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Inter", "Roboto",
          "Helvetica", "Arial", "sans-serif",
        ],
      },
      keyframes: {
        mcFadeIn: { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        mcSlideIn: { from: { opacity: 0, transform: "translateX(16px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        mcPop: { from: { opacity: 0, transform: "scale(.97)" }, to: { opacity: 1, transform: "scale(1)" } },
        mcRowIn: { from: { opacity: 0, transform: "translateY(-4px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        mcShimmer: { "0%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0 50%" } },
        mcSpin: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-in": "mcFadeIn .22s ease both",
        "slide-in": "mcSlideIn .28s cubic-bezier(.4,0,.2,1) both",
        pop: "mcPop .18s ease both",
        "row-in": "mcRowIn .25s ease both",
        shimmer: "mcShimmer 1.4s ease infinite",
        spin: "mcSpin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
