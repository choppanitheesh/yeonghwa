import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionDetails } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { DetailsSkeleton } from '../components/Skeletons';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

const CollectionDetails = () => {
  const { id } = useParams();
  const { data: collection, isLoading } = useQuery({ 
    queryKey: ['collection', id], 
    queryFn: () => fetchCollectionDetails(id) 
  });

  if (isLoading) return <DetailsSkeleton />;
  if (!collection) return <div className="text-white text-center pt-40">Collection not found</div>;

  const parts = collection.parts
    ?.filter(p => p.poster_path)
    ?.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)) || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white pb-20"
    >
      
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${collection.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl">{collection.name}</h1>
          <p className="text-gray-200 max-w-2xl text-lg drop-shadow-md font-medium">{collection.overview}</p>
        </div>
        
        <Link to="/" className="absolute top-24 left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition z-20 text-white">
           <IoArrowBack size={24} />
        </Link>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            Movies in this Series
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {parts.map((movie) => (
            <div key={movie.id} className="hover:-translate-y-2 transition duration-300">
               <MovieCard movie={movie} type="movie" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionDetails;