import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../utils/apiConfig';
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      if (res.data.success) {
        setIsSubmitted(true);
        toast.success("Email sent!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-black flex items-center justify-center p-4 relative"
    >
      <Toaster />
      <Link to="/login" className="absolute top-8 left-8 text-white flex items-center gap-2 hover:text-primary transition">
        <IoArrowBack size={24} /> Back to Login
      </Link>

      <div className="w-full max-w-md bg-[#1c1c1e] p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-2 text-center">Reset Password</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Enter your email to receive reset instructions.</p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
              <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-1 text-white focus:border-primary focus:outline-none transition" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button disabled={isLoading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition transform active:scale-95 disabled:opacity-50">
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-white mb-2">Check your inbox</h3>
            <p className="text-gray-400 text-sm">We have sent a password reset link to <span className="text-white font-bold">{email}</span></p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;