import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Outfit: [300, 400, 500, 600, 700],
      'Press Start 2P': true,
    },
    display: 'swap',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});