export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const page = query.page || '1'
  
  const apiKey = config.tmdbApiKey
  const baseURL = config.tmdbBaseURL
  
  try {
    const response = await $fetch(`${baseURL}movie/now_playing`, {
      params: {
        api_key: apiKey,
        page: page,
        include_adult: false
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des films actuellement à l\'affiche'
    })
  }
})
