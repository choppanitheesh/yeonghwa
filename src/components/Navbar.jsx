import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect, useRef } from 'react';
import { IoSearch, IoPersonCircleOutline, IoLogOutOutline, IoTimeOutline } from 'react-icons/io5';
import { searchMovies } from '../api/tmdb';
import { AnimatePresence, motion } from 'framer-motion';
import FilterModal from './FilterModal'; 

const AVATARS = [
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", 
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const searchRef = useRef(null);

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(history);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const data = await searchMovies(query);
          const validResults = data.results.filter(item => item.media_type !== 'person').slice(0, 6);
          setResults(validResults); 
        } catch (error) { console.error("Search failed", error); }
      } else { setResults([]); }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleSelect = (item) => {
    const type = item.media_type === 'tv' ? 'tv' : 'movie';
    navigate(`/${type}/${item.id}`);
    addToHistory(item.title || item.name);
    setQuery("");
    setIsFocused(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query) {
      addToHistory(query);
      navigate(`/search/${query}`);
      setIsFocused(false);
    }
  };

  const addToHistory = (term) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 ${isAuthPage ? 'hidden' : 'block'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">
          yeonghwa<span className="text-primary">.</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-3">
            <div className="relative w-96" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
                <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" placeholder="Search movies & series..." 
                  className="w-full bg-[#1c1c1e] border border-transparent focus:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                  value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)}
                />
            </form>

            <AnimatePresence>
                {isFocused && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute top-full mt-2 w-full bg-[#1c1c1e] rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                >
                    {query.length === 0 && recentSearches.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">Recent Searches</p>
                        {recentSearches.map((term, index) => (
                          <div key={index} onClick={() => { setQuery(term); navigate(`/search/${term}`); setIsFocused(false); }} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors text-gray-300">
                            <IoTimeOutline /> <span className="text-sm">{term}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {query.length > 2 && results.length > 0 && (
                      <div className="p-2 border-t border-white/5">
                        <p className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">Top Results</p>
                        {results.map((item) => (
                            <div key={item.id} onClick={() => handleSelect(item)} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                                <img src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : "https://via.placeholder.com/50"} className="w-10 h-14 object-cover rounded-md" alt={item.title}/>
                                <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">{item.title || item.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span>{(item.release_date || item.first_air_date)?.split('-')[0]}</span>
                                    <span className="text-[10px] border border-white/20 px-1 rounded uppercase bg-white/5">{item.media_type === 'tv' ? 'TV' : 'Movie'}</span>
                                </div>
                                </div>
                            </div>
                        ))}
                      </div>
                    )}
                </motion.div>
                )}
            </AnimatePresence>
            </div>
            <FilterModal />
        </div>

        <div className="flex items-center gap-6">
          {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-orange-500 p-[2px]">
                    <img src={user.avatar || AVATARS[0]} className="w-full h-full rounded-full object-cover bg-black" alt="Profile" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition hidden lg:block">{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/10 rounded-full" title="Logout">
                  <IoLogOutOutline size={24} />
                </button>
              </div>
          ) : (
              <Link to="/login" className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition transform active:scale-95">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;