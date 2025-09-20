<script setup>
    const { movies, type } = defineProps(['movies', 'type']);
    const resMovies = ref(movies);

    const { getGenres, getStarSymbol, getStarClass }  = useMoviesApi();

    const getGenresState = await getGenres(`${type}`);
    const genres = getGenresState.genres;
   
    const activeSlideIndex = ref(0);
    const swiperInstance = ref(null);
    const startIndex = ref(0);
    const itemsPerPage = ref(5); // 5 miniatures par ligne sur mobile/tablette
    
    const getTitle = (arrayId) => {
        const filteredObjects = computed(() => genres.filter(obj => arrayId.includes(obj.id)));
        return filteredObjects.value
    };

    // Computed pour les miniatures visibles sur mobile/tablette
    const visibleThumbs = computed(() => {
        return movies.slice(startIndex.value, startIndex.value + itemsPerPage.value);
    });

    // Fonctions de navigation pour mobile/tablette
    const goToPreviousSlide = () => {
        if (activeSlideIndex.value > 0) {
            const newIndex = activeSlideIndex.value - 1;
            goToSlide(newIndex);
            
            // Ajuster startIndex si nécessaire pour garder la miniature active visible
            if (newIndex < startIndex.value) {
                startIndex.value = Math.max(0, newIndex - (newIndex % 5));
            }
        }
    };

    const goToNextSlide = () => {
        if (activeSlideIndex.value < movies.length - 1) {
            const newIndex = activeSlideIndex.value + 1;
            goToSlide(newIndex);
            
            // Ajuster startIndex si nécessaire pour garder la miniature active visible
            const endIndex = startIndex.value + itemsPerPage.value - 1;
            if (newIndex > endIndex) {
                startIndex.value = Math.min(movies.length - itemsPerPage.value, newIndex - (newIndex % 5));
            }
        }
    };

    // Fonctions pour naviguer par groupes de 5 avec boucle
    const goToPreviousGroup = () => {
        let newStartIndex = startIndex.value - itemsPerPage.value;
        
        // Si on est au premier groupe, aller au dernier groupe (boucle)
        if (newStartIndex < 0) {
            // Calculer le dernier groupe complet
            const lastGroupStart = Math.floor((movies.length - 1) / itemsPerPage.value) * itemsPerPage.value;
            newStartIndex = lastGroupStart;
        }
        
        startIndex.value = newStartIndex;
        
        // Aller au premier slide du nouveau groupe
        goToSlide(newStartIndex);
    };

    const goToNextGroup = () => {
        let newStartIndex = startIndex.value + itemsPerPage.value;
        
        // Si on dépasse le dernier groupe, revenir au premier groupe (boucle)
        if (newStartIndex >= movies.length) {
            newStartIndex = 0;
        }
        
        startIndex.value = newStartIndex;
        
        // Aller au premier slide du nouveau groupe
        goToSlide(newStartIndex);
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

    // Fonction pour changer de slide depuis les miniatures
    const goToSlide = (index) => {
        console.log('Clic sur miniature:', index);
        
        // Vérifier que l'index est valide
        if (index < 0 || index >= movies.length || isNaN(index)) {
            console.error('Index invalide:', index);
            return;
        }
        
        if (swiperInstance.value) {
            try {
                // Arrêter l'autoplay
                if (swiperInstance.value.autoplay) {
                    swiperInstance.value.autoplay.stop();
                }
                
                // Aller au slide en utilisant slideToLoop pour le mode loop
                swiperInstance.value.slideToLoop(index, 500);
                
                // Ne pas mettre à jour l'index immédiatement, laisser slideChange le faire
                // pour éviter les conflits avec le mode loop
                
                // Redémarrer l'autoplay après 3 secondes
                setTimeout(() => {
                    if (swiperInstance.value && swiperInstance.value.autoplay) {
                        swiperInstance.value.autoplay.start();
                    }
                }, 3000);
                
            } catch (error) {
                console.error('Erreur avec swiper:', error);
                // Fallback: mettre à jour l'index manuellement
                activeSlideIndex.value = index;
            }
        } else {
            console.error('Swiper instance non disponible');
            activeSlideIndex.value = index;
        }
    };

    onMounted(() => {
        // Attendre que le DOM soit prêt
        nextTick(() => {
            // Délai plus long pour s'assurer que tout est chargé
            setTimeout(async () => {
                try {
                    console.log('Début de l\'initialisation Swiper...');
                    
                    // Vérifier que le conteneur existe
                    const container = document.querySelector('.swiper-container');
                    if (!container) {
                        console.error('Conteneur Swiper non trouvé');
                        return;
                    }
                    
                    // Importer Swiper de manière simple
                    const SwiperModule = await import('swiper');
                    const Swiper = SwiperModule.default;
                    
                    // Initialiser Swiper avec configuration de base (sans modules pour éviter les erreurs)
                    swiperInstance.value = new Swiper('.swiper-container', {
                        spaceBetween: 0,
                        loop: true,
                        autoplay: {
                            delay: 8000,
                            disableOnInteraction: false
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev'
                        },
                        on: {
                            slideChange: (swiper) => {
                                // Utiliser realIndex pour le mode loop, sinon activeIndex
                                const currentIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
                                console.log('Slide changé vers:', currentIndex, 'realIndex:', swiper.realIndex, 'activeIndex:', swiper.activeIndex);
                                activeSlideIndex.value = currentIndex;
                                
                                // Ajuster startIndex pour mobile/tablette
                                const endIndex = startIndex.value + itemsPerPage.value - 1;
                                if (currentIndex > endIndex) {
                                    startIndex.value = Math.min(movies.length - itemsPerPage.value, currentIndex - (currentIndex % 5));
                                } else if (currentIndex < startIndex.value) {
                                    startIndex.value = Math.max(0, currentIndex - (currentIndex % 5));
                                }
                            },
                            init: (swiper) => {
                                console.log('Swiper initialisé avec succès');
                                const currentIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
                                activeSlideIndex.value = currentIndex;
                            }
                        }
                    });
                    
                } catch (error) {
                    console.error('Erreur lors de l\'initialisation de Swiper:', error);
                }
            }, 500); // Délai plus long
        });
    });
</script>
<template>
    <div class="relative md:h-screen min-h-[100dvh] overflow-hidden">
        <ClientOnly>
            <div class="swiper-container h-full w-full">
                <div class="swiper-wrapper">
                    <div v-for="(movie, i) in movies" :key="i" class="swiper-slide">
                        <div class="relative w-full md:h-screen min-h-[100dvh] overflow-hidden">
                    <!-- Image de fond avec effet parallax -->
                    <div class="absolute inset-0 z-0">
                        <picture class="w-full h-full">
                            <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'original')" media="(min-width: 768px)" sizes="100vw">
                            <source :srcset="generateOptimizedImageUrl(movie.backdrop_path, 'medium')" media="(min-width: 480px) and (max-width: 768px)" sizes="50vw">
                            <source :srcset="generateOptimizedImageUrl(movie.poster_path, 'small')" media="(max-width: 480px)" sizes="100vw">
                            <img 
                                class="w-full h-full md:object-contains object-cover scale-110 transition-transform duration-[20s] ease-out" 
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
                        <div class="container mx-auto px-6 sm:px-6 lg:px-12">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                                
                                <!-- Informations du film -->
                                <div class="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in-up">
                                    <!-- Badge du film -->
                                    <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span class="text-white/90 text-sm font-medium">Actuellement à l'affiche</span>
                                    </div>
                                    
                                    <!-- Titre avec effet de texte -->
                                    <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-tight">
                                        <span class="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                                            {{ movie.title || movie.name }}
                                        </span>
                                    </h1>
                                    
                                    <!-- Genres avec style moderne -->
                                    <div class="flex flex-wrap gap-2 sm:gap-3">
                                        <span 
                                            v-for="(title, j) in getTitle(movie.genre_ids)" :key="j"
                                            class="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105">
                                            <NuxtLink 
                                                :to="{query: {type: type , name: title.name.toLowerCase()}, path:`/genres/${title.id}`}"
                                                class="text-white text-xs sm:text-sm font-medium relative z-10"
                                                role="link">{{ title.name }}</NuxtLink>
                                            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </span>
                                    </div>
                                    
                                    <!-- Note avec style premium -->
                                    <div class="flex items-center space-x-3 sm:space-x-4">
                                        <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20">
                                            <div class="flex">
                                                <span v-for="star in 5" :key="star" 
                                                    :class="getStarClass(star, movie.vote_average)"
                                                    class="text-sm sm:text-lg">{{ getStarSymbol(star, movie.vote_average) }}</span>
                                            </div>
                                            <span class="text-white font-semibold">{{ movie.vote_average.toFixed(1) }}</span>
                                        </div>
                                        <div class="text-white/70 text-xs sm:text-sm">
                                            Basé sur {{ movie.vote_count }} avis
                                        </div>
                                    </div>
                                    
                                    <!-- Description avec style élégant -->
                                    <p class="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                                        {{ movie.overview.substring(0, 120) }}...
                                    </p>
                                    
                                    <!-- Boutons d'action -->
                                    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <NuxtLink 
                                            :to="`/${type}/${movie.id}`" 
                                            class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                                            <span class="relative z-10 flex items-center space-x-2">
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                                                </svg>
                                                <span>Regarder maintenant</span>
                                            </span>
                                            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </NuxtLink>
                                        
                                        <button class="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105">
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
                     </div>
                     </div>
                 </div>
                 
                 <!-- Pagination -->
                <div class="swiper-pagination"></div>
                
                <!-- Navigation -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
            
            <!-- Miniatures (Thumbs) avec design moderne -->
            <div class="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/80">
                <div class="container-2xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-10">
                    <!-- Titre des miniatures -->
                    <div class="text-center mb-3 sm:mb-4">
                        <h3 class="text-white/90 text-xs sm:text-sm font-medium tracking-wider uppercase">Sélectionnez un film</h3>
                    </div>
                    
                    <!-- Conteneur des miniatures avec navigation responsive -->
                    <div class="relative">
                        <!-- Navigation pour mobile/tablette -->
                        <div class="flex justify-center items-center space-x-4 mb-3 sm:mb-4 lg:hidden">
                            <!-- Bouton groupe précédent -->
                            <button 
                                @click="goToPreviousGroup"
                                class="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/20"
                                title="Groupe précédent">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                                </svg>
                            </button>
                            
                            
                            <!-- Bouton groupe suivant -->
                            <button 
                                @click="goToNextGroup"
                                class="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/20"
                                title="Groupe suivant">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Miniatures sur desktop (toutes visibles) -->
                        <div class="hidden lg:flex items-center space-x-2 justify-center">
                            <div 
                                v-for="(movie, index) in movies" 
                                :key="index"
                                @click="goToSlide(index)"
                                class="group relative flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105"
                                :class="{ 'scale-110': index === activeSlideIndex }"
                                style="min-width: fit-content;">
                                <!-- Contenu miniature desktop (existant) -->
                                <div class="relative">
                                    <div class="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/30">
                                        <img 
                                            :src="generateOptimizedImageUrl(movie.poster_path, 'small')"
                                            :alt="movie.original_title"
                                            class="w-28 h-36 object-cover transition-all duration-500"
                                            :class="{ 
                                                'opacity-60 brightness-75': index !== activeSlideIndex,
                                                'opacity-100 brightness-100': index === activeSlideIndex
                                            }">
                                        
                                        <div 
                                            v-if="index === activeSlideIndex"
                                            class="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/20 to-transparent rounded-xl">
                                        </div>
                                        
                                        <div 
                                            v-if="index === activeSlideIndex"
                                            class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-75 animate-pulse">
                                            <div class="absolute inset-0.5 bg-black/20 backdrop-blur-sm rounded-lg"></div>
                                        </div>
                                        
                                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div class="bg-white/20 backdrop-blur-sm rounded-full p-2 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
                                            <div 
                                                v-if="index === activeSlideIndex"
                                                class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl animate-pulse">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="absolute top-1 right-1 bg-black/80 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full border border-white/20">
                                        <span class="flex items-center space-x-1">
                                            <span class="text-yellow-400 text-xs">★</span>
                                            <span class="font-medium">{{ movie.vote_average.toFixed(1) }}</span>
                                        </span>
                                    </div>
                                    
                                    <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                        <div class="bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full whitespace-nowrap border border-white/20 shadow-lg max-w-28">
                                            <span class="truncate block">{{ movie.title || movie.name }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Miniatures sur mobile/tablette (ligne de 5) -->
                        <div class="lg:hidden flex items-center justify-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                            <div 
                                v-for="(movie, index) in visibleThumbs" 
                                :key="index"
                                @click="goToSlide(startIndex + index)"
                                class="group relative cursor-pointer transition-all duration-300 hover:scale-105 flex-shrink-0"
                                :class="{ 'scale-110': (startIndex + index) === activeSlideIndex }">
                                
                                <!-- Contenu miniature mobile -->
                                <div class="relative">
                                    <div class="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/30">
                                        <img 
                                            :src="generateOptimizedImageUrl(movie.poster_path, 'small')"
                                            :alt="movie.original_title"
                                            class="w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28 object-cover transition-all duration-500"
                                            :class="{ 
                                                'opacity-60 brightness-75': (startIndex + index) !== activeSlideIndex,
                                                'opacity-100 brightness-100': (startIndex + index) === activeSlideIndex
                                            }">
                                        
                                        <div 
                                            v-if="(startIndex + index) === activeSlideIndex"
                                            class="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/20 to-transparent rounded-xl">
                                        </div>
                                        
                                        <div 
                                            v-if="(startIndex + index) === activeSlideIndex"
                                            class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-75 animate-pulse">
                                            <div class="absolute inset-0.5 bg-black/20 backdrop-blur-sm rounded-lg"></div>
                                        </div>
                                        
                                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div class="bg-white/20 backdrop-blur-sm rounded-full p-1 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-b-xl overflow-hidden">
                                            <div 
                                                v-if="(startIndex + index) === activeSlideIndex"
                                                class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl animate-pulse">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="absolute top-1 right-1 bg-black/80 backdrop-blur-sm text-white text-xs px-1 py-0.5 rounded-full border border-white/20">
                                        <span class="flex items-center space-x-0.5">
                                            <span class="text-yellow-400 text-xs">★</span>
                                            <span class="font-medium text-xs">{{ movie.vote_average.toFixed(1) }}</span>
                                        </span>
                                    </div>
                                </div>
                                
                                <!-- Titre du film sous la miniature -->
                                <div class="mt-1 text-center">
                                    <p class="text-white text-xs font-medium truncate px-1 max-w-16 sm:max-w-18">
                                        {{ movie.title || movie.name }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

/* Styles Swiper essentiels */
.swiper-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  transition-property: transform;
  box-sizing: content-box;
}

