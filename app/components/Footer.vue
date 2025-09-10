<template>
  <footer class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 backdrop-blur-xl overflow-hidden">
    <!-- Effet de brillance futuriste -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-50"></div>
    
    <!-- Grille de points futuriste -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0); background-size: 20px 20px;"></div>
    </div>
    
    <!-- Particules flottantes améliorées -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-10 left-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
      <div class="absolute top-20 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-20 left-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-50" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-30" style="animation-delay: 3s;"></div>
      <div class="absolute bottom-1/3 left-1/3 w-1 h-1 bg-violet-400 rounded-full animate-pulse opacity-40" style="animation-delay: 4s;"></div>
    </div>
    
    <!-- Lignes de connexion futuristes -->
    <div class="absolute inset-0 opacity-10">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.3" />
            <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <path d="M0,20 Q25,10 50,20 T100,20" stroke="url(#lineGradient)" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,80 Q25,90 50,80 T100,80" stroke="url(#lineGradient)" stroke-width="0.5" fill="none" opacity="0.4"/>
      </svg>
    </div>
    
    <div class="relative container max-w-screen-lg max-w-screen-xl lg:max-w-7xl mx-auto md:py-16 py-12 px-6">
      <!-- Titre principal avec effet néon -->
      <h4 class="md:mb-8 mb-8 text-lg font-light text-slate-300 tracking-wide">
        © 2025 Empire Movies Nuxt4.Tous droits réservés
      </h4>
      
      <!-- Section technologie avec effet glassmorphism -->
      <div class="flex items-center md:mb-6 mb-8 text-sm">
        <span class="text-slate-400 font-medium">Made With</span>
        <NuxtLink 
          class="ml-3 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm hover:scale-105 relative overflow-hidden group" 
          to="https://nuxt.com/" 
          target="_blank"
          aria-label="Nuxt 4">
          <!-- Effet de brillance qui traverse -->
          <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span class="relative z-10">Nuxt 4</span>
        </NuxtLink>
      </div>
      
      <!-- Section données avec effet glassmorphism -->
      <div class="flex items-center flex-wrap md:mb-6 mb-8 text-sm">
        <span class="text-slate-400 font-medium">Data provided by</span>
        <NuxtLink 
          class="ml-3 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-300 hover:text-purple-200 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm hover:scale-105 relative overflow-hidden group" 
          to="https://www.themoviedb.org/" 
          target="_blank"
          aria-label="The Movie Database">
          <!-- Effet de brillance qui traverse -->
          <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span class="relative z-10">The Movie Database</span>
        </NuxtLink>
      </div>
      
      <!-- Navigation principale avec design futuriste -->
      <nav class="flex justify-start md:mb-8 mb-8 text-sm">
        <ul class="flex flex-wrap flex-row gap-1 md:gap-2">
          <li class="pr-1">
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-slate-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 backdrop-blur-sm hover:scale-105" 
              to="/" 
              aria-label="Accueil">
              Accueil
            </NuxtLink>
          </li>
          <li class="pr-1">
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-slate-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 backdrop-blur-sm hover:scale-105" 
              to="/movie" 
              aria-label="Films">
              Movie
            </NuxtLink>
          </li>
          <li class="pr-1">
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-slate-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 backdrop-blur-sm hover:scale-105" 
              to="/tv" 
              aria-label="Séries TV">
              Séries TV
            </NuxtLink>
          </li>
          <li class="pr-1">
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-slate-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 backdrop-blur-sm hover:scale-105" 
              to="/search" 
              aria-label="Recherche">
              Recherche
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-slate-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 backdrop-blur-sm hover:scale-105" 
              to="/genres" 
              aria-label="Genres">
              Genres
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- Navigation sociale avec design cyberpunk -->
      <nav class="flex justify-end text-sm">
        <ul class="flex flex-wrap md:flex-nowrap flex-row gap-2 md:gap-3">
          <li>
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 backdrop-blur-sm hover:scale-105" 
              to="https://twitter.com/CodeurCopieur" 
              target="_blank" 
              aria-label="Twitter">
              Twitter
            </NuxtLink>
          </li>
          <li class="border-l border-slate-600/50 md:pl-3 pl-2">
            <NuxtLink 
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/30 text-gray-300 hover:text-gray-200 hover:border-gray-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/30 backdrop-blur-sm hover:scale-105" 
              to="https://github.com/CodeurCopieur" 
              target="_blank" 
              aria-label="Github">
              Github
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>