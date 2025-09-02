import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        archivo: ["Archivo", "sans-serif"],
      },
    },
    colors: {
      "100": "#EFF0D5",
      "200": "#E0E0B6",
      "300": "#C4D4AB",
      "350": "#A9C89F",
      "400": "#87B091",
      "500": "#799880",
      "600": "#6B7F6E",
      "700": "#5C665C",
      red: "#FF5050",
      redHover: "#E65E5E",
      gray: "#6B7280",
      white: "#FFFFFF",
      primary: "#171430",
    },
  },
  plugins: [],
} satisfies Config;
