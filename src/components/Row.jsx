import { useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import MovieCard from './MovieCard';

const Row = ({ title, movies }) => {
  const rowRef = useRef(null);

  const slide = (offset) => {
    rowRef.current.scrollLeft += offset;
  };

  return (
    <div className="mb-8 pl-4 group/row">
      <h2 className="text-xl font-bold mb-4 text-white/90">{title}</h2>
      <div className="relative">
        <MdChevronLeft 
          onClick={() => slide(-500)} 
          size={40} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full cursor-pointer opacity-0 group-hover/row:opacity-100 hover:bg-white hover:text-black transition hidden md:block"
        />
        
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth px-2"
          style={{ scrollbarWidth: 'none' }} 
        >
          {movies.map((movie) => (
             <div key={movie.id} className="min-w-[200px]">
               <MovieCard movie={movie} />
             </div>
          ))}
        </div>

        <MdChevronRight 
          onClick={() => slide(500)} 
          size={40} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full cursor-pointer opacity-0 group-hover/row:opacity-100 hover:bg-white hover:text-black transition hidden md:block"
        />
      </div>
    </div>
  );
};

export default Row;