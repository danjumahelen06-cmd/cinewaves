import React from 'react';
import { Home, Film, Tv, Search, Bookmark } from 'lucide-react';
import { ActivePage } from '../types';

interface MobileNavigationProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPage,
  onNavigate,
}) => {
  const items: { label: string; page: ActivePage; icon: React.ReactNode }[] = [
    { label: 'Home', page: 'home', icon: <Home className="w-5 h-5" /> },
    { label: 'Movies', page: 'movies', icon: <Film className="w-5 h-5" /> },
    { label: 'TV Shows', page: 'tv-shows', icon: <Tv className="w-5 h-5" /> },
    { label: 'Search', page: 'search', icon: <Search className="w-5 h-5" /> },
    { label: 'My List', page: 'watchlist', icon: <Bookmark className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080a0f]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around h-14">
      {items.map((item) => {
        const isActive = currentPage === item.page;
        return (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={isActive ? 'scale-110 transition-transform' : ''}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
