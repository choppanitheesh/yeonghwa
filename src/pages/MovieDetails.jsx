import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchDetails } from '../api/tmdb';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { useState, useEffect } from 'react';
import VideoModal from '../components/VideoModal';
import toast, { Toaster } from 'react-hot-toast';
import { IoPlay, IoCheckmark, IoAdd, IoStar, IoLibrary } from 'react-icons/io5';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DetailsSkeleton } from '../components/Skeletons';
import MovieCard from '../components/MovieCard';
import ColorThief from 'colorthief';
import { API_BASE_URL } from '../utils/apiConfig';
const MovieDetails = ({ type = 'movie' }) => {
  const { id } = useParams();
  const { user, setUserData } = useAuthStore();
  const [dominantColor, setDominantColor] = useState([0, 0, 0]);

  const { scrollY } = useScroll();
  const blurValue = useTransform(scrollY, [0, 300], ['blur(0px)', 'blur(10px)']);
  const opacityValue = useTransform(scrollY, [0, 300], [1, 0.3]);

  const { data: movie, isLoading } = useQuery({ 
    queryKey: [type, id],
    queryFn: () => fetchDetails(id, type)
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (user?.wishlist) setInWishlist(user.wishlist.includes(id.toString()));
    window.scrollTo(0, 0);
  }, [user, id]);

  const trailer = movie?.videos?.results?.find(v => v.site === "YouTube" && v.type === "Trailer") 
               || movie?.videos?.results?.find(v => v.site === "YouTube" && v.type === "Teaser")
               || movie?.videos?.results?.find(v => v.site === "YouTube");

  const toggleWishlist = async () => {
    if (!user) return toast.error("Login required");
    
    const prevState = inWishlist;
    setInWishlist(!prevState);
    
    try {
      await axios.put(`${API_BASE_URL}/wishlist/${user._id}`, { movieId: id });
      
      let newWishlist = prevState 
         ? user.wishlist.filter(wId => wId !== id.toString())
         : [...user.wishlist, id.toString()];
      if (setUserData) {
          setUserData({ ...user, wishlist: newWishlist });
      }
      
      toast.success(prevState ? "Removed" : "Saved");
    } catch (err) {
      setInWishlist(prevState);
      toast.error("Failed to update wishlist");
    }
  };

  const handleImageLoad = (e) => {
    try {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(e.target);
      setDominantColor(color);
    } catch (err) {
    }
  };

  if (isLoading || !movie) return <DetailsSkeleton />;

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate?.split('-')[0] || 'N/A';
  const rawRuntime = movie.runtime || (movie.episode_run_time && movie.episode_run_time.length > 0 ? movie.episode_run_time[0] : 0);
  const runtime = rawRuntime > 0 ? `${Math.floor(rawRuntime / 60)}h ${rawRuntime % 60}m` : 'N/A';
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'NR';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black relative overflow-hidden font-sans text-white"
    >
      <Toaster position="bottom-center" />
      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={trailer?.key} />

      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 10%, rgb(${dominantColor.join(',')}) 0%, #000000 90%)`,
          opacity: 0.3
        }}
      />

      <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
        crossOrigin="anonymous" 
        className="hidden" 
        onLoad={handleImageLoad} 
        alt=""
      />

      <div className="fixed inset-0 z-0 h-[70vh]">
        <motion.div 
            className="absolute inset-0 bg-cover bg-top" 
            style={{ 
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                filter: blurValue,
                opacity: opacityValue
            }}
        >
            <div className="absolute inset-0 bg-black/10 saturate-150 mix-blend-overlay" /> 
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-20">
        <div className="mt-[25vh] md:mt-[45vh] flex flex-col md:flex-row gap-8 items-end md:items-end mb-12">
          
          <div className="hidden md:block w-52 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/20 rotate-1 hover:rotate-0 transition-transform duration-500">
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg'} className="w-full h-full object-cover" alt={title} />
          </div>

          <div className="flex-1 w-full">
            <div className="md:hidden w-36 rounded-xl overflow-hidden shadow-2xl border border-white/20 mb-6 mx-auto">
                 <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} className="w-full" alt={title} />
            </div>

            <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 text-center md:text-left leading-tight drop-shadow-2xl">
                {title}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm md:text-lg text-gray-200 mb-8 font-medium drop-shadow-md">
              <span className="bg-white/10 px-2 py-0.5 rounded text-white border border-white/10">{releaseYear}</span>
              <span>{movie.genres?.slice(0, 3).map(g => g.name).join(', ')}</span>
              <span>{runtime}</span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold bg-black/20 px-2 rounded"><IoStar /> {rating}</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
              <button onClick={() => trailer ? setIsModalOpen(true) : toast.error("No trailer found")} className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold transition transform active:scale-95 shadow-lg ${trailer ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                <IoPlay size={22} /> {trailer ? "Watch Trailer" : "No Trailer"}
              </button>
              
              <button onClick={toggleWishlist} className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold border transition transform active:scale-95 shadow-lg ${inWishlist ? "bg-primary border-primary text-white shadow-primary/40" : "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"}`}>
                {inWishlist ? <IoCheckmark size={22} /> : <IoAdd size={22} />}
                {inWishlist ? "Saved" : "Wishlist"}
              </button>

              {movie.belongs_to_collection && (
                <Link 
                  to={`/collection/${movie.belongs_to_collection.id}`}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600/40 transition active:scale-95 backdrop-blur-md"
                >
                  <IoLibrary size={22} /> Collection
                </Link>
              )}
            </div>

            <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
                <p className="text-gray-200 leading-relaxed text-sm md:text-lg drop-shadow-md line-clamp-4 md:line-clamp-none font-medium">
                    {movie.overview || "No synopsis available."}
                </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
            {movie.credits?.cast?.length > 0 && (
                <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Top Cast</h3>
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {movie.credits.cast.slice(0, 10).map(actor => (
                        <div key={actor.id} className="text-center min-w-[90px] snap-start">
                            <Link to={`/person/${actor.id}`}>
                                <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/100x150?text=?'} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border border-white/10 shadow-lg hover:scale-105 transition-transform" alt={actor.name}/>
                            </Link>
                            <p className="text-sm font-semibold text-white truncate">{actor.name}</p>
                            <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                        </div>
                        ))}
                    </div>
                </div>
            )}

            {movie.similar?.results?.length > 0 && (
                <div className="pt-4">
                     <h3 className="text-2xl font-bold text-white mb-6">More Like This</h3>
                     <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                        {movie.similar.results.slice(0, 10).map(similarMovie => (
                             <div key={similarMovie.id} className="min-w-[160px] md:min-w-[200px] snap-start">
                                 <MovieCard movie={similarMovie} type={type} />
                             </div>
                        ))}
                     </div>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetails;