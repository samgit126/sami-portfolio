import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves project sites from /<repo>/, so the asset base has to be
// set at build time. Vercel and Netlify serve from the root and need nothing.
//   BASE_PATH=/samuel-portfolio/ npm run build
export default defineConfig({
    base: process.env.BASE_PATH ?? "/",
    plugins: [vue(), tailwindcss()],
    build: {
        target: "es2020",
    },
});
