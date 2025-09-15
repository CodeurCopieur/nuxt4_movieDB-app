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
    <div class="relative h-screen min-h-[600px]">
        <ClientOnly>
            <swiper-container ref="containerRef" :init="false" class="h-full w-full">
                <swiper-slide v-for="(movie, i) in movies" :key="i" class="relative h-screen min-h-[600px] overflow-hidden">
                    <!-- Contenu du slide -->
                    <div class="absolute z-10 h-full w-full">
                        <div class="w-full md:min-w-3xl md:max-w-3xl xl:pl-40 p-0 h-full flex items-center md:mr-auto md:ml-0 mx-auto">
                            <div class="px-6">
                                <h3 class="text-lg lg:text-4xl font-extrabold mb-3 lg:mb-5 text-white" :aria-label="movie.original_title">{{ movie.title || movie.name}}</h3>
                                
                                <ul class="flex flex-wrap mb-6">
                                    <li 
                                        v-for="(title, j) in getTitle(movie.genre_ids)" :key="j"
                                        class="border-b-4 border-blue-800 px-1 py-0"
                                        :class="{ 'mr-1' : j != getTitle(movie.genre_ids).length -1  }"> 
                                        <NuxtLink 
                                            :to="{query: {type: type , name: title.name.toLowerCase()}, path:`/genres/${title.id}`}"
                                            class="text-sm lg:text-base text-white hover:text-blue-300 transition-colors"
                                            role="link">{{ title.name }}</NuxtLink>
                                    </li>
                                </ul>
                                
                                <div class="mb-6">
                                    <span class="flex">
                                        <span class="mr-3">
                                            <span v-for="star in 5" :key="star" 
                                                :class="getStarClass(star, movie.vote_average)"
                                                class="text-xl">{{ getStarSymbol(star, movie.vote_average) }}</span>
                                        </span>
                                    </span>
                                </div>

                                <p class="text-sm lg:text-base leading-normal mb-6 text-white" :aria-label="movie.overview.substring(0,200)+'...'">{{ movie.overview.substring(0,200)+".." }}</p>
                                <a 
                                    :href="`${type}/${movie.id}`" class="inline-block py-1 px-3 md:px-6 text-sm lg:text-base border-b-4 border-blue-800 text-white hover:text-blue-300 transition-colors"
                                    aria-label="En savoir plus sur le film">
                                    <span>PLUS</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Overlay gradient -->
                    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10 z-[1]"></div>
                    
                    <!-- Image de fond -->
                    <picture class="absolute inset-0 z-0">
                        <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'original')" media="(min-width: 768px)" sizes="100vw">
                        <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'medium')" media="(min-width: 480px) and (max-width: 768px)" sizes="50vw">
                        <source :srcset="generateOptimizedImageUrl(movie.poster_path, 'small')" media="(max-width: 480px)" sizes="100vw">
                        <img 
                            class="w-full h-full object-cover" 
                            :src="generateOptimizedImageUrl(movie.poster_path, 'small')"
                            :alt="movie.original_title"
                            loading="lazy">
                    </picture>
                </swiper-slide>
            </swiper-container>
        </ClientOnly>
    </div>
</template>

<style>
/* Styles pour les étoiles (nécessaires car ils utilisent des classes dynamiques) */
.stars {
  color: #FFD700;
}

.star-empty {
  color: #CCC;
}

/* Styles Swiper - seulement les styles personnalisés nécessaires */
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-pagination-bullet {
  @apply bg-white/50 w-3 h-3 mx-1.5 transition-all duration-300;
}

.swiper-pagination-bullet-active {
  @apply bg-white scale-110;
}

.swiper-pagination {
  @apply bottom-8 z-20;
}

.swiper-button-next,
.swiper-button-prev {
  @apply text-white bg-black/30 w-12 h-12 rounded-full transition-all duration-300 z-20;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  @apply bg-black/60 scale-110;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  @apply text-xl font-bold;
}

.swiper-button-next {
  @apply right-8;
}

.swiper-button-prev {
  @apply left-8;
}
</style>