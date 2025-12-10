import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchUniversalDetails } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { IoLogOut, IoPencil, IoCheckmark, IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '../components/Skeletons';
import { useNavigate } from 'react-router-dom';
import { AVATARS } from '../utils/constants';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  useEffect(() => {
    if (!user) {
        navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
        setEditName(user.username);
        setEditAvatar(user.avatar || AVATARS[0]);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(user._id, { username: editName, avatar: editAvatar });
    if (result.success) {
        toast.success("Profile Updated");
        setIsEditing(false);
    } else {
        toast.error("Failed to update");
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !user.wishlist) return;
      try {
        setLoading(true);
        const moviePromises = user.wishlist.map(id => fetchUniversalDetails(id));
        const results = await Promise.all(moviePromises);
        setWishlistMovies(results.filter(item => item !== null));
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-black pb-24 pt-20 md:pt-28 container mx-auto px-6 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8">
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-orange-600 p-1 shadow-lg shadow-primary/20">
               <img 
                 src={isEditing ? editAvatar : user.avatar || AVATARS[0]} 
                 className="w-full h-full rounded-full object-cover bg-black" 
                 alt="Avatar"
               />
            </div>
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-xs font-bold text-white pointer-events-none">
                    Change
                </div>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white font-bold outline-none focus:border-primary"
                    />
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide w-64">
                        {AVATARS.map((av, i) => (
                            <img 
                                key={i} src={av} 
                                onClick={() => setEditAvatar(av)}
                                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${editAvatar === av ? 'border-primary' : 'border-transparent'}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                </>
            )}
          </div>
        </div>

        <div className="flex gap-3">
            {isEditing ? (
                <>
                    <button onClick={() => setIsEditing(false)} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"><IoClose /></button>
                    <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition"><IoCheckmark /> Save</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 transition">
                    <IoPencil /> Edit
                </button>
            )}

            <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all group"
            >
            <IoLogOut className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-bold">Log Out</span>
            </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          My Collection
        </h2>
        
        {loading ? (
          <SkeletonGrid />
        ) : wishlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {wishlistMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} type={movie.media_type} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <p className="text-gray-500 mb-4">Your collection is empty.</p>
            <p className="text-sm text-gray-600">Go explore movies to add them here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;