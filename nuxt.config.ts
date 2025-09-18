// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Configuration pour Netlify avec SSR activé pour les API routes
  nitro: {
    preset: 'netlify',
    experimental: {
      wasm: false
    },
    routeRules: {
      '/api/**': { 
        cors: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    }
  },
  
  // Configuration pour éviter les problèmes de dépendances natives
  vite: {
    optimizeDeps: {
      exclude: ['oxc-parser', '@oxc-parser/binding-linux-x64-gnu']
    },
    build: {
      target: 'es2022'
    },
    esbuild: {
      target: 'es2022'
    }
  },
  
  // Configuration expérimentale pour éviter les problèmes oxc-parser
  experimental: {
    payloadExtraction: true
  },
  
  modules: [
    '@nuxtjs/tailwindcss'
    // 'nuxt-swiper' // Temporairement désactivé pour éviter les conflits
  ],
  css: ['@/assets/css/tailwind.css'],
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  axios: {
    proxy: true,
  },
  runtimeConfig: {
    // Variables privées côté serveur uniquement
    tmdbApiKey: process.env.TMDB_API_KEY || "your_default_api_key",
    tmdbBaseURL: "https://api.themoviedb.org/3/",
    
    // Variables publiques côté client
    public: {
      // Pas de clé API exposée côté client
    }
  },
  tailwindcss: { viewer: false }
})
