exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Fonction Netlify fonctionne !',
      path: event.path,
      method: event.httpMethod,
      query: event.queryStringParameters,
      env: {
        hasApiKey: !!process.env.TMDB_API_KEY,
        hasBaseUrl: !!process.env.TMDB_BASE_URL
      }
    })
  };
};
