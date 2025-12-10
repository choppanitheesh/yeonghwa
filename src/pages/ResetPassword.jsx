import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../utils/apiConfig';
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const res = await axios.post(`${API_BASE_URL}/reset-password/${token}`, { password });
      if (res.data.success) {
        toast.success("Password Reset Successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-black flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md bg-[#1c1c1e] p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6 text-center">New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="New Password" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-4">Update Password</button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;