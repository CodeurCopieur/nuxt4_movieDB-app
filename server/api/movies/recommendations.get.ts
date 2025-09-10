export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const { type, id } = query
  
  if (!type || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Type et ID requis'
    })
  }
  
  const apiKey = config.tmdbApiKey
  const baseURL = config.tmdbBaseURL
  
  try {
    const response = await $fetch(`${baseURL}${type}/${id}/recommendations`, {
      params: {
        api_key: apiKey,
        include_adult: false
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des recommandations'
    })
  }
})
