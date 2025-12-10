import { Link } from 'react-router-dom';
import { trackInteraction } from '../utils/recommendations';

const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_IMG = "https://via.placeholder.com/500x750?text=No+Image";

const MovieCard = ({ movie, isUpcoming = false, type = 'movie' }) => {
  const isTv = movie.media_type === 'tv' || type === 'tv' || (movie.name && !movie.title);
  const linkPath = isTv ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date ? date.split('-')[0] : 'N/A';

  const handleClick = () => {
    if (movie.genre_ids) {
      trackInteraction(movie.genre_ids);
    }
  };

  const getDaysLeft = () => {
    if (!date) return null;
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : null;
  };

  const daysLeft = isUpcoming ? getDaysLeft() : null;

  return (
    <Link to={linkPath} onClick={handleClick} className="block w-full cursor-pointer group/card">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[2/3] mb-3 shadow-lg border border-white/5">
        <img 
          src={movie.poster_path ? IMG_PATH + movie.poster_path : PLACEHOLDER_IMG} 
          alt={title} 
          className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover/card:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300" />
      </div>
      
      <div className="px-1 flex flex-col justify-start pb-2">
        <h3 className="font-bold text-white text-[13px] md:text-[15px] leading-snug line-clamp-2 min-h-[2.5em]" title={title}>
          {title}
        </h3>
        {daysLeft ? (
          <p className="text-xs text-primary font-medium mt-1">{daysLeft}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">{year}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;