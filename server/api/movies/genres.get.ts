export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const type = query.type || 'movie'
  
  const apiKey = config.tmdbApiKey
  const baseURL = config.tmdbBaseURL
  
  try {
    const response = await $fetch(`${baseURL}genre/${type}/list`, {
      params: {
        api_key: apiKey,
        include_adult: false
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des genres'
    })
  }
})
