export const useMoviesApi = () => {
  // Fonctions utilitaires (conservées de l'ancien composable)
  const showDate = (date) => {
    const str = date;
    const res = new Date(str);
    return res.toLocaleDateString()
  }
  
  const showYear = (date) => {
    const str = date;
    const res = new Date(str);
    return res.getFullYear()
  }

  const getColor = (vote) => {
    if( vote >= 7 || vote >= 70) {
      return 'bg-emerald-600'
    } else if( vote >= 5 || vote >= 50 ) {
      return 'bg-orange-600'
    } 
    return 'bg-red-600'
  }

  function getDate(date) {
    const str = date;
    const res = new Date(str);
    return res.toLocaleDateString()
  }

  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours();
  };

  const getCurrentDay = () => {
    const currentDate = new Date();
    return currentDate.getDay(); 
  };

  const getIncludeAdultValue = () => {
    const currentHour = getCurrentHour();
    const currentDay = getCurrentDay(); 
    if (currentHour >= 3 && currentHour < 4 && currentDay === 0) {
      return 'true';
    } else {
      return 'false';
    }
  };

  const includeAdult = getIncludeAdultValue();

  const percent = (note)=> {
    var result = note/10*100;
    return parseInt(result)
  };

  const getStarClass = (starIndex, voteAverage) => {
    const filledStarsCount = Math.floor(voteAverage / 2);
    if (starIndex <= filledStarsCount) {
      return '';
    } else {
      return 'star-empty';
    }
  }
  
  const getStarSymbol = (starIndex, voteAverage) => {
    const filledStarsCount = Math.floor(voteAverage / 2);
    if (starIndex <= filledStarsCount) {
      return '★';
    } else {
      return '☆';
    }
  };

  // === FONCTIONS API SÉCURISÉES ===

  // Films populaires
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

  // Films à l'affiche
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

  // Films les mieux notés
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

  // Découverte de films
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

  // Détails d'un film/série
  const getDetails = async (type, getId) => {
    if (!type || !getId) {
      throw new Error('Type et ID requis');
    }
    try {
      const response = await $fetch('/api/movies/details', {
        query: { type, id: getId }
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  };

  // Genres
  const getGenres = async (type = 'movie') => {
    try {
      const response = await $fetch('/api/movies/genres', {
        query: { type }
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des genres:', error);
      throw error;
    }
  };

  // Films par genre (utilise discover avec genre)
  const getMoviesByGenre = async (genre, page = 1) => {
    try {
      const response = await $fetch('/api/movies/discover', {
        query: { 
          page, 
          sort_by: 'popularity.desc',
          with_genres: genre 
        }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films par genre:', error);
      throw error;
    }
  };

  // Recherche
  const search = async (keyword, value, page = 1) => {
    if (!keyword || !value) {
      throw new Error('Keyword et value requis');
    }
    try {
      const response = await $fetch('/api/movies/search', {
        query: { keyword, value, page }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  };

  // Crédits (cast et crew)
  const credits = async (type, id) => {
    if (!type || !id) {
      throw new Error('Type et ID requis');
    }
    try {
      const response = await $fetch('/api/movies/credits', {
        query: { type, id }
      });
      const { cast, crew } = response;
      return { cast, crew };
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits:', error);
      throw error;
    }
  };

  // Recommandations
  const recommendations = async (type, id) => {
    if (!type || !id) {
      throw new Error('Type et ID requis');
    }
    try {
      const response = await $fetch('/api/movies/recommendations', {
        query: { type, id }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      throw error;
    }
  };

  // Crédits d'une personne
  const personCredits = async (type, id) => {
    if (!type || !id) {
      throw new Error('Type et ID requis');
    }
    try {
      const response = await $fetch('/api/movies/person-credits', {
        query: { type, id }
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits de la personne:', error);
      throw error;
    }
  };

  // Vidéos
  const videos = async (type, id) => {
    if (!type || !id) {
      throw new Error('Type et ID requis');
    }
    try {
      const response = await $fetch('/api/movies/videos', {
        query: { type, id }
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos:', error);
      throw error;
    }
  };

  // === FONCTIONS COMPATIBLES AVEC L'ANCIEN COMPOSABLE ===

  // Fonction req compatible (pour compatibilité)
  const req = async (get, page, option) => {
    // Mapper les noms d'endpoints pour correspondre aux fichiers serveur
    const endpointMap = {
      'now_playing': 'now-playing',
      'top_rated': 'top-rated',
      'person_credits': 'person-credits'
    };
    
    const endpoint = endpointMap[get] || get;
    
    if (page) {
      const query = page.includes('page=') ? page : `&page=${page}`;
      const response = await $fetch(`/api/movies/${endpoint}`, {
        query: { page: query.replace('&page=', '') }
      });
      return response.results;
    } else {
      const response = await $fetch(`/api/movies/${endpoint}`);
      return response.results;
    }
  };

  // Fonction getMovies compatible
  const getMovies = async (get, page = 1) => {
    let query = `&page=`;
    if (page) {
      query += `${page}`;
    }
    return req(get, query);
  };

  // Fonction getMoviesD compatible (films par genre)
  const getMoviesD = async (get, page, genre) => {
    let query = `&page=`;
    let query2 = `&with_genres=`;

    if (page) {
      query += `${page}`;
    }
    if (genre !== null) {
      query2 += `${genre}`;
    }
    
    try {
      const response = await $fetch('/api/movies/discover', {
        query: { 
          page: page || 1, 
          sort_by: 'popularity.desc',
          with_genres: genre 
        }
      });
      return response.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films par genre:', error);
      throw error;
    }
  };

  return {
    // Fonctions utilitaires
    showDate,
    showYear,
    getDate,
    getColor,
    percent,
    getStarClass,
    getStarSymbol,
    
    // Fonctions API sécurisées (nouvelles)
    getPopularMovies,
    getNowPlayingMovies,
    getTopRatedMovies,
    getDiscoverMovies,
    getDetails,
    getGenres,
    getMoviesByGenre,
    search,
    credits,
    recommendations,
    personCredits,
    videos,
    
    // Fonctions compatibles (ancien composable)
    req,
    getMovies,
    getMoviesD
  };
};
