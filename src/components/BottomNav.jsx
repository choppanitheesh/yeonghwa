import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoSearch, IoHeart, IoPerson } from 'react-icons/io5';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: IoHome, label: 'Home', path: '/' },
    { icon: IoSearch, label: 'Search', path: '/search' },
    { icon: IoHeart, label: 'Saved', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center p-3 pb-5">
        {navItems.map((item) => (
          <Link key={item.label} to={item.path} className="flex flex-col items-center gap-1">
            <item.icon 
              size={24} 
              className={`transition-colors ${isActive(item.path) ? 'text-primary' : 'text-gray-500'}`} 
            />
            <span className={`text-[10px] font-medium ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;