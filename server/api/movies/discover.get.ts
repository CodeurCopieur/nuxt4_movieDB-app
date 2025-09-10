export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const page = query.page || '1'
  const sortBy = query.sort_by || 'popularity.desc'
  
  const apiKey = config.tmdbApiKey
  const baseURL = config.tmdbBaseURL
  
  try {
    const response = await $fetch(`${baseURL}discover/movie`, {
      params: {
        api_key: apiKey,
        page: page,
        sort_by: sortBy,
        include_adult: false
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la découverte de films'
    })
  }
})
