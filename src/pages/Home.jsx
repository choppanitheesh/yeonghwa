import { useQuery } from '@tanstack/react-query';
import { fetchTrending, fetchTrendingTV, fetchUpcoming } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import SmartRow from '../components/SmartRow';
import HeroBanner from '../components/HeroBanner';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import { SkeletonRow } from '../components/Skeletons';
import { getPersonalizedGenres } from '../utils/recommendations';
import { Virtuoso } from 'react-virtuoso'; 

const GENRE_BANK = [
  { id: 28, name: "Action Thrillers", type: "movie" },
  { id: 10765, name: "Sci-Fi & Fantasy TV", type: "tv" },
  { id: 27, name: "Horror Hits", type: "movie" },
  { id: 16, name: "Animation & Anime", type: "movie" },
  { id: 35, name: "Comedy Movies", type: "movie" },
  { id: 10749, name: "Romance", type: "movie" },
  { id: 18, name: "Critically Acclaimed Dramas", type: "movie" },
  { id: 10759, name: "Action & Adventure Series", type: "tv" },
  { id: 80, name: "Crime & Mystery", type: "movie" },
  { id: 10768, name: "War & Politics", type: "tv" },
  { id: 9648, name: "Mystery Thrillers", type: "movie" },
  { id: 37, name: "Westerns", type: "movie" },
  { id: 10762, name: "Kids' TV", type: "tv" },
  { id: 10766, name: "Soap Operas", type: "tv" },
  { id: 10763, name: "News & Current Events", type: "tv" },
  { id: 10764, name: "Reality TV", type: "tv" },
  { id: 10767, name: "Talk Shows", type: "tv" },
];

const ScrollRow = ({ movies, isUpcoming, type = 'movie' }) => (
  <div className="flex gap-4 overflow-x-auto pb-6 px-6 md:px-0 scrollbar-hide snap-x">
    {movies.map((movie) => (
      <div key={movie.id} className="min-w-[140px] md:min-w-[180px] snap-center">
        <MovieCard movie={movie} isUpcoming={isUpcoming} type={type} />
      </div>
    ))}
  </div>
);

const Home = () => {
  const { data: trending } = useQuery({ queryKey: ['trending'], queryFn: fetchTrending });
  const { data: trendingTV } = useQuery({ queryKey: ['trendingTV'], queryFn: fetchTrendingTV });
  const { data: upcoming } = useQuery({ queryKey: ['upcoming'], queryFn: fetchUpcoming });

  const [dynamicSections, setDynamicSections] = useState([]);
  
  const loadMoreContent = useCallback(() => {
    const sortedBank = getPersonalizedGenres(GENRE_BANK);
    const nextSections = [];
    
    for (let i = 0; i < 2; i++) {
        const randomGenre = sortedBank[Math.floor(Math.random() * sortedBank.length)];
        nextSections.push({ 
            ...randomGenre, 
            uniqueId: Date.now() + i + Math.random()
        });
    }

    setTimeout(() => {
        setDynamicSections(prev => [...prev, ...nextSections]);
    }, 500);
  }, []);

  useEffect(() => {
    loadMoreContent();
  }, []);

  if (!trending || !trendingTV || !upcoming) return (
    <div className="pb-24 pt-24 container mx-auto px-4 max-w-7xl">
       <div className="h-[60vh] bg-white/5 animate-pulse rounded-2xl mb-10" />
       <div className="mb-10"><SkeletonRow /></div>
       <div className="mb-10"><SkeletonRow /></div>
    </div>
  );

  const dataList = [
    { type: 'banner', data: trending.results.slice(0, 5) },
    { type: 'upcoming', data: upcoming.results },
    { type: 'trendingTV', data: trendingTV.results },
    { type: 'trending', data: trending.results },
    ...dynamicSections 
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      <Virtuoso
        useWindowScroll
        data={dataList}
        endReached={loadMoreContent}
        overscan={200}
        itemContent={(index, item) => {
          
          if (item.type === 'banner') return <HeroBanner content={item.data} />;

          if (item.type === 'upcoming') {
            return (
              <div className="mb-10 px-4 max-w-7xl mx-auto -mt-10 relative z-10">
                 <div className="flex justify-between items-end mb-4 px-2">
                   <h2 className="text-2xl font-bold tracking-tight text-white">Coming Soon</h2>
                   <Link to="/search/upcoming" className="text-primary text-sm font-medium flex items-center">See All <MdChevronRight /></Link>
                 </div>
                 <ScrollRow movies={item.data} isUpcoming={true} type="movie" />
              </div>
            );
          }

          if (item.type === 'trendingTV') {
            return (
              <div className="mb-10 px-4 max-w-7xl mx-auto">
                 <div className="flex justify-between items-end mb-4 px-2">
                   <h2 className="text-2xl font-bold tracking-tight text-white">Trending Series</h2>
                   <span className="text-xs text-gray-500 border border-white/10 px-2 py-1 rounded">TV Shows</span>
                 </div>
                 <ScrollRow movies={item.data} type="tv" />
              </div>
            );
          }

          if (item.type === 'trending') {
            return (
              <div className="mb-10 px-4 max-w-7xl mx-auto">
                 <div className="flex justify-between items-end mb-4 px-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Top Movies</h2>
                 </div>
                 <ScrollRow movies={item.data} type="movie" />
              </div>
            );
          }

          return (
            <div className="px-4 max-w-7xl mx-auto">
                <SmartRow 
                    title={item.name} 
                    type={item.type} 
                    genreId={item.id} 
                />
            </div>
          );
        }}
        
        components={{
          Footer: () => (
            <div className="py-10 text-center text-gray-500 animate-pulse flex justify-center items-center gap-2">
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
            </div>
          )
        }}
      />
    </div>
  );
};

export default Home;