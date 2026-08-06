import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        archivo: ["Archivo Black", "sans-serif"],
      },
      // The brand palette lives under `extend` so Tailwind's default scales
      // (gray-700, red-500, ...) keep working alongside it.
      colors: {
        "100": "#EFF0D5",
        "200": "#E0E0B6",
        "300": "#C4D4AB",
        "350": "#A9C89F",
        "400": "#87B091",
        "500": "#799880",
        "600": "#6B7F6E",
        "700": "#5C665C",
        "800": "#243628",
        "900": "#1D241E",
        "950": "#1E211F",
        // Named `danger` rather than `red` so it doesn't shadow the default
        // red-* scale, which the previous config silently broke.
        danger: "#FF5050",
        dangerHover: "#E65E5E",
        primary: "#171430",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "scale-in": "scale-in 160ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
