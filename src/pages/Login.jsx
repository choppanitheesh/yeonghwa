import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-black flex items-center justify-center p-4"
    >
      <Toaster position="bottom-center" />
      
      <div className="w-full max-w-md bg-[#1c1c1e] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <h1 className="text-3xl font-black text-white mb-2 text-center relative z-10">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8 text-sm relative z-10">Login to continue watching</p>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
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
            <div className="flex justify-between items-center ml-1 mb-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
            </div>
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
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
          New to yeonghwa? <Link to="/register" className="text-white hover:underline font-bold">Create Account</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;