<script setup lang="ts">
import { onMounted } from 'vue'

const { $axios } = useNuxtApp()
const { getMovies } = useMoviesApi();

onMounted(async () => {
  try {
    const popularMovies = await getMovies('/movie/popular')
    console.log('Popular Movies:', popularMovies)
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
