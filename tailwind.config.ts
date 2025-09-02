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
      "400": "#87B091",
      primary: "#171430",
      red: "#FF0000",
    },
  },
  plugins: [],
} satisfies Config;
