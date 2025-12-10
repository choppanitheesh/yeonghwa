import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Corrupted user data found, clearing...", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getUserFromStorage(),
  isCheckingAuth: false,

  setUserData: (userData) => {
    set({ user: userData });
    localStorage.setItem("user", JSON.stringify(userData));
  },

  signup: async (email, password, username, avatar) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, { email, password, username, avatar });
      const userData = response.data.user;
      
      if (!userData) throw new Error("No user data received");

      set({ user: userData });
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const userData = response.data.user;

      if (!userData) throw new Error("No user data received");

      set({ user: userData });
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  },

  logout: async () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  updateProfile: async (userId, updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update/${userId}`, updates);
      const updatedUser = response.data.user || { ...getUserFromStorage(), ...updates };
      
      set({ user: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: "Update failed" };
    }
  }
}));