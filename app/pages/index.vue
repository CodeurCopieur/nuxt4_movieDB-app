<script setup>
import { onMounted } from 'vue'

const {
  getMovies,
  getPopularMovies,
  getTopRatedMovies
}  = useMoviesApi();

const heroMovies = ref([]);
const popularMovies = ref([]);
const popularSeries = ref([]);
const topRatedMovies = ref([]);
const topRatedSeries = ref([]);

onMounted(async () => {
  try {

   heroMovies.value = await getMovies('now_playing', 1);
   popularMovies.value = await getPopularMovies(1);
   popularSeries.value = await getPopularMovies(1, { type: 'tv' });
   topRatedMovies.value = await getTopRatedMovies(1);
   topRatedSeries.value = await getTopRatedMovies(1, { type: 'tv' });
   
  } catch (error) {
    console.error('Error fetching popular movies:', error)
  }
})
</script>


<template>
  <div>
    <Hero :movies="heroMovies" type="movie" />
    <section aria-labelledby="popular-movies-heading" class="my-16">
      <div class="mx-auto w-full max-w-7xl px-6">
        <div class="flex items-center justify-center">
          <h2 id="popular-movies-heading" class="text-xl font-semibold text-white md:text-2xl text-center">
            Films populaires
          </h2>
        </div>
        <div class="mt-6 rounded-2xl pb-6">
          <MediaCarousel
            type="movie"
            :items="popularMovies"
            aria-label="Liste de films populaires"
          />
        </div>
      </div>
    </section>

    <section aria-labelledby="popular-series-heading" class="my-16">
      <div class="mx-auto w-full max-w-7xl px-6">
        <div class="flex items-center justify-center">
          <h2 id="popular-series-heading" class="text-xl font-semibold text-white md:text-2xl text-center">
            Séries populaires
          </h2>
        </div>
        <div class="mt-6 rounded-2xl pb-6">
          <MediaCarousel
            type="tv"
            :items="popularSeries"
            aria-label="Liste de séries populaires"
          />
        </div>
      </div>
    </section>

    <section aria-labelledby="top-rated-movies-heading" class="my-16">
      <div class="mx-auto w-full max-w-7xl px-6">
        <div class="flex items-center justify-center">
          <h2 id="top-rated-movies-heading" class="text-xl font-semibold text-white md:text-2xl text-center">
            Films les mieux notés
          </h2>
        </div>
        <div class="mt-6 rounded-2xl pb-6">
          <MediaCarousel
            type="movie"
            :items="topRatedMovies"
            aria-label="Liste de films les mieux notés"
          />
        </div>
      </div>
    </section>

    <section aria-labelledby="top-rated-series-heading" class="my-16">
      <div class="mx-auto w-full max-w-7xl px-6">
        <div class="flex items-center justify-center">
          <h2 id="top-rated-series-heading" class="text-xl font-semibold text-white md:text-2xl text-center">
            Séries les mieux notées
          </h2>
        </div>
        <div class="mt-6 rounded-2xl pb-6">
          <MediaCarousel
            type="tv"
            :items="topRatedSeries"
            aria-label="Liste de séries les mieux notées"
          />
        </div>
      </div>
    </section>
  </div>
</template>
