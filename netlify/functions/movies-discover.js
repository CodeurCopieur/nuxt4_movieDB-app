const { TMDB_API_KEY, TMDB_BASE_URL } = process.env;

exports.handler = async (event, context) => {
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

  try {
    const { page = '1', sort_by = 'popularity.desc' } = event.queryStringParameters || {};
    
    const apiKey = TMDB_API_KEY;
    const baseURL = TMDB_BASE_URL || 'https://api.themoviedb.org/3/';
    
    const response = await fetch(`${baseURL}discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sort_by}&include_adult=false`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Erreur lors de la découverte de films',
        details: error.message
      })
    };
  }
};
