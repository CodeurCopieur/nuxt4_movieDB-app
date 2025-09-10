export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const { keyword, value, page = '1' } = query
  
  if (!keyword || !value) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Keyword et value requis'
    })
  }
  
  const apiKey = config.tmdbApiKey
  const baseURL = config.tmdbBaseURL
  
  try {
    const response = await $fetch(`${baseURL}search/${keyword}`, {
      params: {
        api_key: apiKey,
        query: value,
        page: page,
        sort_by: 'popularity.desc',
        include_adult: false
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la recherche'
    })
  }
})
