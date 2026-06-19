import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" hace que funcione tanto en la raíz (Netlify) como
// bajo una subcarpeta (GitHub Pages: usuario.github.io/bitacora/)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
