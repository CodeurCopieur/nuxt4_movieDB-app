const { TMDB_API_KEY, TMDB_BASE_URL } = process.env;

exports.handler = async (event, context) => {
  console.log('API Function called:', {
    path: event.path,
    method: event.httpMethod,
    query: event.queryStringParameters,
    hasApiKey: !!TMDB_API_KEY,
    hasBaseUrl: !!TMDB_BASE_URL
  });

  // Configuration CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Gérer les requêtes OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Vérifier si la clé API est présente
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY not found in environment variables');
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Configuration manquante: TMDB_API_KEY non définie'
      })
    };
  }

  try {
    const path = event.path;
    const { page = '1', sort_by = 'popularity.desc' } = event.queryStringParameters || {};
    
    const apiKey = TMDB_API_KEY;
    const baseURL = TMDB_BASE_URL || 'https://api.themoviedb.org/3/';
    
    let endpoint = '';
    
    // Déterminer l'endpoint TMDB basé sur le chemin
    if (path.includes('/movies/popular')) {
      endpoint = `${baseURL}movie/popular`;
    } else if (path.includes('/movies/now-playing')) {
      endpoint = `${baseURL}movie/now_playing`;
    } else if (path.includes('/movies/top-rated')) {
      endpoint = `${baseURL}movie/top_rated`;
    } else if (path.includes('/movies/discover')) {
      endpoint = `${baseURL}discover/movie`;
    } else if (path.includes('/movies/details')) {
      const { type, id } = event.queryStringParameters || {};
      if (!type || !id) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Type et ID requis pour les détails' })
        };
      }
      endpoint = `${baseURL}${type}/${id}`;
    } else if (path.includes('/movies/genres')) {
      const type = event.queryStringParameters?.type || 'movie';
      endpoint = `${baseURL}genre/${type}/list`;
    } else if (path.includes('/movies/search')) {
      const { keyword, value } = event.queryStringParameters || {};
      if (!keyword || !value) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Keyword et value requis pour la recherche' })
        };
      }
      endpoint = `${baseURL}search/${keyword}`;
    } else if (path.includes('/movies/credits')) {
      const { type, id } = event.queryStringParameters || {};
      if (!type || !id) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Type et ID requis pour les crédits' })
        };
      }
      endpoint = `${baseURL}${type}/${id}/credits`;
    } else if (path.includes('/movies/recommendations')) {
      const { type, id } = event.queryStringParameters || {};
      if (!type || !id) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Type et ID requis pour les recommandations' })
        };
      }
      endpoint = `${baseURL}${type}/${id}/recommendations`;
    } else if (path.includes('/movies/person-credits')) {
      const { type, id } = event.queryStringParameters || {};
      if (!type || !id) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Type et ID requis pour les crédits de la personne' })
        };
      }
      endpoint = `${baseURL}person/${id}/${type}_credits`;
    } else if (path.includes('/movies/videos')) {
      const { type, id } = event.queryStringParameters || {};
      if (!type || !id) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Type et ID requis pour les vidéos' })
        };
      }
      endpoint = `${baseURL}${type}/${id}/videos`;
    } else {
      return {
        statusCode: 404,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Endpoint non trouvé',
          path: path,
          availableEndpoints: [
            '/movies/popular', '/movies/now-playing', '/movies/top-rated', '/movies/discover',
            '/movies/details', '/movies/genres', '/movies/search', '/movies/credits',
            '/movies/recommendations', '/movies/person-credits', '/movies/videos'
          ]
        })
      };
    }
    
    // Construire l'URL avec les paramètres
    const url = new URL(endpoint);
    url.searchParams.set('api_key', apiKey);
    
    // Ajouter les paramètres selon le type d'endpoint
    if (path.includes('/movies/search')) {
      const { keyword, value } = event.queryStringParameters || {};
      url.searchParams.set('query', value);
      url.searchParams.set('page', page);
      url.searchParams.set('sort_by', 'popularity.desc');
      url.searchParams.set('include_adult', 'false');
    } else if (path.includes('/movies/details') || path.includes('/movies/credits') || 
               path.includes('/movies/recommendations') || path.includes('/movies/person-credits')) {
      url.searchParams.set('include_adult', 'false');
    } else if (path.includes('/movies/videos')) {
      // Pas de paramètres supplémentaires pour les vidéos
    } else if (path.includes('/movies/genres')) {
      url.searchParams.set('include_adult', 'false');
    } else {
      // Pour popular, now-playing, top-rated, discover
      url.searchParams.set('page', page);
      url.searchParams.set('include_adult', 'false');
      
      if (path.includes('/movies/discover')) {
        url.searchParams.set('sort_by', sort_by);
      }
    }
    
    console.log('Fetching TMDB API:', url.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('Successfully fetched data from TMDB');
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('API Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Erreur lors de la récupération des données',
        details: error.message,
        path: event.path
      })
    };
  }
};