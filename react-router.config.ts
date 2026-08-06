import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Server-side render by default, matching the previous Remix setup.
  ssr: true,
  // The Vercel preset restructures the server build for Vercel Functions
  // (build/server/nodejs_<config>/index.js), which the local `start` script
  // can't serve. Vercel sets VERCEL=1 during its builds, so only opt in there.
  presets: process.env.VERCEL ? [vercelPreset()] : [],
} satisfies Config;
