import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const VideoModal = ({ isOpen, onClose, videoId }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.5, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-white hover:text-black transition duration-300"
          >
            <IoClose size={24} />
          </button>
          {videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white flex-col gap-2">
              <p className="text-xl text-gray-400 font-bold">Trailer Unavailable</p>
              <p className="text-sm text-gray-500">We couldn't find a video for this title.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoModal;