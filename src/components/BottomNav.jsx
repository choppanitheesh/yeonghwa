import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoHomeOutline, IoSearch, IoSearchOutline, IoHeart, IoHeartOutline } from 'react-icons/io5';

const BottomNav = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  if (isAuthPage) return null;

  const navItems = [
    { icon: IoHomeOutline, activeIcon: IoHome, label: "Home", path: "/" },
    { icon: IoSearchOutline, activeIcon: IoSearch, label: "Search", path: "/search" },
    { icon: IoHeartOutline, activeIcon: IoHeart, label: "Saved", path: "/profile" },
  ];

  return (
    <footer className="fixed bottom-0 w-full bg-[#0f0f0f]/95 backdrop-blur-md border-t border-white/5 md:hidden z-50 safe-area-bottom py-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, activeIcon: ActiveIcon, label, path }) => {
          const isActive = location.pathname === path || (path === '/search' && location.pathname.startsWith('/search'));
          return (
            <Link 
              key={label} 
              to={path} 
              className={`flex flex-col items-center gap-0.5 p-2 transition-all active:scale-90 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
            >
              {isActive ? <ActiveIcon size={20} /> : <Icon size={20} />}
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNav;
