<script setup>
    const { movies, type } = defineProps(['movies', 'type']);
    const resMovies = ref(movies);

    const { getGenres, getStarSymbol, getStarClass }  = useMoviesApi();

    const getGenresState = await getGenres(`${type}`);
    const genres = getGenresState.genres;
   
    const activeSlideIndex = ref(0);
    const containerRef = ref(null);
    
    const getTitle = (arrayId) => {
        const filteredObjects = computed(() => genres.filter(obj => arrayId.includes(obj.id)));
        return filteredObjects.value
    };

    // Fonction pour générer une URL d'image optimisée en fonction de la taille et du format
    const generateOptimizedImageUrl = (path, size) => {
        const baseUrl = 'https://image.tmdb.org/t/p/';
        const imageSize = {
            original: 'original',
            large: 'w1280',
            medium: 'w780',
            small: 'w300',
        };

        const optimizedPath = path ? path : '/w500null'; // Remplacer par un chemin d'image d'espace réservé

        return `${baseUrl}${imageSize[size]}${optimizedPath}`;
    };

    // Configuration du slider Swiper
    const swiper = useSwiper(containerRef, {
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 8000,
            disableOnInteraction: false
        },
        pagination: {
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        on: {
            slideChange: (swiper) => {
                activeSlideIndex.value = swiper.activeIndex;
            }
        }
    });

    onMounted(() => {
        console.log(swiper.instance)
    });
</script>
<template>
    <div class="relative h-screen min-h-[600px] overflow-hidden">
        <ClientOnly>
            <swiper-container ref="containerRef" :init="false" class="h-full w-full">
                <swiper-slide v-for="(movie, i) in movies" :key="i" class="relative h-screen min-h-[600px] overflow-hidden">
                    <!-- Image de fond avec effet parallax -->
                    <div class="absolute inset-0 z-0">
                        <picture class="w-full h-full">
                            <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'original')" media="(min-width: 768px)" sizes="100vw">
                            <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'medium')" media="(min-width: 480px) and (max-width: 768px)" sizes="50vw">
                            <source :srcset="generateOptimizedImageUrl(movie.poster_path, 'small')" media="(max-width: 480px)" sizes="100vw">
                            <img 
                                class="w-full h-full object-cover scale-110 transition-transform duration-[20s] ease-out" 
                                :src="generateOptimizedImageUrl(movie.poster_path, 'small')"
                                :alt="movie.original_title"
                                loading="lazy">
                        </picture>
                    </div>
                    
                    <!-- Overlay gradient moderne -->
                    <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent z-[1]"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[2]"></div>
                    
                    <!-- Contenu principal avec animation -->
                    <div class="absolute z-10 h-full w-full flex items-center">
                        <div class="container mx-auto px-6 lg:px-12">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                
                                <!-- Informations du film -->
                                <div class="space-y-8 animate-fade-in-up">
                                    <!-- Badge du film -->
                                    <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span class="text-white/90 text-sm font-medium">Actuellement à l'affiche</span>
                                    </div>
                                    
                                    <!-- Titre avec effet de texte -->
                                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                                        <span class="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                                            {{ movie.title || movie.name }}
                                        </span>
                                    </h1>
                                    
                                    <!-- Genres avec style moderne -->
                                    <div class="flex flex-wrap gap-3">
                                        <span 
                                            v-for="(title, j) in getTitle(movie.genre_ids)" :key="j"
                                            class="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105">
                                            <NuxtLink 
                                                :to="{query: {type: type , name: title.name.toLowerCase()}, path:`/genres/${title.id}`}"
                                                class="text-white text-sm font-medium relative z-10"
                                                role="link">{{ title.name }}</NuxtLink>
                                            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </span>
                                    </div>
                                    
                                    <!-- Note avec style premium -->
                                    <div class="flex items-center space-x-4">
                                        <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                            <div class="flex">
                                                <span v-for="star in 5" :key="star" 
                                                    :class="getStarClass(star, movie.vote_average)"
                                                    class="text-lg">{{ getStarSymbol(star, movie.vote_average) }}</span>
                                            </div>
                                            <span class="text-white font-semibold">{{ movie.vote_average.toFixed(1) }}</span>
                                        </div>
                                        <div class="text-white/70 text-sm">
                                            Basé sur {{ movie.vote_count }} avis
                                        </div>
                                    </div>
                                    
                                    <!-- Description avec style élégant -->
                                    <p class="text-white/90 text-lg leading-relaxed max-w-2xl">
                                        {{ movie.overview.substring(0, 180) }}...
                                    </p>
                                    
                                    <!-- Boutons d'action -->
                                    <div class="flex flex-col sm:flex-row gap-4">
                                        <NuxtLink 
                                            :to="`/${type}/${movie.id}`" 
                                            class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                                            <span class="relative z-10 flex items-center space-x-2">
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                                                </svg>
                                                <span>Regarder maintenant</span>
                                            </span>
                                            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </NuxtLink>
                                        
                                        <button class="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105">
                                            <span class="flex items-center space-x-2">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span>Plus d'infos</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Affiche du film avec effet 3D -->
                                <div class="hidden lg:flex justify-center items-center animate-fade-in-right">
                                    <div class="relative group">
                                        <div class="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                        <div class="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform group-hover:scale-105 transition-all duration-500">
                                            <img 
                                                :src="generateOptimizedImageUrl(movie.poster_path, 'medium')"
                                                :alt="movie.original_title"
                                                class="w-64 h-96 object-cover rounded-xl shadow-2xl">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
            </swiper-container>
        </ClientOnly>
    </div>
</template>

<style>
/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out 0.2s both;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Styles pour les étoiles */
.stars {
  color: #FFD700;
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
}

.star-empty {
  color: #CCC;
}

/* Styles Swiper modernes */
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Navigation personnalisée */
.swiper-button-next,
.swiper-button-prev {
  @apply text-white bg-white/10 backdrop-blur-sm border border-white/20 w-14 h-14 rounded-full transition-all duration-300 z-20 hover:bg-white/20 hover:scale-110;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  @apply shadow-2xl shadow-white/20;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  @apply text-2xl font-bold;
}

.swiper-button-next {
  @apply right-8;
}

.swiper-button-prev {
  @apply left-8;
}

/* Pagination personnalisée */
.swiper-pagination-bullet {
  @apply bg-white/30 w-3 h-3 mx-1.5 transition-all duration-300 rounded-full;
}

.swiper-pagination-bullet-active {
  @apply bg-white scale-125 shadow-lg shadow-white/50;
}

.swiper-pagination {
  @apply bottom-8 z-20;
}

/* Effets de survol pour les éléments interactifs */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Effet de texte dégradé amélioré */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Effet de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Animation de l'image de fond */
.scale-110 {
  transform: scale(1.1);
}

/* Effet de parallax pour l'image */
.parallax-bg {
  transform: scale(1.1);
  transition: transform 20s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .animate-fade-in-right {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
}
</style>