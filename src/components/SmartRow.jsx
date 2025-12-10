import { useQuery } from '@tanstack/react-query';
import { fetchByGenre } from '../api/tmdb';
import MovieCard from './MovieCard';

const SmartRow = ({ title, type, genreId }) => {
  const { data, isLoading } = useQuery({ 
    queryKey: ['genre', type, genreId], 
    queryFn: () => fetchByGenre(type, genreId),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || !data?.results?.length) return null;

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-xl font-bold mb-4 px-6 md:px-0 text-white flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        {title}
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-6 px-6 md:px-0 scrollbar-hide snap-x">
        {data.results.map((item) => (
          <div key={item.id} className="min-w-[140px] md:min-w-[180px] snap-center">
            <MovieCard movie={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartRow;