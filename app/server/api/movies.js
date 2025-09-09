import axios from 'axios';

export default defineEventHandler(async (event) => {
    console.log('API /api/movies called'); // <-- Ajoute ce log ici
  const config = useRuntimeConfig();
  const apiKey = config.tmdbApiKey;
  const baseURL = config.tmdbBaseURL;
  const query = getQuery(event);
  const page = query.page || 1;

  const url = `${baseURL}movie/popular?api_key=${apiKey}&sort_by=popularity.desc&page=${page}&include_adult=false`;

  const response = await axios.get(url);
  console.log('TMDB response:', response.data); // Ajoute ce log
  // Vérifie que response.data.results existe et retourne-le
  return response.data.results || [];
});