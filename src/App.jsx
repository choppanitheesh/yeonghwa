import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import PersonDetails from './pages/PersonDetails';
import CollectionDetails from './pages/CollectionDetails';
import ForgotPassword from './pages/ForgotPassword';
import MobileSearch from './pages/MobileSearch';
import { useAuthStore } from './store/authStore';

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails type="movie" />} />
        <Route path="/collection/:id" element={<CollectionDetails />} />
        <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
        <Route path="/person/:id" element={<PersonDetails />} />
        
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<MobileSearch />} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
          <Navbar />
          <AnimatedRoutes />
          <BottomNav />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;