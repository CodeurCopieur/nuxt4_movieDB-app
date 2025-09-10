export const useMoviesApi = () => {
  // Utilisation des endpoints API sécurisés côté serveur
  
  const getPopularMovies = async (page = 1) => {
    try {
      const response = await $fetch('/api/movies/popular', {
        query: { page }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films populaires:', error);
      throw error;
    }
  };

  const getNowPlayingMovies = async (page = 1) => {
    try {
      const response = await $fetch('/api/movies/now-playing', {
        query: { page }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films à l\'affiche:', error);
      throw error;
    }
  };

  const getTopRatedMovies = async (page = 1) => {
    try {
      const response = await $fetch('/api/movies/top-rated', {
        query: { page }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films les mieux notés:', error);
      throw error;
    }
  };

  const getDiscoverMovies = async (page = 1, sortBy = 'popularity.desc') => {
    try {
      const response = await $fetch('/api/movies/discover', {
        query: { page, sort_by: sortBy }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la découverte de films:', error);
      throw error;
    }
  };

  return {
    getPopularMovies,
    getNowPlayingMovies,
    getTopRatedMovies,
    getDiscoverMovies
  };
};