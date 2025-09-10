<script setup>
import { onMounted } from 'vue'

const { getPopularMovies, getDetails, search, credits }  = useMoviesApi();

onMounted(async () => {
  try {
   
   // Utilisation identique à l'ancien composable
   const movies = await getPopularMovies(1);
   console.log(movies)

  } catch (error) {
    console.error('Error fetching popular movies:', error)
  }
})
</script>


<template>
  <div id="app" class="min-h-screen">
       salut
  </div>
</template>
