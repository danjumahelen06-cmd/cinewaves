import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Bookmark,
  Heart,
  History,
  Settings,
  Shield,
  LogOut,
  Database,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ActivePage } from '../types';

interface ProfileMenuProps {
  onNavigate: (page: ActivePage) => void;
  onOpenSupabaseModal: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  onNavigate,
  onOpenSupabaseModal,
}) => {
  const { user, profile, isAdmin, signOut, toggleAdminRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('login')}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
        <button
          onClick={() => onNavigate('signup')}
          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Join Free</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-cyan-500/50 transition-all cursor-pointer"
        aria-label="User account menu"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-slate-700/80 shadow-md">
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="w-full h-full object-cover"
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 backdrop-blur-md">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-white truncate">
                {profile.display_name}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{profile.email}</p>
          </div>

          {/* Quick Role Switcher for seamless testing */}
          <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Admin Mode:</span>
              <button
                onClick={toggleAdminRole}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  isAdmin
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isAdmin ? 'Active' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1 text-xs">
            <button
              onClick={() => handleAction(() => onNavigate('profile'))}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>User Profile</span>
            </button>

            <button
              onClick={() => handleAction(() => onNavigate('watchlist'))}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>My List</span>
            </button>

            <button
              onClick={() => handleAction(() => onNavigate('favorites'))}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => handleAction(() => onNavigate('continue-watching'))}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Continue Watching</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleAction(() => onNavigate('admin'))}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 transition-colors text-left font-semibold"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={() => handleAction(() => onNavigate('settings'))}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleAction(onOpenSupabaseModal)}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <Database className="w-4 h-4 text-slate-400" />
              <span>Supabase Schema & Setup</span>
            </button>
          </div>

          {/* Logout */}
          <div className="pt-1 mt-1 border-t border-slate-800/80">
            <button
              onClick={() => handleAction(signOut)}
              className="w-full px-4 py-2 flex items-center gap-3 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-xs font-medium transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
