import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoTimeOutline } from 'react-icons/io5';
import { searchMovies } from '../api/tmdb';
import { motion } from 'framer-motion';

const MobileSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(history);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const data = await searchMovies(query);
          const validResults = data.results.filter(item => item.media_type !== 'person');
          setResults(validResults);
        } catch (error) { console.error("Search failed", error); }
      } else { setResults([]); }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleSelect = (item) => {
    const type = item.media_type === 'tv' ? 'tv' : 'movie';
    addToHistory(item.title || item.name);
    navigate(`/${type}/${item.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query) {
      addToHistory(query);
      navigate(`/search/${query}`);
    }
  };

  const addToHistory = (term) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-20">
      <form onSubmit={handleSearchSubmit} className="relative mb-6">
        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        <input 
          type="text" 
          autoFocus
          placeholder="Search movies, shows..." 
          className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-all text-lg"
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="space-y-4">
        {query.length === 0 && recentSearches.length > 0 && (
          <div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Recent</h3>
            {recentSearches.map((term, index) => (
              <div key={index} onClick={() => { setQuery(term); navigate(`/search/${term}`); }} className="flex items-center gap-3 p-3 bg-[#111] rounded-xl mb-2 cursor-pointer active:scale-95 transition">
                <IoTimeOutline className="text-gray-400" />
                <span className="text-gray-200">{term}</span>
              </div>
            ))}
          </div>
        )}

        {results.map((item) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            key={item.id} 
            onClick={() => handleSelect(item)} 
            className="flex gap-4 p-3 bg-[#111] rounded-xl border border-white/5 active:bg-white/10 transition cursor-pointer"
          >
            <img src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : "https://via.placeholder.com/50"} className="w-16 h-24 object-cover rounded-lg" alt={item.title}/>
            <div className="flex flex-col justify-center">
              <h4 className="text-white font-bold line-clamp-2">{item.title || item.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{(item.release_date || item.first_air_date)?.split('-')[0] || 'N/A'}</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 uppercase">{item.media_type === 'tv' ? 'TV' : 'Movie'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobileSearch;