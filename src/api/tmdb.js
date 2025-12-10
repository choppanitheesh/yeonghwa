import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const BASE_URL = "https://api.themoviedb.org/3";

export const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const fetchTrending = () => tmdbClient.get('/trending/movie/week').then(res => res.data);
export const fetchTrendingTV = () => tmdbClient.get('/trending/tv/week').then(res => res.data);
export const fetchUpcoming = () => tmdbClient.get('/movie/upcoming').then(res => res.data);
export const fetchTopRated = () => tmdbClient.get('/movie/top_rated').then(res => res.data);

export const fetchCollectionDetails = (collectionId) => 
  tmdbClient.get(`/collection/${collectionId}`).then(res => res.data);

export const fetchByGenre = (type, genreId) => 
  tmdbClient.get(`/discover/${type}?with_genres=${genreId}&sort_by=popularity.desc`).then(res => res.data);

export const fetchDetails = (id, type) => 
  tmdbClient.get(`/${type}/${id}?append_to_response=videos,credits,similar`).then(res => res.data);

export const searchMovies = (query) => 
  tmdbClient.get(`/search/multi?query=${query}&include_adult=false`).then(res => res.data);

export const discoverContent = (type, filters) => {
  const { genre, year, country, sort } = filters;
  
  let url = `/discover/${type}?include_adult=false&page=1`;
  
  if (genre) url += `&with_genres=${genre}`;
  if (country) url += `&with_origin_country=${country}`; 
  if (sort) url += `&sort_by=${sort}`;
  
  if (year) {
    if (type === 'movie') url += `&primary_release_year=${year}`;
    else url += `&first_air_date_year=${year}`;
  }

  return tmdbClient.get(url).then(res => res.data);
};

export const fetchPersonDetails = (personId) => 
  tmdbClient.get(`/person/${personId}?append_to_response=combined_credits`).then(res => res.data);

export const fetchUniversalDetails = async (id) => {
  try {
    const movieRes = await tmdbClient.get(`/movie/${id}`);
    return { ...movieRes.data, media_type: 'movie' };
  } catch (error) {
    try {
      const tvRes = await tmdbClient.get(`/tv/${id}`);
      return { ...tvRes.data, media_type: 'tv' };
    } catch (err) {
      return null;
    }
  }
};