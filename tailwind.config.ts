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
        primary: {
          50: "#E6F4F7",
          100: "#CCE9EF",
          200: "#99D3DF",
          300: "#66BDCF",
          400: "#33A7BF",
          500: "#006B7F",
          600: "#005566",
          700: "#00404D",
          800: "#002B33",
          900: "#00151A",
        },
        secondary: {
          50: "#E7EAED",
          100: "#CFD5DB",
          200: "#9FABB7",
          300: "#6E8193",
          400: "#3E576F",
          500: "#0F1E2E",
          600: "#0C1824",
          700: "#09121B",
          800: "#060C11",
          900: "#030608",
        },
        signal: {
          50: "#E6F7EE",
          100: "#CCEFDC",
          200: "#99DFBA",
          300: "#66CF97",
          400: "#33BF75",
          500: "#00994D",
          600: "#007A3E",
          700: "#005C2E",
          800: "#003D1F",
          900: "#001F0F",
        },
        warm: {
          50: "#FBF6ED",
          100: "#F6ECDB",
          200: "#EDD9B7",
          300: "#E4C693",
          400: "#DBB36F",
          500: "#C8963E",
          600: "#A07832",
          700: "#785A25",
          800: "#503C19",
          900: "#281E0C",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "Noto Sans SC", "system-ui", "sans-serif"],
        sans: ["Source Sans 3", "Noto Sans SC", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-up-sm": "slideUp 0.4s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
};

export default config;
