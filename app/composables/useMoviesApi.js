export const useMoviesApi = () => {
  const { $axios } = useNuxtApp();
   const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;
  const includeAdult = false; // ou true selon ton besoin

  //Movies 
    // Get Now Playing : https://api.themoviedb.org/3/movie/now_playing?api_key={CURRENCY_API_KEY}&page=${page}

    // Get Popular : https://api.themoviedb.org/3/movie/popular?api_key={CURRENCY_API_KEY}&page=${page}

    // Get Top Rated : https://api.themoviedb.org/3/movie/top_rated?api_key={CURRENCY_API_KEY}&page=${page}

    // Movie Discover : https://api.themoviedb.org/3/discover/movie?api_key={CURRENCY_API_KEY}&sort_by=popularity.desc&page=${page}
const req = async (endpoint, page) => {
  const url = `${endpoint}?api_key=${apiKey}&sort_by=popularity.desc${page}&include_adult=${includeAdult}`;
  const response = await $axios.get(url);
  return response.data.results;
};

    const getMovies = async(get, page=1) => {
      let query = `&page=`;

      if (page) {
        query +=`${page}`;
      }
       return req(`${get}`, query);
    }

    return {
      getMovies
  };
};