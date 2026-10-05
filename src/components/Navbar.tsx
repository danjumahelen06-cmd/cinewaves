import React, { useState, useEffect } from 'react';
import { Search, Film, ShieldAlert } from 'lucide-react';
import { ActivePage } from '../types';
import { ProfileMenu } from './ProfileMenu';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSupabaseModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Movies', page: 'movies' },
    { label: 'TV Shows', page: 'tv-shows' },
    { label: 'My List', page: 'watchlist' },
    { label: 'Continue Watching', page: 'continue-watching' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080a0f]/95 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl'
          : 'bg-gradient-to-b from-[#080a0f]/90 via-[#080a0f]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: CineWave Wordmark Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
            aria-label="CineWave Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight font-display text-white group-hover:text-cyan-400 transition-colors">
                Cine<span className="text-cyan-400">Wave</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 4-6 Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={`transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: Actions (Search, Admin, Profile Menu) */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => onNavigate('search')}
            className={`p-2 rounded-full transition-colors ${
              currentPage === 'search'
                ? 'text-cyan-400 bg-slate-800'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Search CineWave catalog"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin shortcut badge if logged in as Admin */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                currentPage === 'admin'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30 hover:bg-cyan-950/70'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* Profile Menu Dropdown */}
          <ProfileMenu
            onNavigate={onNavigate}
            onOpenSupabaseModal={onOpenSupabaseModal}
          />
        </div>
      </div>
    </header>
  );
};
