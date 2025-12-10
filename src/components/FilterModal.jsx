import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoFilter } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const FilterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: 'movie',
    genre: '',
    year: '',
    country: '',
    sort: 'popularity.desc'
  });

  const genres = [
    { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' },
    { id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adv (TV)' }
  ];

  const countries = [
    { code: 'US', name: 'USA' }, { code: 'KR', name: 'South Korea' }, 
    { code: 'IN', name: 'India' }, { code: 'JP', name: 'Japan' },
    { code: 'GB', name: 'UK' }, { code: 'ES', name: 'Spain' }
  ];

  const handleApply = () => {
    const queryParams = new URLSearchParams(filters).toString();
    navigate(`/search/filter?${queryParams}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-[#1c1c1e] hover:bg-white/10 rounded-xl text-white transition border border-white/5"
      >
        <IoFilter />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-14 w-72 bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl p-5 z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Filters</h3>
                <IoClose className="cursor-pointer text-gray-400" onClick={() => setIsOpen(false)} />
              </div>

              <div className="space-y-4">
                {/* Type */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Type</label>
                  <div className="flex bg-black/50 p-1 rounded-lg">
                    {['movie', 'tv'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setFilters({ ...filters, type: t })}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition ${filters.type === t ? 'bg-white text-black' : 'text-gray-400'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Genre</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 text-white text-sm rounded-lg p-2 outline-none focus:border-white/30"
                    onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                  >
                    <option value="">All Genres</option>
                    {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                {/* Year & Country Row */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Year</label>
                    <input 
                      type="number" placeholder="2024"
                      className="w-full bg-black/50 border border-white/10 text-white text-sm rounded-lg p-2 outline-none"
                      onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Country</label>
                    <select 
                      className="w-full bg-black/50 border border-white/10 text-white text-sm rounded-lg p-2 outline-none"
                      onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    >
                      <option value="">All</option>
                      {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleApply}
                  className="w-full bg-white text-black font-bold py-2.5 rounded-xl hover:bg-gray-200 transition mt-2"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterModal;