import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      backgroundColor: {
        "lime-green": "#02B9B0",
        "lime-gray": "#f9fcfc",
        "light-gray": "#f1f5f9",
        "back-purple": "#8318e7",
      },
      textColor: {
        "lime-green": "#02b9b0",
        "light-purple": "#8318e7",
        "status-gray": "#5f6969",
      },
    },
  },
  plugins: [],
} satisfies Config;
