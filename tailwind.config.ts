import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        muted: "#43556A",
        mist: "#F4F8FB",
        notice: "#F7F3EA",
        line: "#D7E2EA",
        bridge: "#1769E0",
        eucalypt: "#1E8A6A",
        violet: "#6B4FD8",
        amber: "#B7791F",
        danger: "#B64242"
      },
      fontFamily: {
        sans: ["var(--font-app)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
