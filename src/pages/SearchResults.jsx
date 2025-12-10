import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchMovies, fetchUpcoming, fetchTrending, fetchTopRated, discoverContent } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '../components/Skeletons';

const SearchResults = () => {
  const { query } = useParams();
  const [searchParams] = useSearchParams();

  const isFilterMode = query === 'filter';

  const getResults = async () => {
    if (isFilterMode) {
      const type = searchParams.get('type') || 'movie';
      const filters = {
        genre: searchParams.get('genre'),
        year: searchParams.get('year'),
        country: searchParams.get('country'),
        sort: searchParams.get('sort')
      };
      return discoverContent(type, filters);
    }

    switch (query) {
      case 'upcoming': return fetchUpcoming();
      case 'trending': return fetchTrending();
      case 'top_rated': return fetchTopRated();
      default: return searchMovies(query);
    }
  };

  const { data, isLoading } = useQuery({ 
    queryKey: ['search', query, searchParams.toString()], 
    queryFn: getResults 
  });

  const getTitle = () => {
    if (isFilterMode) return "Filtered Results";
    if (query === 'upcoming') return 'Coming Soon';
    if (query === 'trending') return 'Trending Now';
    if (query === 'top_rated') return 'Top Rated';
    return `Results for "${query}"`;
  };

  if (isLoading) return <div className="min-h-screen bg-black pt-24 px-6"><SkeletonGrid /></div>;

  return (
    <motion.div className="min-h-screen bg-black pt-24 pb-10 px-6 container mx-auto max-w-7xl">
      <h2 className="text-2xl font-bold mb-6 text-white capitalize">{getTitle()}</h2>
      
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {data.results.map((movie) => {
             if (movie.media_type === 'person') return null;
             
             const type = isFilterMode ? (searchParams.get('type') || 'movie') : movie.media_type;

             return (
               <MovieCard 
                 key={movie.id} 
                 movie={movie} 
                 type={type || 'movie'}
               />
             );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl font-bold mb-2">No results found.</p>
          <p>Try adjusting your filters.</p>
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;