import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPersonDetails } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { DetailsSkeleton } from '../components/Skeletons';
import { motion } from 'framer-motion';

const PersonDetails = () => {
  const { id } = useParams();
  const { data: person, isLoading } = useQuery({ 
    queryKey: ['person', id], 
    queryFn: () => fetchPersonDetails(id) 
  });

  if (isLoading || !person) return <DetailsSkeleton />;

  const credits = person.combined_credits?.cast
    ?.filter(item => item.poster_path && item.vote_count > 50)
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.slice(0, 20); 

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-24 pb-20 container mx-auto px-6 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-48 md:w-64 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl mx-auto md:mx-0">
          <img 
            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`} 
            className="w-full h-full object-cover"
            alt={person.name} 
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-4">{person.name}</h1>
          <div className="text-gray-400 text-sm mb-6 flex flex-wrap gap-4 justify-center md:justify-start">
             <span>Born: {person.birthday}</span>
             <span>•</span>
             <span>{person.place_of_birth}</span>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-3xl line-clamp-6">
            {person.biography || "No biography available."}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Known For</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {credits?.map((item) => (
          <MovieCard 
            key={item.id} 
            movie={item} 
            type={item.media_type || 'movie'} 
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PersonDetails;