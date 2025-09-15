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
    <div class="component-app__wrap-sliderHero relative">
        <ClientOnly>
            <swiper-container ref="containerRef" :init="false" class="h-max w-full component-app__wrap-slider">
                <swiper-slide v-for="(movie, i) in movies" :key="i" class="component-app__wrap-slideHero relative">
                    <div class="absolute z-10 h-full slide-content">
                        <div class="w-full md:min-w-3xl md:max-w-3xl xl:pl-40 p-0 h-full flex items-center md:mr-auto md:ml-0 mx-auto">
                            <div class="px-6">
                                <h3 class="text-lg lg:text-4xl font-extrabold mb-3 lg:mb-5" :aria-label="movie.original_title">{{ movie.title || movie.name}}</h3>
                                
                                <ul class="flex flex-wrap mb-6">
                                    <li 
                                        v-for="(title, j) in getTitle(movie.genre_ids)" :key="j"
                                        class="border-b-4 border-blue-800 px-1 py-0"
                                        :class="{ 'mr-1' : j != getTitle(movie.genre_ids).length -1  }"> 
                                        <NuxtLink 
                                            :to="{query: {type: type , name: title.name.toLowerCase()}, path:`/genres/${title.id}`}"
                                            class="text-sm lg:text-base"
                                            role="link">{{ title.name }}</NuxtLink>
                                    </li>
                                </ul>
                                
                                <div class="precent-bar mb-6">
                                    <span class="precent-per flex">
                                        <span class="stars mr-3">
                                            <span v-for="star in 5" :key="star" 
                                                :class="getStarClass(star, movie.vote_average)"
                                                class="text-xl">{{ getStarSymbol(star, movie.vote_average) }}</span>
                                        </span>
                                    </span>
                                </div>

                                <p class="text-sm lg:text-base leading-normal mb-6" :aria-label="movie.overview.substring(0,200)+'...'">{{ movie.overview.substring(0,200)+".." }}</p>
                                <a 
                                    :href="`${type}/${movie.id}`" class="inline-block py-1 px-3 md:px-6 text-sm lg:text-base border-b-4 border-blue-800"
                                    aria-label="En savoir plus sur le film">
                                    <span>PLUS</span>
                                </a>
                            </div>
                        </div>
                    </div>
                        
                    <div class="component-app__aspect-ratio"></div>
                    <div class="component-app__linear-black"></div>
                    <picture>
                        <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'original')" media="(min-width: 768px)" sizes="100vw">
                        <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'medium')" media="(min-width: 480px) and (max-width: 768px)" sizes="50vw">
                        <source :srcset="generateOptimizedImageUrl(movie.poster_path, 'small')" media="(max-width: 480px)" sizes="100vw">
                        <img 
                            class="swiper-lazy" 
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
.component-app__wrap-sliderHero {
  height: 100vh;
  min-height: 600px;
}

.component-app__wrap-slider {
  height: 100%;
  width: 100%;
}

.component-app__wrap-slideHero {
  height: 100vh;
  min-height: 600px;
  position: relative;
  overflow: hidden;
}

.component-app__aspect-ratio {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.component-app__linear-black {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 1;
}

.slide-content {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.75s ease, transform 0.75s ease;
  z-index: 10;
}

.component-app__wrap-slideHero picture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.component-app__wrap-slideHero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stars {
  color: #FFD700; /* Couleur des étoiles jaunes */
}

.star-empty {
  color: #CCC; /* Couleur de l'étoile sans couleur */
}

/* Styles pour la pagination et navigation Swiper */
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-height: 600px;
}

.swiper-pagination-bullet {
  background: rgba(255, 255, 255, 0.5);
  width: 12px;
  height: 12px;
  margin: 0 6px;
  transition: all 0.3s ease;
}

.swiper-pagination-bullet-active {
  background: #fff;
  transform: scale(1.2);
}

.swiper-pagination {
  bottom: 30px !important;
  z-index: 20;
}

.swiper-button-next,
.swiper-button-prev {
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 20;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: scale(1.1);
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 20px;
  font-weight: bold;
}

.swiper-button-next {
  right: 30px;
}

.swiper-button-prev {
  left: 30px;
}
</style>