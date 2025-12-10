import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoInformationCircleOutline, IoPlay } from 'react-icons/io5';
import VideoModal from './VideoModal';
import { fetchDetails } from '../api/tmdb';
import toast from 'react-hot-toast';

const IMG_PATH = "https://image.tmdb.org/t/p/original";

const HeroBanner = ({ content }) => {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isModalOpen) {
        setIndex((prev) => (prev + 1) % content.length);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [content.length, isModalOpen]);

  if (!content || content.length === 0) return null;

  const current = content[index];
  const title = current.title || current.name;
  const description = current.overview;
  const type = current.media_type || 'movie'; 
  const linkPath = `/${type}/${current.id}`;

  const handleWatchTrailer = async () => {
    try {
      const data = await fetchDetails(current.id, type);
      const trailer = data.videos?.results?.find(v => v.site === "YouTube" && v.type === "Trailer") 
                   || data.videos?.results?.find(v => v.site === "YouTube");
      
      if (trailer) {
        setVideoId(trailer.key);
        setIsModalOpen(true);
      } else {
        toast.error("No trailer available");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trailer");
    }
  };

  return (
    // 🔴 FIX: Reduced mobile height from [65vh] to [55vh]. 
    // This makes it wider relative to its height, requiring less zooming.
    <div className="relative w-full h-[55vh] md:h-[85vh] overflow-hidden mb-8">
      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={videoId} />

      <AnimatePresence mode='wait'>
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            // 🔴 FIX: Changed back to 'bg-top' for ALL screens.
            // Combined with the shorter height above, this anchors faces to the top 
            // and shows more of the image on mobile.
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${IMG_PATH}${current.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          {/* 🔴 FIX: Adjusted padding and justification for the shorter mobile banner */}
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 lg:w-1/2 z-10 flex flex-col justify-end h-full pb-16 md:pb-32">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-6xl font-black text-white mb-3 md:mb-4 leading-tight drop-shadow-2xl"
            >
              {title}
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-200 text-sm md:text-lg mb-6 line-clamp-2 md:line-clamp-2 drop-shadow-md font-medium"
            >
              {description}
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <button 
                onClick={handleWatchTrailer}
                className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition active:scale-95 shadow-lg shadow-white/10"
              >
                <IoPlay size={20} /> Watch Trailer
              </button>
              
              <Link 
                to={linkPath}
                className="flex items-center gap-2 bg-gray-600/70 text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-gray-600/90 backdrop-blur-md transition active:scale-95"
              >
                <IoInformationCircleOutline size={24} /> More Info
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        {content.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