.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
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

/* Styles pour les miniatures (Thumbs) */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Scroll horizontal optimisé pour mobile/tablette */
@media (max-width: 1023px) {
  .overflow-x-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
  
  /* Assurer que les miniatures ne se rétrécissent pas */
  .flex-shrink-0 {
    flex-shrink: 0;
  }
}

/* Animation pour les miniatures actives */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Effet de glow pour la miniature active */
.group.scale-110::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 16px;
  z-index: -1;
  animation: border-glow 3s linear infinite;
  opacity: 0.8;
}

@keyframes border-glow {
  0% {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  }
  25% {
    background: linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6);
  }
  50% {
    background: linear-gradient(45deg, #ec4899, #3b82f6, #8b5cf6, #ec4899);
  }
  75% {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  }
  100% {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  }
}

/* Responsive adjustments */
@media (max-width: 1536px) {
  /* Écrans 16 pouces et similaires */
  .container {
    max-width: 1200px;
  }
  
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
}

@media (max-width: 1280px) {
  /* Écrans moyens (16 pouces) */
  .text-5xl {
    font-size: 2.5rem;
    line-height: 1.1;
  }
  
  .space-y-6 > * + * {
    margin-top: 1.25rem;
  }
  
  .gap-8 {
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  /* Tablettes et petits laptops */
  .animate-fade-in-right {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
  
  /* Optimisation du scroll horizontal pour les miniatures */
  .overflow-x-auto {
    scroll-snap-type: x mandatory;
    scroll-padding: 1rem;
  }
  
  .flex-shrink-0 {
    scroll-snap-align: center;
  }
}

@media (max-width: 768px) {
  .animate-fade-in-right {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  /* Ajustements pour les miniatures sur mobile */
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
}

@media (max-width: 480px) {
  /* Miniatures plus petites sur très petits écrans */
  .w-20.h-28 {
    width: 4rem;
    height: 5.5rem;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.25rem;
  }
}
</style>