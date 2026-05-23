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
        cyber: {
          50:  "#e8fff8",
          100: "#c0ffed",
          200: "#80ffd9",
          300: "#33ffbe",
          400: "#00f5a0",
          500: "#00d97e",
          600: "#00b065",
          700: "#008a50",
          800: "#006b3f",
          900: "#004d2d",
        },
        neural: {
          50:  "#f0f4ff",
          100: "#dce5ff",
          200: "#b8cbff",
          300: "#85a4ff",
          400: "#4d70ff",
          500: "#1a3aff",
          600: "#0022f5",
          700: "#001bd4",
          800: "#0018ac",
          900: "#001689",
        },
        threat: {
          50:  "#fff0f0",
          100: "#ffdddd",
          200: "#ffbfbf",
          300: "#ff9090",
          400: "#ff5050",
          500: "#ff2020",
          600: "#ff0000",
          700: "#d70000",
          800: "#b10000",
          900: "#920000",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["'Space Grotesk'", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        glitch: "glitch 0.3s ease-in-out infinite",
        scanline: "scanline 4s linear infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 1px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
