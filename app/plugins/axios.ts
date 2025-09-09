import { defineNuxtPlugin } from 'nuxt/app';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.tmdbBaseURL,
    headers: { accept: 'application/json' },
    params: { api_key: config.public.tmdbApiKey }
  });

  nuxtApp.provide('axios', axiosInstance);
});
