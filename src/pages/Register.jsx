import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AVATARS } from '../utils/constants';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await signup(email, password, username, selectedAvatar);
    if (result.success) {
      toast.success("Account created!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-black flex items-center justify-center p-4"
    >
      <Toaster />
      <div className="w-full max-w-md bg-[#1c1c1e] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-3xl font-black text-white mb-2 text-center relative z-10">Create Account</h1>
        <p className="text-gray-400 text-center mb-8 text-sm relative z-10">Join the yeonghwa community</p>

        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block text-center">Choose your Avatar</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((avatar, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`cursor-pointer rounded-full p-1 transition-all ${selectedAvatar === avatar ? 'bg-primary scale-110 ring-2 ring-primary ring-offset-2 ring-offset-black' : 'hover:bg-white/10'}`}
                >
                  <img src={avatar} alt="avatar" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-1 text-white focus:border-primary focus:outline-none transition"
              placeholder="MovieBuff99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-1 text-white focus:border-primary focus:outline-none transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-1 text-white focus:border-primary focus:outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-4 transform active:scale-95">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
          Already have an account? <Link to="/login" className="text-white hover:underline font-bold">Login</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;