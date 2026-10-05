import React, { useState } from 'react';
import { User, Bookmark, Heart, History, Shield, Check, Edit3, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import { ActivePage } from '../types';

interface ProfilePageProps {
  onNavigate: (page: ActivePage) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { profile, updateProfile, isAdmin, toggleAdminRole } = useAuth();
  const { watchlist, favorites, watchHistory } = useStream();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || PRESET_AVATARS[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!profile) {
    return (
      <div className="pt-32 text-center text-slate-400">
        Please sign in to view your profile.
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      display_name: displayName,
      avatar_url: avatarUrl,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const memberSinceFormatted = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      {/* Header Profile Card */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-xl bg-slate-950">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {profile.display_name}
              </h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ADMINISTRATOR
                </span>
              )}
            </div>

            <p className="text-sm text-slate-400">{profile.email}</p>
            <p className="text-xs text-slate-500">Member since {memberSinceFormatted}</p>

            <div className="pt-3 flex items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={toggleAdminRole}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Toggle {isAdmin ? 'User Mode' : 'Admin Mode'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-8 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Update Profile Details
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Choose Avatar</label>
              <div className="flex items-center gap-3 flex-wrap">
                {PRESET_AVATARS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === preset
                        ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('watchlist')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">In My Watchlist</span>
            <div className="text-2xl font-bold font-display text-white tabular-nums">
              {watchlist.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('favorites')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Favorite Titles</span>
            <div className="text-2xl font-bold font-display text-white tabular-nums">
              {favorites.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('continue-watching')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Continue Watching</span>
            <div className="text-2xl font-bold font-display text-white tabular-nums">
              {watchHistory.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
