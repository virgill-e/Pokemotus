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
  app: {
    head: {
      title: 'Pokemotus - Le Motus des Pokémon',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Devinez le nom du Pokémon du jour en 6 essais. Un nouveau défi quotidien pour les fans de Pokémon, inspiré par Motus et Wordle.' },
        { name: 'keywords', content: 'pokemotus, pokemon motus, pokemon wordle, jeu pokemon, deviner nom pokemon, pokemon du jour' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#c00000' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://pokemotus.virgill-e.com' },
        { property: 'og:title', content: 'Pokemotus - Le Motus des Pokémon' },
        { property: 'og:description', content: 'Un Pokémon à deviner chaque jour. Serez-vous capable de trouver le Pokémon mystère ?' },
        { property: 'og:image', content: '/logo.png' },
        // Twitter
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: 'https://pokemotus.virgill-e.com' },
        { property: 'twitter:title', content: 'Pokemotus - Le Motus des Pokémon' },
        { property: 'twitter:description', content: 'Un Pokémon à deviner chaque jour. Serez-vous capable de trouver le Pokémon mystère ?' },
        { property: 'twitter:image', content: '/logo.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});