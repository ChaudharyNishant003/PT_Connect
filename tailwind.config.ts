import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1d4e5f",
          light: "#2c6e85",
          dark: "#153a47",
        },
      },
    },
  },
  plugins: [],
};

export default config;
