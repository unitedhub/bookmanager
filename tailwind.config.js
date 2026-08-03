/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors kept for compatibility
        paper: "#f4f6fb",
        ink: "#1a1a2e",
        moss: "#6c63ff",
        clay: "#e05c6e",
        sand: "#f0f0f8",

        // New design system
        surface: "#ffffff",
        bg: "#f4f6fb",
        primary: "#6c63ff",
        "primary-light": "#ede9ff",
        "primary-dark": "#4f46e5",
        accent1: "#ffd6e0",   // soft pink
        accent2: "#d4f0e8",   // mint green
        accent3: "#fef3cd",   // pale yellow
        accent4: "#e8d5f5",   // lavender
        "text-main": "#1a1a2e",
        "text-muted": "#6b7280",
        "text-light": "#9ca3af",
        danger: "#e05c6e",
        "danger-light": "#fde8eb",
        success: "#10b981",
        "success-light": "#d1fae5",
        warning: "#f59e0b",
        "warning-light": "#fef3c7",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "'Times New Roman'", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(108,99,255,0.07)",
        "card-hover": "0 8px 30px rgba(108,99,255,0.14)",
        sidebar: "4px 0 20px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
