// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
    modules: [
    '@nuxtjs/tailwindcss', 
    'nuxt-swiper'
  ],
  css: ['@/assets/css/tailwind.css'],
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  axios: {
    proxy: true,
  },
  runtimeConfig: {
    public: {
      tmdbBaseURL: "https://api.themoviedb.org/3/",
      tmdbApiKey: process.env.TMDB_API_KEY || "your_default_api_key",
    },
    
  },
  tailwindcss: { viewer: false },
  experimental: { payloadExtraction: true }


})
