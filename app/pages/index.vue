<script setup>
import { onMounted } from 'vue'

const { getMovies }  = useMoviesApi();
const allMovies = ref([]);

onMounted(async () => {
  try {

   allMovies.value = await getMovies('now_playing', 1);
   
  } catch (error) {
    console.error('Error fetching popular movies:', error)
  }
})
</script>


<template>
  <div>
    <Hero :movies="allMovies" type="movie" />
  </div>
</template>
