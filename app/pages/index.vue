<script setup lang="ts">
import { onMounted } from 'vue'

const { getPopularMovies, getNowPlayingMovies } = useMoviesApi();

onMounted(async () => {
  try {
    const popularMovies = await getPopularMovies()
    const nowPopularMovies = await getNowPlayingMovies()
    console.log('Popular Movies:', popularMovies)
    console.log('Now Popular Movies:', nowPopularMovies)
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
